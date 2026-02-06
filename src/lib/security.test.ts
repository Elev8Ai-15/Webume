import { describe, it, expect } from 'vitest'
import { sanitizeInput, isValidEmail, isStrongPassword } from './security'

describe('sanitizeInput', () => {
  it('escapes HTML entities', () => {
    expect(sanitizeInput('<script>alert("xss")</script>')).toBe(
      '&lt;script&gt;alert(&quot;xss&quot;)&lt;&#x2F;script&gt;'
    )
  })

  it('trims whitespace', () => {
    expect(sanitizeInput('  hello  ')).toBe('hello')
  })

  it('truncates long input', () => {
    const longInput = 'a'.repeat(20000)
    expect(sanitizeInput(longInput).length).toBe(10000)
  })

  it('returns empty string for non-string input', () => {
    expect(sanitizeInput(null as any)).toBe('')
    expect(sanitizeInput(undefined as any)).toBe('')
    expect(sanitizeInput(123 as any)).toBe('')
  })
})

describe('isValidEmail', () => {
  it('accepts valid emails', () => {
    expect(isValidEmail('user@example.com')).toBe(true)
    expect(isValidEmail('user.name@domain.co.uk')).toBe(true)
  })

  it('rejects invalid emails', () => {
    expect(isValidEmail('')).toBe(false)
    expect(isValidEmail('notanemail')).toBe(false)
    expect(isValidEmail('@domain.com')).toBe(false)
    expect(isValidEmail('user@')).toBe(false)
  })

  it('rejects emails exceeding max length', () => {
    const longEmail = 'a'.repeat(250) + '@b.com'
    expect(isValidEmail(longEmail)).toBe(false)
  })
})

describe('isStrongPassword', () => {
  it('accepts strong passwords', () => {
    expect(isStrongPassword('StrongPass1')).toEqual({ valid: true })
    expect(isStrongPassword('MyP@ssw0rd!')).toEqual({ valid: true })
  })

  it('rejects short passwords', () => {
    const result = isStrongPassword('Ab1')
    expect(result.valid).toBe(false)
    expect(result.message).toContain('at least')
  })

  it('rejects passwords without uppercase', () => {
    const result = isStrongPassword('weakpass1')
    expect(result.valid).toBe(false)
    expect(result.message).toContain('uppercase')
  })

  it('rejects passwords without lowercase', () => {
    const result = isStrongPassword('ALLCAPS123')
    expect(result.valid).toBe(false)
    expect(result.message).toContain('lowercase')
  })

  it('rejects passwords without numbers', () => {
    const result = isStrongPassword('NoNumbersHere')
    expect(result.valid).toBe(false)
    expect(result.message).toContain('number')
  })
})
