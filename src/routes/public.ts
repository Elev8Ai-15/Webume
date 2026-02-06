import { Hono } from 'hono'
import type { AppEnv } from '../types'

const publicRoutes = new Hono<AppEnv>()

// Get public profile by slug (API)
publicRoutes.get('/public/:slug', async (c) => {
  const slug = c.req.param('slug')

  const email = await c.env.USERS_KV.get(`slug:${slug}`)
  if (!email) {
    return c.json({ error: 'Profile not found' }, 404)
  }

  const user = await c.env.USERS_KV.get(`user:${email}`, 'json') as any
  if (!user || !user.isPublic) {
    return c.json({ error: 'Profile not found or private' }, 404)
  }

  // Increment view count
  user.profileViews = (user.profileViews || 0) + 1
  user.lastViewedAt = new Date().toISOString()
  await c.env.USERS_KV.put(`user:${email}`, JSON.stringify(user))

  return c.json({
    name: user.name,
    profile: user.profile,
    profilePhoto: user.profilePhoto,
    selectedTemplate: user.selectedTemplate,
    views: user.profileViews
  })
})

export default publicRoutes
