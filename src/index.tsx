import { Hono } from 'hono'
import type { AppEnv } from './types'
import { registerMiddleware } from './middleware'

// Route modules
import stripeRoutes from './routes/stripe'
import authRoutes from './routes/auth'
import profileRoutes from './routes/profile'
import publicRoutes from './routes/public'
import resumeRoutes from './routes/resume'
import tailoredRoutes from './routes/tailored'
import chatRoutes from './routes/chat'
import pageRoutes from './routes/pages'

const app = new Hono<AppEnv>()

// Register global middleware (CORS, security headers, rate limiting)
registerMiddleware(app)

// API routes
app.route('/api/stripe', stripeRoutes)
app.route('/api/auth', authRoutes)
app.route('/api/profile', profileRoutes)
app.route('/api', publicRoutes)
app.route('/api', resumeRoutes)
app.route('/api', tailoredRoutes)
app.route('/api', chatRoutes)

// Page routes (main app, public profiles, manifest)
app.route('', pageRoutes)

export default app
