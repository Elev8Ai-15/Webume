import { Hono } from 'hono'
import { cors } from 'hono/cors'
import type { AppEnv } from '../types'
import { checkRateLimit } from '../lib/security'

export function registerMiddleware(app: Hono<AppEnv>) {
  // CORS configuration
  app.use('/api/*', cors({
    origin: ['https://webume.pages.dev', 'http://localhost:3000'],
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization', 'X-CSRF-Token'],
    credentials: true,
    maxAge: 86400,
  }))

  // Security headers middleware
  app.use('*', async (c, next) => {
    await next()

    c.res.headers.set('X-Content-Type-Options', 'nosniff')
    c.res.headers.set('X-Frame-Options', 'SAMEORIGIN')
    c.res.headers.set('X-XSS-Protection', '1; mode=block')
    c.res.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
    c.res.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')

    c.res.headers.set('Content-Security-Policy',
      "default-src 'self'; " +
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://unpkg.com https://cdnjs.cloudflare.com https://cdn.tailwindcss.com https://cdn.jsdelivr.net https://js.stripe.com; " +
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdnjs.cloudflare.com; " +
      "font-src 'self' https://fonts.gstatic.com https://cdnjs.cloudflare.com; " +
      "img-src 'self' data: blob: https:; " +
      "connect-src 'self' https://api.stripe.com https://generativelanguage.googleapis.com https://logo.clearbit.com https://img.logo.dev https://icons.duckduckgo.com; " +
      "frame-src https://js.stripe.com; " +
      "frame-ancestors 'self' https://*.genspark.ai https://*.gensparksite.com https://*.sandbox.novita.ai https://*.pages.dev;"
    )
  })

  // Rate limiting middleware for API routes
  app.use('/api/*', async (c, next) => {
    const ip = c.req.header('cf-connecting-ip') || c.req.header('x-forwarded-for') || 'unknown'
    const { allowed, remaining } = await checkRateLimit(c, ip)

    c.res.headers.set('X-RateLimit-Remaining', remaining.toString())

    if (!allowed) {
      return c.json({ error: 'Too many requests. Please try again later.' }, 429)
    }

    await next()
  })
}
