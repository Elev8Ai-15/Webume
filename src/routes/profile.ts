import { Hono } from 'hono'
import type { AppEnv } from '../types'
import { getCurrentUser } from '../lib/auth'

const profile = new Hono<AppEnv>()

// Save profile
profile.post('/save', async (c) => {
  const user = await getCurrentUser(c)
  if (!user) {
    return c.json({ error: 'Not authenticated' }, 401)
  }

  try {
    const { profile: profileData, profilePhoto, selectedTemplate, rawText } = await c.req.json()

    user.profile = profileData
    user.profilePhoto = profilePhoto
    user.selectedTemplate = selectedTemplate || user.selectedTemplate
    user.rawText = rawText || user.rawText
    user.updatedAt = new Date().toISOString()

    await c.env.USERS_KV.put(`user:${user.email}`, JSON.stringify(user))

    return c.json({ success: true, savedAt: user.updatedAt })
  } catch (error: any) {
    return c.json({ error: error.message }, 500)
  }
})

// Load profile
profile.get('/load', async (c) => {
  const user = await getCurrentUser(c)
  if (!user) {
    return c.json({ error: 'Not authenticated' }, 401)
  }

  return c.json({
    profile: user.profile,
    profilePhoto: user.profilePhoto,
    selectedTemplate: user.selectedTemplate,
    rawText: user.rawText,
    slug: user.slug,
    isPublic: user.isPublic || false,
    profileViews: user.profileViews || 0
  })
})

// Toggle profile public/private
profile.post('/publish', async (c) => {
  const user = await getCurrentUser(c)
  if (!user) {
    return c.json({ error: 'Not authenticated' }, 401)
  }

  const { isPublic } = await c.req.json()
  user.isPublic = isPublic
  await c.env.USERS_KV.put(`user:${user.email}`, JSON.stringify(user))

  return c.json({
    success: true,
    isPublic,
    publicUrl: isPublic ? `/p/${user.slug}` : null
  })
})

// Update profile slug
profile.post('/slug', async (c) => {
  const user = await getCurrentUser(c)
  if (!user) {
    return c.json({ error: 'Not authenticated' }, 401)
  }

  const { slug } = await c.req.json()
  const cleanSlug = slug.toLowerCase().replace(/[^a-z0-9-]/g, '').substring(0, 30)

  if (cleanSlug.length < 3) {
    return c.json({ error: 'Slug must be at least 3 characters' }, 400)
  }

  const existing = await c.env.USERS_KV.get(`slug:${cleanSlug}`)
  if (existing && existing !== user.email) {
    return c.json({ error: 'This URL is already taken' }, 400)
  }

  if (user.slug) {
    await c.env.USERS_KV.delete(`slug:${user.slug}`)
  }

  user.slug = cleanSlug
  await c.env.USERS_KV.put(`user:${user.email}`, JSON.stringify(user))
  await c.env.USERS_KV.put(`slug:${cleanSlug}`, user.email)

  return c.json({ success: true, slug: cleanSlug })
})

export default profile
