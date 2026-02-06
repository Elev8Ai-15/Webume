import { DEFAULT_GEMINI_API_KEY } from '../config'

export function generateSlug(name: string): string {
  const base = name.toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
  const random = Math.random().toString(36).substring(2, 6)
  return `${base}-${random}`
}

export function isPremiumUser(user: any): boolean {
  const planId = user?.subscription?.planId?.toLowerCase()
  return planId === 'pro' || planId === 'enterprise'
}

export function getGeminiApiKey(c: any): string {
  return c.env.GEMINI_API_KEY || DEFAULT_GEMINI_API_KEY
}
