import { describe, it, expect } from 'vitest'
import { generateSlug, isPremiumUser } from './helpers'

describe('generateSlug', () => {
  it('generates lowercase slug from name', () => {
    const slug = generateSlug('John Doe')
    expect(slug).toMatch(/^john-doe-[a-z0-9]{4}$/)
  })

  it('removes special characters', () => {
    const slug = generateSlug("Jane O'Brien-Smith")
    expect(slug).toMatch(/^jane-o-brien-smith-[a-z0-9]{4}$/)
  })

  it('handles empty string', () => {
    const slug = generateSlug('')
    expect(slug).toMatch(/^-[a-z0-9]{4}$/)
  })
})

describe('isPremiumUser', () => {
  it('returns true for pro users', () => {
    expect(isPremiumUser({ subscription: { planId: 'pro' } })).toBe(true)
    expect(isPremiumUser({ subscription: { planId: 'Pro' } })).toBe(true)
  })

  it('returns true for enterprise users', () => {
    expect(isPremiumUser({ subscription: { planId: 'enterprise' } })).toBe(true)
    expect(isPremiumUser({ subscription: { planId: 'Enterprise' } })).toBe(true)
  })

  it('returns false for free users', () => {
    expect(isPremiumUser({ subscription: { planId: 'free' } })).toBe(false)
  })

  it('returns false for users without subscription', () => {
    expect(isPremiumUser({})).toBe(false)
    expect(isPremiumUser(null)).toBe(false)
  })
})
