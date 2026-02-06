import { getCookie } from 'hono/cookie'
import { SECURITY_CONFIG } from '../config/security'

export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder()
  const salt = 'webume_secure_salt_v2_2024'
  const iterations = 100000

  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    encoder.encode(password),
    'PBKDF2',
    false,
    ['deriveBits']
  )

  const derivedBits = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: encoder.encode(salt),
      iterations: iterations,
      hash: 'SHA-256'
    },
    keyMaterial,
    256
  )

  const hashArray = Array.from(new Uint8Array(derivedBits))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  const newHash = await hashPassword(password)
  return newHash === hash
}

export function generateToken(): string {
  const array = new Uint8Array(32)
  crypto.getRandomValues(array)
  return Array.from(array).map(b => b.toString(16).padStart(2, '0')).join('')
}

export function generateCSRFToken(): string {
  const array = new Uint8Array(SECURITY_CONFIG.CSRF_TOKEN_LENGTH)
  crypto.getRandomValues(array)
  return Array.from(array).map(b => b.toString(16).padStart(2, '0')).join('')
}

export async function getCurrentUser(c: any): Promise<any> {
  const sessionToken = getCookie(c, 'webume_session')
  if (!sessionToken) return null

  try {
    const session = await c.env.USERS_KV.get(`session:${sessionToken}`, 'json')
    if (!session) return null

    const user = await c.env.USERS_KV.get(`user:${session.email}`, 'json')
    return user
  } catch {
    return null
  }
}

export async function checkLoginAttempts(c: any, email: string): Promise<{ allowed: boolean; attemptsRemaining: number }> {
  const key = `loginattempts:${email.toLowerCase()}`

  try {
    const data = await c.env.USERS_KV.get(key, 'json')
    if (!data) return { allowed: true, attemptsRemaining: SECURITY_CONFIG.MAX_LOGIN_ATTEMPTS }

    if (data.lockedUntil && Date.now() < data.lockedUntil) {
      return { allowed: false, attemptsRemaining: 0 }
    }

    if (data.lockedUntil && Date.now() >= data.lockedUntil) {
      await c.env.USERS_KV.delete(key)
      return { allowed: true, attemptsRemaining: SECURITY_CONFIG.MAX_LOGIN_ATTEMPTS }
    }

    return { allowed: true, attemptsRemaining: SECURITY_CONFIG.MAX_LOGIN_ATTEMPTS - (data.attempts || 0) }
  } catch {
    return { allowed: true, attemptsRemaining: SECURITY_CONFIG.MAX_LOGIN_ATTEMPTS }
  }
}

export async function recordFailedLogin(c: any, email: string): Promise<void> {
  const key = `loginattempts:${email.toLowerCase()}`

  try {
    const data = await c.env.USERS_KV.get(key, 'json') || { attempts: 0 }
    data.attempts = (data.attempts || 0) + 1

    if (data.attempts >= SECURITY_CONFIG.MAX_LOGIN_ATTEMPTS) {
      data.lockedUntil = Date.now() + SECURITY_CONFIG.LOCKOUT_DURATION
    }

    await c.env.USERS_KV.put(key, JSON.stringify(data), { expirationTtl: SECURITY_CONFIG.LOCKOUT_DURATION / 1000 })
  } catch {}
}

export async function clearLoginAttempts(c: any, email: string): Promise<void> {
  const key = `loginattempts:${email.toLowerCase()}`
  try {
    await c.env.USERS_KV.delete(key)
  } catch {}
}
