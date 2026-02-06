import { Hono } from 'hono'
import type { AppEnv } from '../types'
import { publicProfileTemplate } from '../templates/public-profile'
import { mainAppTemplate } from '../templates/main-app'
import { getManifest } from '../templates/manifest'

const pages = new Hono<AppEnv>()

// Public Profile View Page
pages.get('/p/:slug', async (c) => {
  const slug = c.req.param('slug')
  return c.html(publicProfileTemplate(slug))
})

// PWA Manifest
pages.get('/manifest.json', (c) => {
  return c.json(getManifest())
})

// Main App
pages.get('/', (c) => {
  c.header('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0')
  c.header('Pragma', 'no-cache')
  c.header('Expires', '0')
  return c.html(mainAppTemplate())
})

export default pages
