import { SECURITY_CONFIG } from '../config/security'

export function sanitizeInput(input: string): string {
  if (typeof input !== 'string') return ''
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
    .trim()
    .substring(0, 10000)
}

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email) && email.length <= 254
}

export function isStrongPassword(password: string): { valid: boolean; message?: string } {
  if (password.length < SECURITY_CONFIG.PASSWORD_MIN_LENGTH) {
    return { valid: false, message: `Password must be at least ${SECURITY_CONFIG.PASSWORD_MIN_LENGTH} characters` }
  }
  if (!/[A-Z]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one uppercase letter' }
  }
  if (!/[a-z]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one lowercase letter' }
  }
  if (!/[0-9]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one number' }
  }
  return { valid: true }
}

export async function checkRateLimit(c: any, identifier: string): Promise<{ allowed: boolean; remaining: number }> {
  const key = `ratelimit:${identifier}`
  const now = Date.now()
  const windowStart = now - SECURITY_CONFIG.RATE_LIMIT_WINDOW

  try {
    const data = await c.env.USERS_KV.get(key, 'json') || { requests: [] }
    data.requests = data.requests.filter((t: number) => t > windowStart)

    if (data.requests.length >= SECURITY_CONFIG.RATE_LIMIT_MAX_REQUESTS) {
      return { allowed: false, remaining: 0 }
    }

    data.requests.push(now)
    await c.env.USERS_KV.put(key, JSON.stringify(data), { expirationTtl: 120 })

    return { allowed: true, remaining: SECURITY_CONFIG.RATE_LIMIT_MAX_REQUESTS - data.requests.length }
  } catch {
    return { allowed: true, remaining: SECURITY_CONFIG.RATE_LIMIT_MAX_REQUESTS }
  }
}

export async function auditLog(c: any, action: string, userId: string, details: any = {}): Promise<void> {
  const key = `audit:${Date.now()}:${Math.random().toString(36).substring(2, 8)}`
  const log = {
    timestamp: new Date().toISOString(),
    action,
    userId,
    ip: c.req.header('cf-connecting-ip') || c.req.header('x-forwarded-for') || 'unknown',
    userAgent: c.req.header('user-agent') || 'unknown',
    details
  }

  try {
    await c.env.USERS_KV.put(key, JSON.stringify(log), { expirationTtl: 90 * 24 * 60 * 60 })
  } catch {}
}
