import { Hono } from 'hono'
import { setCookie, deleteCookie } from 'hono/cookie'
import type { AppEnv } from '../types'
import { SECURITY_CONFIG } from '../config/security'
import {
  hashPassword,
  verifyPassword,
  generateToken,
  generateCSRFToken,
  getCurrentUser,
  checkLoginAttempts,
  recordFailedLogin,
  clearLoginAttempts,
} from '../lib/auth'
import { sanitizeInput, isValidEmail, isStrongPassword, auditLog } from '../lib/security'
import { generateSlug } from '../lib/helpers'

const auth = new Hono<AppEnv>()

// Register
auth.post('/register', async (c) => {
  try {
    const body = await c.req.json()
    const email = sanitizeInput(body.email || '')
    const password = body.password || ''
    const name = sanitizeInput(body.name || '')

    if (!email || !password || !name) {
      return c.json({ error: 'Email, password, and name are required' }, 400)
    }

    if (!isValidEmail(email)) {
      return c.json({ error: 'Please enter a valid email address' }, 400)
    }

    const passwordCheck = isStrongPassword(password)
    if (!passwordCheck.valid) {
      return c.json({ error: passwordCheck.message }, 400)
    }

    const existing = await c.env.USERS_KV.get(`user:${email.toLowerCase()}`)
    if (existing) {
      return c.json({ error: 'An account with this email already exists' }, 400)
    }

    const hashedPassword = await hashPassword(password)
    const slug = generateSlug(name)
    const user = {
      email: email.toLowerCase(),
      name,
      slug,
      password: hashedPassword,
      createdAt: new Date().toISOString(),
      profile: null,
      profilePhoto: null,
      selectedTemplate: 'executive',
      rawText: '',
      isPublic: false,
      profileViews: 0,
      lastViewedAt: null,
      subscription: { planId: 'free', status: 'active' },
      settings: {
        emailNotifications: true,
        profileVisible: true
      }
    }

    await c.env.USERS_KV.put(`user:${email.toLowerCase()}`, JSON.stringify(user))
    await c.env.USERS_KV.put(`slug:${slug}`, email.toLowerCase())

    const token = generateToken()
    const csrfToken = generateCSRFToken()
    const session = {
      email: email.toLowerCase(),
      createdAt: new Date().toISOString(),
      csrfToken
    }
    await c.env.USERS_KV.put(`session:${token}`, JSON.stringify(session), { expirationTtl: SECURITY_CONFIG.SESSION_DURATION })

    setCookie(c, 'webume_session', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'Lax',
      maxAge: SECURITY_CONFIG.SESSION_DURATION,
      path: '/'
    })

    await auditLog(c, 'USER_REGISTERED', email.toLowerCase(), { name })

    return c.json({
      success: true,
      user: { email: user.email, name: user.name },
      csrfToken
    })
  } catch (_error: any) {
    return c.json({ error: 'Registration failed. Please try again.' }, 500)
  }
})

// Login
auth.post('/login', async (c) => {
  try {
    const body = await c.req.json()
    const email = sanitizeInput(body.email || '')
    const password = body.password || ''

    if (!email || !password) {
      return c.json({ error: 'Email and password are required' }, 400)
    }

    const { allowed, attemptsRemaining } = await checkLoginAttempts(c, email)
    if (!allowed) {
      return c.json({
        error: 'Account temporarily locked due to too many failed attempts. Please try again in 15 minutes.'
      }, 429)
    }

    const user = await c.env.USERS_KV.get(`user:${email.toLowerCase()}`, 'json') as any
    if (!user) {
      await recordFailedLogin(c, email)
      return c.json({ error: 'Invalid email or password' }, 401)
    }

    const passwordValid = await verifyPassword(password, user.password)
    if (!passwordValid) {
      await recordFailedLogin(c, email)
      await auditLog(c, 'LOGIN_FAILED', email.toLowerCase(), { reason: 'invalid_password' })
      return c.json({
        error: 'Invalid email or password',
        attemptsRemaining: attemptsRemaining - 1
      }, 401)
    }

    await clearLoginAttempts(c, email)

    const token = generateToken()
    const csrfToken = generateCSRFToken()
    const session = {
      email: email.toLowerCase(),
      createdAt: new Date().toISOString(),
      csrfToken,
      lastActive: new Date().toISOString()
    }
    await c.env.USERS_KV.put(`session:${token}`, JSON.stringify(session), { expirationTtl: SECURITY_CONFIG.SESSION_DURATION })

    setCookie(c, 'webume_session', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'Lax',
      maxAge: SECURITY_CONFIG.SESSION_DURATION,
      path: '/'
    })

    await auditLog(c, 'LOGIN_SUCCESS', email.toLowerCase(), {})

    return c.json({
      success: true,
      user: {
        email: user.email,
        name: user.name,
        hasProfile: !!user.profile,
        subscription: user.subscription || { planId: 'free', status: 'active' }
      },
      csrfToken
    })
  } catch (_error: any) {
    return c.json({ error: 'Login failed. Please try again.' }, 500)
  }
})

// Logout
auth.post('/logout', async (c) => {
  const { getCookie: getCookieFn } = await import('hono/cookie')
  const sessionToken = getCookieFn(c, 'webume_session')
  if (sessionToken) {
    await c.env.USERS_KV.delete(`session:${sessionToken}`)
  }
  deleteCookie(c, 'webume_session', { path: '/' })
  return c.json({ success: true })
})

// Get current user
auth.get('/me', async (c) => {
  const user = await getCurrentUser(c)
  if (!user) {
    return c.json({ user: null })
  }
  return c.json({
    user: {
      email: user.email,
      name: user.name,
      hasProfile: !!user.profile
    }
  })
})

export default auth
