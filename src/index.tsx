import { Hono } from 'hono'
import { getCookie, setCookie, deleteCookie } from 'hono/cookie'
import { cors } from 'hono/cors'

type Bindings = {
  USERS_KV: KVNamespace;
  STRIPE_SECRET_KEY?: string;
  STRIPE_WEBHOOK_SECRET?: string;
}

const app = new Hono<{ Bindings: Bindings }>()

const GEMINI_API_KEY = 'AIzaSyB9jQaRGkfj4Tyq5y5j45RiYAeb_H2e-2g';

// ============================================================
// STRIPE CONFIGURATION - Products and Prices
// ============================================================
const STRIPE_PRODUCTS = {
  FREE: {
    id: 'free',
    name: 'Free',
    price: 0,
    priceId: null,
    features: ['1 Profile', 'Basic Templates', 'Public URL', 'ATS Score Check'],
    limits: { tailoredResumes: 0, profiles: 1 }
  },
  PRO: {
    id: 'pro',
    name: 'Pro',
    price: 999, // $9.99/month in cents
    priceId: 'price_pro_monthly', // Will be created in Stripe
    features: ['🎯 AI Resume Tailor (Unlimited)', 'Unlimited Profiles', 'All 10 Templates', 'Custom Domain', 'Priority Support', 'PDF Export', 'Analytics Dashboard', 'Remove Watermark'],
    limits: { tailoredResumes: -1, profiles: -1 } // -1 = unlimited
  },
  ENTERPRISE: {
    id: 'enterprise', 
    name: 'Enterprise',
    price: 2999, // $29.99/month in cents
    priceId: 'price_enterprise_monthly',
    features: ['🎯 AI Resume Tailor (Unlimited)', 'Everything in Pro', 'Team Management', 'API Access', 'White Label', 'Dedicated Support', 'Custom Integrations', 'SLA Guarantee'],
    limits: { tailoredResumes: -1, profiles: -1 }
  }
};

// ============================================================
// SECURITY CONFIGURATION
// ============================================================
const SECURITY_CONFIG = {
  PASSWORD_MIN_LENGTH: 8,
  SESSION_DURATION: 30 * 24 * 60 * 60, // 30 days in seconds
  RATE_LIMIT_WINDOW: 60 * 1000, // 1 minute
  RATE_LIMIT_MAX_REQUESTS: 100,
  CSRF_TOKEN_LENGTH: 32,
  MAX_LOGIN_ATTEMPTS: 5,
  LOCKOUT_DURATION: 15 * 60 * 1000, // 15 minutes
};

// ============================================================
// ENHANCED PASSWORD HASHING (PBKDF2 - CF Workers compatible)
// ============================================================
async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const salt = 'webume_secure_salt_v2_2024';
  const iterations = 100000;
  
  // Import key for PBKDF2
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    encoder.encode(password),
    'PBKDF2',
    false,
    ['deriveBits']
  );
  
  // Derive bits using PBKDF2
  const derivedBits = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: encoder.encode(salt),
      iterations: iterations,
      hash: 'SHA-256'
    },
    keyMaterial,
    256
  );
  
  const hashArray = Array.from(new Uint8Array(derivedBits));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Verify password
async function verifyPassword(password: string, hash: string): Promise<boolean> {
  const newHash = await hashPassword(password);
  return newHash === hash;
}

// Generate session token
function generateToken(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array).map(b => b.toString(16).padStart(2, '0')).join('');
}

// Generate CSRF token
function generateCSRFToken(): string {
  const array = new Uint8Array(SECURITY_CONFIG.CSRF_TOKEN_LENGTH);
  crypto.getRandomValues(array);
  return Array.from(array).map(b => b.toString(16).padStart(2, '0')).join('');
}

// Input sanitization to prevent XSS
function sanitizeInput(input: string): string {
  if (typeof input !== 'string') return '';
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
    .trim()
    .substring(0, 10000); // Max length
}

// Email validation
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 254;
}

// Password strength validation
function isStrongPassword(password: string): { valid: boolean; message?: string } {
  if (password.length < SECURITY_CONFIG.PASSWORD_MIN_LENGTH) {
    return { valid: false, message: `Password must be at least ${SECURITY_CONFIG.PASSWORD_MIN_LENGTH} characters` };
  }
  if (!/[A-Z]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one uppercase letter' };
  }
  if (!/[a-z]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one lowercase letter' };
  }
  if (!/[0-9]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one number' };
  }
  return { valid: true };
}

// Rate limiting check
async function checkRateLimit(c: any, identifier: string): Promise<{ allowed: boolean; remaining: number }> {
  const key = `ratelimit:${identifier}`;
  const now = Date.now();
  const windowStart = now - SECURITY_CONFIG.RATE_LIMIT_WINDOW;
  
  try {
    const data = await c.env.USERS_KV.get(key, 'json') || { requests: [] };
    // Filter to only requests within window
    data.requests = data.requests.filter((t: number) => t > windowStart);
    
    if (data.requests.length >= SECURITY_CONFIG.RATE_LIMIT_MAX_REQUESTS) {
      return { allowed: false, remaining: 0 };
    }
    
    data.requests.push(now);
    await c.env.USERS_KV.put(key, JSON.stringify(data), { expirationTtl: 120 });
    
    return { allowed: true, remaining: SECURITY_CONFIG.RATE_LIMIT_MAX_REQUESTS - data.requests.length };
  } catch {
    return { allowed: true, remaining: SECURITY_CONFIG.RATE_LIMIT_MAX_REQUESTS };
  }
}

// Login attempt tracking
async function checkLoginAttempts(c: any, email: string): Promise<{ allowed: boolean; attemptsRemaining: number }> {
  const key = `loginattempts:${email.toLowerCase()}`;
  
  try {
    const data = await c.env.USERS_KV.get(key, 'json');
    if (!data) return { allowed: true, attemptsRemaining: SECURITY_CONFIG.MAX_LOGIN_ATTEMPTS };
    
    // Check if locked out
    if (data.lockedUntil && Date.now() < data.lockedUntil) {
      return { allowed: false, attemptsRemaining: 0 };
    }
    
    // Reset if lockout expired
    if (data.lockedUntil && Date.now() >= data.lockedUntil) {
      await c.env.USERS_KV.delete(key);
      return { allowed: true, attemptsRemaining: SECURITY_CONFIG.MAX_LOGIN_ATTEMPTS };
    }
    
    return { allowed: true, attemptsRemaining: SECURITY_CONFIG.MAX_LOGIN_ATTEMPTS - (data.attempts || 0) };
  } catch {
    return { allowed: true, attemptsRemaining: SECURITY_CONFIG.MAX_LOGIN_ATTEMPTS };
  }
}

// Record failed login attempt
async function recordFailedLogin(c: any, email: string): Promise<void> {
  const key = `loginattempts:${email.toLowerCase()}`;
  
  try {
    const data = await c.env.USERS_KV.get(key, 'json') || { attempts: 0 };
    data.attempts = (data.attempts || 0) + 1;
    
    if (data.attempts >= SECURITY_CONFIG.MAX_LOGIN_ATTEMPTS) {
      data.lockedUntil = Date.now() + SECURITY_CONFIG.LOCKOUT_DURATION;
    }
    
    await c.env.USERS_KV.put(key, JSON.stringify(data), { expirationTtl: SECURITY_CONFIG.LOCKOUT_DURATION / 1000 });
  } catch {}
}

// Clear login attempts on success
async function clearLoginAttempts(c: any, email: string): Promise<void> {
  const key = `loginattempts:${email.toLowerCase()}`;
  try {
    await c.env.USERS_KV.delete(key);
  } catch {}
}

// Audit logging
async function auditLog(c: any, action: string, userId: string, details: any = {}): Promise<void> {
  const key = `audit:${Date.now()}:${Math.random().toString(36).substring(2, 8)}`;
  const log = {
    timestamp: new Date().toISOString(),
    action,
    userId,
    ip: c.req.header('cf-connecting-ip') || c.req.header('x-forwarded-for') || 'unknown',
    userAgent: c.req.header('user-agent') || 'unknown',
    details
  };
  
  try {
    await c.env.USERS_KV.put(key, JSON.stringify(log), { expirationTtl: 90 * 24 * 60 * 60 }); // 90 days retention
  } catch {}
}

// Auth middleware to get current user
async function getCurrentUser(c: any): Promise<any> {
  const sessionToken = getCookie(c, 'webume_session');
  if (!sessionToken) return null;
  
  try {
    const session = await c.env.USERS_KV.get(`session:${sessionToken}`, 'json');
    if (!session) return null;
    
    const user = await c.env.USERS_KV.get(`user:${session.email}`, 'json');
    return user;
  } catch {
    return null;
  }
}

// Generate unique profile slug
function generateSlug(name: string): string {
  const base = name.toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
  const random = Math.random().toString(36).substring(2, 6);
  return `${base}-${random}`;
}

// ============================================================
// SECURITY MIDDLEWARE
// ============================================================

// CORS configuration
app.use('/api/*', cors({
  origin: ['https://webume.pages.dev', 'http://localhost:3000'],
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization', 'X-CSRF-Token'],
  credentials: true,
  maxAge: 86400,
}));

// Security headers middleware
app.use('*', async (c, next) => {
  await next();
  
  // Add security headers
  c.res.headers.set('X-Content-Type-Options', 'nosniff');
  // Allow framing from same origin and trusted domains (for PWA and sandbox preview)
  c.res.headers.set('X-Frame-Options', 'SAMEORIGIN');
  c.res.headers.set('X-XSS-Protection', '1; mode=block');
  c.res.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  c.res.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  
  // Content Security Policy - allow framing from self and sandbox domains
  c.res.headers.set('Content-Security-Policy', 
    "default-src 'self'; " +
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://unpkg.com https://cdnjs.cloudflare.com https://cdn.tailwindcss.com https://cdn.jsdelivr.net https://js.stripe.com; " +
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdnjs.cloudflare.com; " +
    "font-src 'self' https://fonts.gstatic.com https://cdnjs.cloudflare.com; " +
    "img-src 'self' data: blob: https:; " +
    "connect-src 'self' https://api.stripe.com https://generativelanguage.googleapis.com https://logo.clearbit.com https://img.logo.dev https://icons.duckduckgo.com; " +
    "frame-src https://js.stripe.com; " +
    "frame-ancestors 'self' https://*.genspark.ai https://*.gensparksite.com https://*.sandbox.novita.ai https://*.pages.dev;"
  );
});

// Rate limiting middleware for API routes
app.use('/api/*', async (c, next) => {
  const ip = c.req.header('cf-connecting-ip') || c.req.header('x-forwarded-for') || 'unknown';
  const { allowed, remaining } = await checkRateLimit(c, ip);
  
  c.res.headers.set('X-RateLimit-Remaining', remaining.toString());
  
  if (!allowed) {
    return c.json({ error: 'Too many requests. Please try again later.' }, 429);
  }
  
  await next();
});

// ============================================================
// STRIPE API ENDPOINTS
// ============================================================

// Get pricing plans
app.get('/api/stripe/plans', (c) => {
  return c.json({
    plans: Object.values(STRIPE_PRODUCTS).map(p => ({
      id: p.id,
      name: p.name,
      price: p.price,
      priceFormatted: p.price === 0 ? 'Free' : `$${(p.price / 100).toFixed(2)}/mo`,
      features: p.features
    }))
  });
});

// Create checkout session
app.post('/api/stripe/create-checkout', async (c) => {
  const user = await getCurrentUser(c);
  if (!user) {
    return c.json({ error: 'Authentication required' }, 401);
  }
  
  const { planId } = await c.req.json();
  const plan = Object.values(STRIPE_PRODUCTS).find(p => p.id === planId);
  
  if (!plan || plan.price === 0) {
    return c.json({ error: 'Invalid plan selected' }, 400);
  }
  
  const stripeKey = c.env.STRIPE_SECRET_KEY;
  if (!stripeKey) {
    return c.json({ error: 'Stripe not configured. Please add STRIPE_SECRET_KEY to environment.' }, 500);
  }
  
  try {
    // Create Stripe checkout session
    const response = await fetch('https://api.stripe.com/v1/checkout/sessions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${stripeKey}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        'mode': 'subscription',
        'success_url': `${c.req.header('origin') || 'https://webume.pages.dev'}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
        'cancel_url': `${c.req.header('origin') || 'https://webume.pages.dev'}/pricing`,
        'customer_email': user.email,
        'line_items[0][price]': plan.priceId || '',
        'line_items[0][quantity]': '1',
        'metadata[userId]': user.email,
        'metadata[planId]': plan.id,
      }).toString()
    });
    
    const session = await response.json();
    
    if (session.error) {
      return c.json({ error: session.error.message }, 400);
    }
    
    await auditLog(c, 'CHECKOUT_CREATED', user.email, { planId: plan.id, sessionId: session.id });
    
    return c.json({ 
      sessionId: session.id,
      url: session.url 
    });
  } catch (error: any) {
    return c.json({ error: 'Failed to create checkout session' }, 500);
  }
});

// Stripe webhook handler
app.post('/api/stripe/webhook', async (c) => {
  const stripeKey = c.env.STRIPE_SECRET_KEY;
  const webhookSecret = c.env.STRIPE_WEBHOOK_SECRET;
  
  if (!stripeKey || !webhookSecret) {
    return c.json({ error: 'Stripe not configured' }, 500);
  }
  
  const signature = c.req.header('stripe-signature');
  const body = await c.req.text();
  
  // In production, verify webhook signature
  // For now, parse the event
  try {
    const event = JSON.parse(body);
    
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        const userEmail = session.customer_email || session.metadata?.userId;
        const planId = session.metadata?.planId;
        
        if (userEmail && planId) {
          // Update user subscription
          const user = await c.env.USERS_KV.get(`user:${userEmail.toLowerCase()}`, 'json');
          if (user) {
            user.subscription = {
              planId,
              status: 'active',
              customerId: session.customer,
              subscriptionId: session.subscription,
              startedAt: new Date().toISOString()
            };
            await c.env.USERS_KV.put(`user:${userEmail.toLowerCase()}`, JSON.stringify(user));
            await auditLog(c, 'SUBSCRIPTION_ACTIVATED', userEmail, { planId });
          }
        }
        break;
      }
      
      case 'customer.subscription.deleted': {
        const subscription = event.data.object;
        // Find user by subscription ID and downgrade to free
        // Implementation would require storing subscriptionId -> email mapping
        break;
      }
      
      case 'invoice.payment_failed': {
        const invoice = event.data.object;
        // Handle failed payment - notify user, retry logic
        break;
      }
    }
    
    return c.json({ received: true });
  } catch (error) {
    return c.json({ error: 'Webhook processing failed' }, 400);
  }
});

// Get user subscription status
app.get('/api/stripe/subscription', async (c) => {
  const user = await getCurrentUser(c);
  if (!user) {
    return c.json({ error: 'Authentication required' }, 401);
  }
  
  return c.json({
    subscription: user.subscription || { planId: 'free', status: 'active' },
    plan: STRIPE_PRODUCTS[user.subscription?.planId?.toUpperCase() || 'FREE']
  });
});

// Cancel subscription
app.post('/api/stripe/cancel-subscription', async (c) => {
  const user = await getCurrentUser(c);
  if (!user) {
    return c.json({ error: 'Authentication required' }, 401);
  }
  
  if (!user.subscription?.subscriptionId) {
    return c.json({ error: 'No active subscription' }, 400);
  }
  
  const stripeKey = c.env.STRIPE_SECRET_KEY;
  if (!stripeKey) {
    return c.json({ error: 'Stripe not configured' }, 500);
  }
  
  try {
    const response = await fetch(`https://api.stripe.com/v1/subscriptions/${user.subscription.subscriptionId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${stripeKey}`,
      }
    });
    
    const result = await response.json();
    
    if (result.error) {
      return c.json({ error: result.error.message }, 400);
    }
    
    // Update user to free plan
    user.subscription = { planId: 'free', status: 'active', cancelledAt: new Date().toISOString() };
    await c.env.USERS_KV.put(`user:${user.email.toLowerCase()}`, JSON.stringify(user));
    
    await auditLog(c, 'SUBSCRIPTION_CANCELLED', user.email, {});
    
    return c.json({ success: true, message: 'Subscription cancelled' });
  } catch (error) {
    return c.json({ error: 'Failed to cancel subscription' }, 500);
  }
});

// API: Register new user (with enhanced security)
app.post('/api/auth/register', async (c) => {
  try {
    const body = await c.req.json();
    const email = sanitizeInput(body.email || '');
    const password = body.password || '';
    const name = sanitizeInput(body.name || '');
    
    // Validate required fields
    if (!email || !password || !name) {
      return c.json({ error: 'Email, password, and name are required' }, 400);
    }
    
    // Validate email format
    if (!isValidEmail(email)) {
      return c.json({ error: 'Please enter a valid email address' }, 400);
    }
    
    // Validate password strength
    const passwordCheck = isStrongPassword(password);
    if (!passwordCheck.valid) {
      return c.json({ error: passwordCheck.message }, 400);
    }
    
    // Check if user exists
    const existing = await c.env.USERS_KV.get(`user:${email.toLowerCase()}`);
    if (existing) {
      return c.json({ error: 'An account with this email already exists' }, 400);
    }
    
    // Create user with unique public profile slug
    const hashedPassword = await hashPassword(password);
    const slug = generateSlug(name);
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
      subscription: { planId: 'free', status: 'active' }, // Default to free plan
      settings: {
        emailNotifications: true,
        profileVisible: true
      }
    };
    
    await c.env.USERS_KV.put(`user:${email.toLowerCase()}`, JSON.stringify(user));
    // Also store slug mapping for public profiles
    await c.env.USERS_KV.put(`slug:${slug}`, email.toLowerCase());
    
    // Create session
    const token = generateToken();
    const csrfToken = generateCSRFToken();
    const session = { 
      email: email.toLowerCase(), 
      createdAt: new Date().toISOString(),
      csrfToken 
    };
    await c.env.USERS_KV.put(`session:${token}`, JSON.stringify(session), { expirationTtl: SECURITY_CONFIG.SESSION_DURATION });
    
    setCookie(c, 'webume_session', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'Lax',
      maxAge: SECURITY_CONFIG.SESSION_DURATION,
      path: '/'
    });
    
    // Audit log
    await auditLog(c, 'USER_REGISTERED', email.toLowerCase(), { name });
    
    return c.json({ 
      success: true, 
      user: { email: user.email, name: user.name },
      csrfToken 
    });
  } catch (error: any) {
    return c.json({ error: 'Registration failed. Please try again.' }, 500);
  }
});

// API: Login (with enhanced security)
app.post('/api/auth/login', async (c) => {
  try {
    const body = await c.req.json();
    const email = sanitizeInput(body.email || '');
    const password = body.password || '';
    
    if (!email || !password) {
      return c.json({ error: 'Email and password are required' }, 400);
    }
    
    // Check for account lockout
    const { allowed, attemptsRemaining } = await checkLoginAttempts(c, email);
    if (!allowed) {
      return c.json({ 
        error: 'Account temporarily locked due to too many failed attempts. Please try again in 15 minutes.' 
      }, 429);
    }
    
    const user = await c.env.USERS_KV.get(`user:${email.toLowerCase()}`, 'json') as any;
    if (!user) {
      await recordFailedLogin(c, email);
      return c.json({ error: 'Invalid email or password' }, 401);
    }
    
    // Verify password using new method
    const passwordValid = await verifyPassword(password, user.password);
    if (!passwordValid) {
      await recordFailedLogin(c, email);
      await auditLog(c, 'LOGIN_FAILED', email.toLowerCase(), { reason: 'invalid_password' });
      return c.json({ 
        error: 'Invalid email or password',
        attemptsRemaining: attemptsRemaining - 1
      }, 401);
    }
    
    // Clear failed attempts on successful login
    await clearLoginAttempts(c, email);
    
    // Create session with CSRF token
    const token = generateToken();
    const csrfToken = generateCSRFToken();
    const session = { 
      email: email.toLowerCase(), 
      createdAt: new Date().toISOString(),
      csrfToken,
      lastActive: new Date().toISOString()
    };
    await c.env.USERS_KV.put(`session:${token}`, JSON.stringify(session), { expirationTtl: SECURITY_CONFIG.SESSION_DURATION });
    
    setCookie(c, 'webume_session', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'Lax',
      maxAge: SECURITY_CONFIG.SESSION_DURATION,
      path: '/'
    });
    
    // Audit log
    await auditLog(c, 'LOGIN_SUCCESS', email.toLowerCase(), {});
    
    return c.json({ 
      success: true, 
      user: { 
        email: user.email, 
        name: user.name,
        hasProfile: !!user.profile,
        subscription: user.subscription || { planId: 'free', status: 'active' }
      },
      csrfToken
    });
  } catch (error: any) {
    return c.json({ error: 'Login failed. Please try again.' }, 500);
  }
});

// API: Logout
app.post('/api/auth/logout', async (c) => {
  const sessionToken = getCookie(c, 'webume_session');
  if (sessionToken) {
    await c.env.USERS_KV.delete(`session:${sessionToken}`);
  }
  deleteCookie(c, 'webume_session', { path: '/' });
  return c.json({ success: true });
});

// API: Get current user
app.get('/api/auth/me', async (c) => {
  const user = await getCurrentUser(c);
  if (!user) {
    return c.json({ user: null });
  }
  return c.json({ 
    user: { 
      email: user.email, 
      name: user.name,
      hasProfile: !!user.profile
    } 
  });
});

// API: Save profile (requires auth)
app.post('/api/profile/save', async (c) => {
  const user = await getCurrentUser(c);
  if (!user) {
    return c.json({ error: 'Not authenticated' }, 401);
  }
  
  try {
    const { profile, profilePhoto, selectedTemplate, rawText } = await c.req.json();
    
    user.profile = profile;
    user.profilePhoto = profilePhoto;
    user.selectedTemplate = selectedTemplate || user.selectedTemplate;
    user.rawText = rawText || user.rawText;
    user.updatedAt = new Date().toISOString();
    
    await c.env.USERS_KV.put(`user:${user.email}`, JSON.stringify(user));
    
    return c.json({ success: true, savedAt: user.updatedAt });
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

// API: Load profile (requires auth)
app.get('/api/profile/load', async (c) => {
  const user = await getCurrentUser(c);
  if (!user) {
    return c.json({ error: 'Not authenticated' }, 401);
  }
  
  return c.json({
    profile: user.profile,
    profilePhoto: user.profilePhoto,
    selectedTemplate: user.selectedTemplate,
    rawText: user.rawText,
    slug: user.slug,
    isPublic: user.isPublic || false,
    profileViews: user.profileViews || 0
  });
});

// API: Toggle profile public/private
app.post('/api/profile/publish', async (c) => {
  const user = await getCurrentUser(c);
  if (!user) {
    return c.json({ error: 'Not authenticated' }, 401);
  }
  
  const { isPublic } = await c.req.json();
  user.isPublic = isPublic;
  await c.env.USERS_KV.put(`user:${user.email}`, JSON.stringify(user));
  
  return c.json({ 
    success: true, 
    isPublic, 
    publicUrl: isPublic ? `/p/${user.slug}` : null 
  });
});

// API: Update profile slug (custom URL)
app.post('/api/profile/slug', async (c) => {
  const user = await getCurrentUser(c);
  if (!user) {
    return c.json({ error: 'Not authenticated' }, 401);
  }
  
  const { slug } = await c.req.json();
  const cleanSlug = slug.toLowerCase().replace(/[^a-z0-9-]/g, '').substring(0, 30);
  
  if (cleanSlug.length < 3) {
    return c.json({ error: 'Slug must be at least 3 characters' }, 400);
  }
  
  // Check if slug is taken
  const existing = await c.env.USERS_KV.get(`slug:${cleanSlug}`);
  if (existing && existing !== user.email) {
    return c.json({ error: 'This URL is already taken' }, 400);
  }
  
  // Remove old slug mapping
  if (user.slug) {
    await c.env.USERS_KV.delete(`slug:${user.slug}`);
  }
  
  // Set new slug
  user.slug = cleanSlug;
  await c.env.USERS_KV.put(`user:${user.email}`, JSON.stringify(user));
  await c.env.USERS_KV.put(`slug:${cleanSlug}`, user.email);
  
  return c.json({ success: true, slug: cleanSlug });
});

// API: Get public profile by slug (for viewing)
app.get('/api/public/:slug', async (c) => {
  const slug = c.req.param('slug');
  
  const email = await c.env.USERS_KV.get(`slug:${slug}`);
  if (!email) {
    return c.json({ error: 'Profile not found' }, 404);
  }
  
  const user = await c.env.USERS_KV.get(`user:${email}`, 'json') as any;
  if (!user || !user.isPublic) {
    return c.json({ error: 'Profile not found or private' }, 404);
  }
  
  // Increment view count
  user.profileViews = (user.profileViews || 0) + 1;
  user.lastViewedAt = new Date().toISOString();
  await c.env.USERS_KV.put(`user:${email}`, JSON.stringify(user));
  
  // Return public profile data (no sensitive info)
  return c.json({
    name: user.name,
    profile: user.profile,
    profilePhoto: user.profilePhoto,
    selectedTemplate: user.selectedTemplate,
    views: user.profileViews
  });
});

// API: ATS Score Analysis
app.post('/api/ats-score', async (c) => {
  try {
    const { profile, jobDescription } = await c.req.json();
    
    if (!profile) {
      return c.json({ error: 'Profile is required' }, 400);
    }
    
    // Extract keywords from job description or use common ATS keywords
    const commonKeywords = [
      'leadership', 'management', 'strategy', 'analytics', 'communication',
      'project management', 'team', 'budget', 'revenue', 'growth',
      'development', 'implementation', 'optimization', 'collaboration',
      'stakeholder', 'presentation', 'reporting', 'analysis', 'planning'
    ];
    
    const profileText = JSON.stringify(profile).toLowerCase();
    const skills = profile.skills || [];
    
    let score = 0;
    const matches = [];
    const missing = [];
    
    // Check for keyword matches
    commonKeywords.forEach(keyword => {
      if (profileText.includes(keyword.toLowerCase())) {
        score += 5;
        matches.push(keyword);
      } else {
        missing.push(keyword);
      }
    });
    
    // Bonus for completeness
    if (profile.basics?.name) score += 5;
    if (profile.basics?.email) score += 5;
    if (profile.basics?.phone) score += 3;
    if (profile.basics?.summary && profile.basics.summary.length > 100) score += 10;
    if (profile.experience?.length > 0) score += 15;
    if (profile.experience?.length > 2) score += 5;
    if (skills.length >= 5) score += 10;
    if (skills.length >= 10) score += 5;
    if (profile.education?.length > 0) score += 5;
    if (profile.achievements?.length > 0) score += 5;
    
    // Cap at 100
    score = Math.min(100, score);
    
    return c.json({
      score,
      grade: score >= 90 ? 'A+' : score >= 80 ? 'A' : score >= 70 ? 'B' : score >= 60 ? 'C' : 'D',
      matches: matches.slice(0, 10),
      suggestions: missing.slice(0, 5).map(k => `Consider adding "${k}" to your profile`),
      tips: [
        score < 70 ? 'Add more quantifiable achievements with numbers' : null,
        skills.length < 10 ? 'Add more relevant skills to improve matching' : null,
        !profile.basics?.summary ? 'Add a professional summary' : null,
        profile.experience?.length < 2 ? 'Add more work experience details' : null
      ].filter(Boolean)
    });
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

app.post('/api/parse-resume', async (c) => {
  try {
    const { text } = await c.req.json();
    
    const prompt = `You are an elite career analyst, executive resume writer, and talent acquisition expert with 20+ years experience. Analyze this resume DEEPLY and extract MAXIMUM value to create a comprehensive, impressive professional profile.

RESUME TEXT TO ANALYZE:
${text}

YOUR MISSION - Create the most detailed, impactful profile possible:

## BASICS EXTRACTION
- Extract the person's full name, most recent/impressive job title
- Create a POWERFUL tagline (like "Visionary Tech Leader Who Scaled Teams 10x and Drove $50M Revenue")
- Write a compelling 3-4 sentence executive summary highlighting their unique value proposition
- Extract all contact info (email, phone, location, LinkedIn, website)

## EXPERIENCE ANALYSIS (This is CRITICAL - be extremely thorough)
For EACH position, provide:

1. **DESCRIPTION** (5-8 sentences minimum):
   - Opening sentence: Core role and scope of responsibility
   - Key projects led or contributed to (name specific initiatives if mentioned)
   - Technologies, methodologies, tools used daily
   - Cross-functional collaboration and stakeholder management
   - Leadership scope (direct reports, team size, budget if applicable)
   - Major wins and accomplishments in this role
   - How they advanced the company's mission or bottom line
   - Closing sentence: Career growth or recognition received

2. **RESPONSIBILITIES** (8-12 bullet points):
   - Be SPECIFIC to this role and industry
   - Start each with strong action verbs (Led, Architected, Spearheaded, Optimized, etc.)
   - Include scope/scale where possible (e.g., "Managed portfolio of 15+ enterprise clients")
   - Mix strategic and tactical duties
   
3. **DAY IN THE LIFE** (Create a realistic, detailed schedule):
   - 8:30 AM: Morning routine specific to this role
   - 9:30 AM: Core morning work activity
   - 11:00 AM: Meetings or collaboration time
   - 12:30 PM: Midday activity
   - 2:00 PM: Afternoon deep work
   - 4:00 PM: Late afternoon tasks
   - 5:30 PM: End of day wrap-up

4. **METRICS** (Generate 4 impressive metrics, estimate if not explicit):
   - Revenue/cost impact (e.g., "+$2.5M revenue", "-40% costs")
   - Scale/efficiency (e.g., "10x throughput", "200% growth")
   - Team/scope (e.g., "25 direct reports", "50+ stakeholders")
   - Quality/speed (e.g., "99.9% uptime", "3x faster delivery")

## SKILLS EXTRACTION
- Extract EVERY skill mentioned in the resume
- Add 10-15 related/inferred skills based on the roles
- Group logically: Technical, Leadership, Domain, Soft skills

## ACHIEVEMENTS
- Extract explicit achievements AND infer major wins from job descriptions
- Write each as a compelling mini-story with context and impact

## EDUCATION & CERTIFICATIONS
- Extract all degrees, schools, graduation years, honors
- List all professional certifications

RETURN THIS EXACT JSON STRUCTURE:
{
  "basics": {
    "name": "Full Name",
    "title": "Most Impressive Job Title",
    "tagline": "Powerful 1-line value proposition with specific achievements",
    "email": "email@domain.com",
    "phone": "phone number",
    "location": "City, State/Country",
    "linkedin": "linkedin URL",
    "website": "website URL",
    "summary": "3-4 sentence executive summary showcasing unique expertise and career trajectory"
  },
  "experience": [
    {
      "company": "Company Name",
      "companyInfo": {
        "website": "company website URL (e.g., https://google.com)",
        "domain": "company domain for logo lookup (e.g., google.com)",
        "industry": "Industry sector",
        "location": "Company HQ city, state/country",
        "size": "Company size (e.g., 10,000+ employees, Fortune 500)",
        "description": "1-2 sentence company description"
      },
      "role": "Job Title",
      "startDate": "Mon YYYY",
      "endDate": "Mon YYYY or Present",
      "description": "COMPREHENSIVE 5-8 sentence description covering responsibilities, projects, technologies, leadership, and achievements. Make it read like a polished executive resume.",
      "responsibilities": ["Action-verb duty 1 with scope", "Action-verb duty 2", "...", "8-12 total"],
      "dayInLife": [
        {"time": "8:30 AM", "activity": "Role-specific morning activity"},
        {"time": "9:30 AM", "activity": "Core work activity"},
        {"time": "11:00 AM", "activity": "Collaborative work"},
        {"time": "12:30 PM", "activity": "Midday task"},
        {"time": "2:00 PM", "activity": "Afternoon focus work"},
        {"time": "4:00 PM", "activity": "Late afternoon activity"},
        {"time": "5:30 PM", "activity": "Wrap-up activity"}
      ],
      "metrics": [
        {"value": "+XX%", "label": "Specific metric"},
        {"value": "$X.XM", "label": "Financial impact"},
        {"value": "XX", "label": "Scale metric"},
        {"value": "XX%", "label": "Improvement metric"}
      ]
    }
  ],
  "skills": ["Skill 1", "Skill 2", "... 15-25 total skills"],
  "achievements": [
    {"title": "Achievement Title", "description": "Compelling 2-3 sentence description with context and impact"}
  ],
  "education": [
    {"degree": "Degree", "school": "Institution", "year": "Year", "details": "Honors, GPA, relevant details"}
  ],
  "certifications": ["Cert 1", "Cert 2"]
}

## COMPANY INFO REQUIREMENTS
For each company, you MUST provide:
- Website URL (research or infer based on company name)
- Domain (clean domain for logo lookup, e.g., "google.com", "microsoft.com")
- Industry sector
- Location (headquarters)
- Company size estimate
- Brief company description

ABSOLUTE REQUIREMENTS:
- NEVER use generic descriptions - be SPECIFIC to this person's actual experience
- ALWAYS include concrete numbers, percentages, dollar amounts in metrics
- Write descriptions that would impress a Fortune 500 recruiter
- Generate realistic estimates for any metrics not explicitly stated
- Return ONLY valid JSON with no markdown formatting or code blocks
- Use empty string "" for missing fields, NEVER null`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.1, maxOutputTokens: 8192 }
        })
      }
    );

    const data = await response.json();
    if (data.error) return c.json({ error: data.error.message }, 500);
    
    const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    if (!aiText) return c.json({ error: 'No response from AI' }, 500);
    
    try {
      // Remove markdown code blocks - handle various formats
      let jsonStr = aiText
        .replace(/```json\n?/gi, '')
        .replace(/```\n?/gi, '')
        .replace(/\n?```/gi, '')
        .trim();
      
      // If still not starting with {, extract JSON object
      if (!jsonStr.startsWith('{')) {
        const match = jsonStr.match(/\{[\s\S]*\}/);
        if (match) jsonStr = match[0];
      }
      
      const parsed = JSON.parse(jsonStr);
      return c.json(parsed);
    } catch (e) {
      // Try one more extraction method
      try {
        const match = aiText.match(/\{[\s\S]*\}/);
        if (match) {
          return c.json(JSON.parse(match[0]));
        }
      } catch {}
      return c.json({ error: 'Parse failed', raw: aiText }, 500);
    }
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

// ============================================================
// AI RESUME TAILOR - Premium Feature (Pro/Enterprise only)
// ============================================================

// Check if user has premium subscription
function isPremiumUser(user: any): boolean {
  const planId = user?.subscription?.planId?.toLowerCase();
  return planId === 'pro' || planId === 'enterprise';
}

// Get user's tailored resumes
app.get('/api/tailored-resumes', async (c) => {
  const user = await getCurrentUser(c);
  if (!user) {
    return c.json({ error: 'Authentication required' }, 401);
  }
  
  // Get tailored resumes from user data
  const tailoredResumes = user.tailoredResumes || [];
  return c.json({ resumes: tailoredResumes });
});

// Save a tailored resume
app.post('/api/tailored-resumes/save', async (c) => {
  const user = await getCurrentUser(c);
  if (!user) {
    return c.json({ error: 'Authentication required' }, 401);
  }
  
  if (!isPremiumUser(user)) {
    return c.json({ 
      error: 'Premium feature', 
      message: 'AI Resume Tailoring requires a Pro or Enterprise subscription',
      upgradeUrl: '/pricing'
    }, 403);
  }
  
  try {
    const { tailoredResume } = await c.req.json();
    
    if (!tailoredResume || !tailoredResume.jobTitle || !tailoredResume.company) {
      return c.json({ error: 'Invalid tailored resume data' }, 400);
    }
    
    // Initialize tailored resumes array if doesn't exist
    if (!user.tailoredResumes) {
      user.tailoredResumes = [];
    }
    
    // Add ID and timestamp
    const newResume = {
      id: Date.now(),
      ...tailoredResume,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    // Limit to 50 saved resumes (prevent storage bloat)
    if (user.tailoredResumes.length >= 50) {
      user.tailoredResumes = user.tailoredResumes.slice(-49);
    }
    
    user.tailoredResumes.push(newResume);
    
    await c.env.USERS_KV.put(`user:${user.email.toLowerCase()}`, JSON.stringify(user));
    await auditLog(c, 'TAILORED_RESUME_SAVED', user.email, { jobTitle: tailoredResume.jobTitle, company: tailoredResume.company });
    
    return c.json({ success: true, resume: newResume });
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

// Delete a tailored resume
app.delete('/api/tailored-resumes/:id', async (c) => {
  const user = await getCurrentUser(c);
  if (!user) {
    return c.json({ error: 'Authentication required' }, 401);
  }
  
  const id = parseInt(c.req.param('id'));
  
  if (!user.tailoredResumes) {
    return c.json({ error: 'No tailored resumes found' }, 404);
  }
  
  user.tailoredResumes = user.tailoredResumes.filter((r: any) => r.id !== id);
  await c.env.USERS_KV.put(`user:${user.email.toLowerCase()}`, JSON.stringify(user));
  
  return c.json({ success: true });
});

// AI Resume Tailor - Generate tailored resume for specific job
app.post('/api/tailor-resume', async (c) => {
  const user = await getCurrentUser(c);
  if (!user) {
    return c.json({ error: 'Authentication required' }, 401);
  }
  
  // Premium feature check
  if (!isPremiumUser(user)) {
    return c.json({ 
      error: 'Premium feature', 
      message: 'AI Resume Tailoring requires a Pro or Enterprise subscription. Upgrade now to create unlimited tailored resumes for every job application!',
      upgradeUrl: '/pricing',
      plans: {
        pro: { price: '$9.99/mo', features: ['Unlimited Tailored Resumes', 'All 10 Templates', 'PDF Export'] },
        enterprise: { price: '$29.99/mo', features: ['Everything in Pro', 'Team Management', 'API Access'] }
      }
    }, 403);
  }
  
  try {
    const { jobDescription, jobTitle, company, jobUrl } = await c.req.json();
    
    if (!jobDescription) {
      return c.json({ error: 'Job description is required' }, 400);
    }
    
    if (!user.profile) {
      return c.json({ error: 'Please complete your master profile first before tailoring resumes' }, 400);
    }
    
    const masterProfile = user.profile;
    
    const prompt = `You are an elite executive resume writer, career strategist, and ATS optimization expert. Your task is to create a PERFECTLY TAILORED resume that maximizes this candidate's chances of getting an interview.

## THE TARGET JOB
Job Title: ${jobTitle || 'Not specified'}
Company: ${company || 'Not specified'}
Job Description:
${jobDescription}

## THE CANDIDATE'S MASTER PROFILE
${JSON.stringify(masterProfile, null, 2)}

## YOUR MISSION
Create a tailored version of this candidate's resume that:

1. **KEYWORD OPTIMIZATION** (Critical for ATS):
   - Extract ALL keywords, skills, and requirements from the job description
   - Naturally incorporate these keywords throughout the resume
   - Match the exact terminology used in the job posting
   - Include both hard skills and soft skills mentioned

2. **EXPERIENCE REFRAMING**:
   - Reorder and prioritize experiences most relevant to this role
   - Rewrite bullet points to emphasize transferable skills
   - Add context that connects past work to this job's requirements
   - Quantify achievements where possible (%, $, numbers)

3. **SUMMARY CUSTOMIZATION**:
   - Write a new professional summary specifically targeting this role
   - Lead with the most relevant qualifications
   - Include 2-3 key achievements that match job requirements
   - Use power words that resonate with this industry

4. **SKILLS PRIORITIZATION**:
   - Reorder skills to put most relevant ones first
   - Add any skills from job description that candidate has but didn't list
   - Group skills by category if helpful

5. **MATCH ANALYSIS**:
   - Calculate a match score (0-100) based on keyword and requirement overlap
   - List the top 10 matching keywords/skills
   - Identify any gaps or areas to address in cover letter

Return a JSON object with this structure:
{
  "tailoredProfile": {
    "basics": {
      "name": "...",
      "title": "Tailored title matching job",
      "tagline": "Compelling tagline for this specific role",
      "summary": "3-4 sentence summary targeting this job",
      "email": "...",
      "phone": "...",
      "location": "..."
    },
    "experience": [
      {
        "company": "...",
        "role": "...",
        "startDate": "...",
        "endDate": "...",
        "description": "Rewritten to emphasize relevance",
        "highlights": ["Achievement 1 with metrics", "Achievement 2", "..."],
        "relevanceScore": 85
      }
    ],
    "skills": ["Most relevant skill", "Second most relevant", "..."],
    "education": [...],
    "certifications": [...]
  },
  "matchAnalysis": {
    "overallScore": 85,
    "matchedKeywords": ["keyword1", "keyword2", "..."],
    "missingKeywords": ["keyword they want but candidate lacks"],
    "strengths": ["Top strength for this role", "..."],
    "suggestions": ["Consider mentioning X in interview", "..."]
  },
  "coverLetterHints": [
    "Address the X requirement by discussing...",
    "Emphasize your experience with Y...",
    "..."
  ],
  "interviewTips": [
    "Be prepared to discuss your experience with...",
    "Have specific examples ready for...",
    "..."
  ]
}`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 8192,
          }
        })
      }
    );
    
    const data = await response.json();
    const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!aiText) {
      return c.json({ error: 'AI failed to generate tailored resume' }, 500);
    }
    
    // Parse JSON from response
    try {
      const jsonMatch = aiText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const result = JSON.parse(jsonMatch[0]);
        
        // Add metadata
        result.metadata = {
          jobTitle: jobTitle || 'Unknown Position',
          company: company || 'Unknown Company',
          jobUrl: jobUrl || null,
          createdAt: new Date().toISOString(),
          originalJobDescription: jobDescription.substring(0, 500) + '...'
        };
        
        await auditLog(c, 'RESUME_TAILORED', user.email, { 
          jobTitle: result.metadata.jobTitle, 
          company: result.metadata.company,
          matchScore: result.matchAnalysis?.overallScore 
        });
        
        return c.json(result);
      }
    } catch (parseError) {
      // Return raw text if JSON parsing fails
      return c.json({ 
        error: 'Failed to parse AI response', 
        raw: aiText 
      }, 500);
    }
    
    return c.json({ error: 'Invalid AI response format' }, 500);
    
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

// ============================================================
// AI CHAT ASSISTANT - Guides users through the app
// ============================================================

const WEBUME_KNOWLEDGEBASE = `
# WebUME Assistant Knowledge Base

## About WebUME
WebUME is a revolutionary digital resume platform that transforms traditional resumes into immersive, interactive career experiences. Instead of reducing 10 years of experience to bullet points, WebUME creates an "Organic Chronological Career Tree" where each employer becomes its own detailed page.

## Core Features

### 1. Resume Upload & AI Parsing
- Users can upload PDF, DOCX, or TXT resumes
- AI (Google Gemini) extracts all career information automatically
- Supports drag-and-drop or click-to-upload
- Parses: contact info, work experience, skills, education, achievements

### 2. 10 Professional Templates
Available templates by category:
- **Professional**: Executive (purple), Corporate (blue), Nonprofit (green)
- **Service Industry**: Healthcare (teal), Restaurant (orange), Trades (amber), Beauty (pink)
- **Creative**: Creative Portfolio (rose), Tech Pioneer (cyan), Minimal (gray)

### 3. Career Tree / Experience Builder
Each job/employer has 8 detailed sections:
- **Overview**: Company description, your role summary
- **Responsibilities**: Daily duties and key tasks (bullet points)
- **Projects**: Major projects you worked on with descriptions
- **Achievements/Victories**: Accomplishments, metrics, wins
- **Challenges**: Difficult situations you overcame
- **Media**: Photos and videos from that role
- **Reviews**: Testimonials or performance feedback
- **Day in Life**: Typical daily schedule

### 4. Profile Sections
- **Basics**: Name, title, tagline, summary, contact info
- **Experience**: All jobs with rich detail
- **Skills**: Technical and soft skills with proficiency levels
- **Achievements**: Career-wide accomplishments
- **Education**: Degrees, certifications, courses
- **Awards**: Recognition and honors
- **Reviews**: Testimonials from colleagues/managers

### 5. ATS Score Checker
- Analyzes profile for ATS (Applicant Tracking System) compatibility
- Scores 0-100 with grade (A, B, C, D, F)
- Shows matched keywords
- Provides improvement suggestions

### 6. Public Profile Sharing
- Custom URLs: webume.pages.dev/p/your-name
- QR code generation
- Social sharing (LinkedIn, Twitter, Email)
- Privacy toggle (public/private)

### 7. AI Resume Tailor (Premium)
- Paste any job description
- AI creates customized resume for that specific job
- Match score shows compatibility percentage
- Interview tips and cover letter hints
- Save unlimited tailored versions

## Navigation Flow
1. **AUTH** → Login or Register
2. **UPLOAD** → Upload resume or start fresh
3. **BUILDER** → Edit all profile sections
4. **PREVIEW** → See final result with chosen template
5. **TAILOR** → AI customize for job applications (Premium)

## Pricing Plans
- **Free ($0)**: 1 profile, basic templates, public URL, ATS score
- **Pro ($9.99/mo)**: Unlimited profiles, all templates, AI Tailor, analytics, PDF export
- **Enterprise ($29.99/mo)**: Team management, API access, white label, SLA

## How to Edit Profile Sections

### To edit Basics (name, title, etc):
Click the "Basics" tab in the Builder view

### To edit Experience:
1. Click "Experience" tab
2. Click on any job card to expand
3. Edit fields directly or click sections to add content

### To add a new job:
In Experience tab, scroll to bottom and click "Add Experience"

### To add skills:
Click "Skills" tab, type skill name, select category (Technical/Soft/Language/Tool)

### To add achievements:
Click "Achievements" tab, click "Add Achievement", fill in title and description

### To add education:
Click "Education" tab, fill in degree, school, year, and details

### To add media to a job:
1. Click on the job in Experience
2. Scroll to Media section
3. Click "Add Photo" or "Add Video"
4. Upload or paste URL

### To change template:
Click "Templates" tab, browse categories, click any template to select

## Common Questions

Q: How do I save my profile?
A: Your profile auto-saves every 30 seconds. You can also click "Save Progress" in the navigation.

Q: How do I make my profile public?
A: Go to Preview, click "Publish", then toggle "Make Public"

Q: How do I get my public URL?
A: After publishing, your URL is webume.pages.dev/p/your-slug (your name formatted)

Q: Can I download my resume as PDF?
A: PDF export is available with Pro plan

Q: How does ATS scoring work?
A: Click "ATS Score" in Preview to analyze your profile against common ATS keywords

Q: What file formats can I upload?
A: PDF, DOCX, DOC, and TXT files are supported

Q: How do I use AI Resume Tailor?
A: Go to Preview → Click "AI Tailor" → Paste job description → Get customized resume

## Tips for Best Results
1. Upload a detailed resume for better AI parsing
2. Add specific metrics to achievements (%, $, numbers)
3. Include media (photos, project screenshots) for visual impact
4. Use keywords from job descriptions in your profile
5. Check ATS score and aim for 80+
6. Add a professional photo
7. Write a compelling tagline and summary
`;

// Chat endpoint
app.post('/api/chat', async (c) => {
  const user = await getCurrentUser(c);
  
  try {
    const { message, context, profile, conversationHistory } = await c.req.json();
    
    if (!message?.trim()) {
      return c.json({ error: 'Message is required' }, 400);
    }
    
    // Build conversation history for context
    let historyContext = '';
    if (conversationHistory && conversationHistory.length > 0) {
      historyContext = '\n\nRECENT CONVERSATION (use this to understand references like "option 2", "the second one", etc.):\n';
      // Get last 6 messages for context
      const recentMessages = conversationHistory.slice(-6);
      recentMessages.forEach((msg: {role: string, content: string}) => {
        historyContext += (msg.role === 'user' ? 'User: ' : 'Assistant: ') + msg.content + '\n';
      });
    }
    
    // Build context about the user's current state
    let userContext = '';
    if (user) {
      userContext += 'User is logged in as: ' + user.name + ' (' + user.email + ')\n';
      userContext += 'Subscription: ' + (user.subscription?.planId || 'free') + '\n';
    } else {
      userContext += 'User is not logged in.\n';
    }
    
    if (context?.view) {
      const viewNames = { 0: 'Login/Register', 1: 'Upload Resume', 2: 'Profile Builder', 3: 'Preview', 4: 'AI Tailor' };
      userContext += 'Current page: ' + (viewNames[context.view] || 'Unknown') + '\n';
    }
    
    if (profile) {
      userContext += '\nUser Profile Summary:\n';
      if (profile.basics?.name) userContext += '- Name: ' + profile.basics.name + '\n';
      if (profile.basics?.title) userContext += '- Title: ' + profile.basics.title + '\n';
      if (profile.experience?.length) userContext += '- Experiences: ' + profile.experience.length + ' jobs\n';
      if (profile.skills?.length) userContext += '- Skills: ' + profile.skills.length + ' skills\n';
      if (profile.achievements?.length) userContext += '- Achievements: ' + profile.achievements.length + '\n';
      if (profile.education?.length) userContext += '- Education: ' + profile.education.length + ' entries\n';
    }
    
    const systemPrompt = 'You are WebUME Assistant, a proactive AI that helps users build their digital resume profile. You take ACTION immediately without asking for confirmation.\n\n' +
      'CRITICAL RULES:\n' +
      '1. When user asks to add/change/update ANYTHING in their profile, DO IT IMMEDIATELY with an action block\n' +
      '2. DO NOT ask for confirmation - just do it and tell them what you did\n' +
      '3. If user says "add my tagline" or "update my title" - CREATE appropriate content for them based on their profile\n' +
      '4. If user references "option 1", "option 2", "the second one", etc. from a previous message, use that content\n' +
      '5. Be creative and write professional content when user asks you to "add" or "create" something\n' +
      '6. Keep responses SHORT - just confirm what you did\n\n' +
      'ACTION FORMAT - Always include this JSON block when making changes:\n' +
      '```action\n{"type": "edit_profile", "section": "basics|experience|skills|achievements|education|awards", "action": "update|add|delete", "data": {...}}\n```\n\n' +
      'SECTION FIELDS:\n' +
      '- basics: name, title, tagline, summary, contact.email, contact.phone, contact.location, contact.linkedin\n' +
      '- skills: name, category (Technical/Soft/Language/Tool), level\n' +
      '- achievements: title, description\n' +
      '- education: degree, school, year, details\n' +
      '- experience: employer, title, startDate, endDate, description, responsibilities[]\n\n' +
      'EXAMPLES OF IMMEDIATE ACTION:\n' +
      'User: "Add a tagline for me" → You CREATE a professional tagline based on their profile and add it\n' +
      'User: "Add option 2" → You use the content from option 2 you previously mentioned\n' +
      'User: "Update my summary" → You WRITE a new professional summary and add it\n' +
      'User: "Add React to my skills" → You add React as a Technical skill immediately\n\n' +
      'NEVER SAY: "Would you like me to...", "Should I...", "Do you want me to..."\n' +
      'ALWAYS SAY: "Done!", "I have added...", "Updated your..."\n\n' +
      'KNOWLEDGE BASE:\n' + WEBUME_KNOWLEDGEBASE + '\n\n' +
      'CURRENT USER CONTEXT:\n' + userContext + historyContext;
    
    const response = await fetch(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=' + GEMINI_API_KEY,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: systemPrompt + '\n\nUser message: ' + message }] }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 1024
          }
        })
      }
    );
    
    const data = await response.json();
    const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    
    // Check if response contains an action block
    const actionMatch = aiText.match(/```action\n([\s\S]*?)```/);
    let action = null;
    let textResponse = aiText;
    
    if (actionMatch) {
      try {
        action = JSON.parse(actionMatch[1]);
        // Remove action block from text response
        textResponse = aiText.replace(/```action[\s\S]*?```/g, '').trim();
      } catch (e) {
        // Invalid JSON, ignore action
      }
    }
    
    return c.json({ 
      response: textResponse,
      action
    });
    
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

// Public Profile View Page
app.get('/p/:slug', async (c) => {
  const slug = c.req.param('slug');
  return c.html(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>Loading Profile... | Webumé</title>
  <link rel="icon" type="image/png" href="/static/logo.png">
  <meta name="description" content="View professional profile on Webumé">
  <meta property="og:title" content="Professional Profile | Webumé">
  <meta property="og:description" content="View this professional profile created with Webumé">
  <meta property="og:type" content="profile">
  
  <script src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
  <script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/qrcode@1.5.3/build/qrcode.min.js"></script>
  
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Space+Grotesk:wght@500;600;700&family=Playfair+Display:wght@400;500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
  
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    
    :root {
      --accent: #8B5CF6;
      --accent-light: #A78BFA;
      --accent-dark: #6D28D9;
      --bg-dark: #0a0a12;
      --bg-card: rgba(255,255,255,0.03);
      --border: rgba(255,255,255,0.08);
      --text: #fff;
      --text-muted: rgba(255,255,255,0.6);
      --text-dim: rgba(255,255,255,0.4);
    }
    
    html {
      scroll-behavior: smooth;
    }
    
    body {
      font-family: 'Inter', -apple-system, sans-serif;
      background: var(--bg-dark);
      min-height: 100vh;
      color: var(--text);
      overflow-x: hidden;
    }
    
    /* Loading State */
    .loading {
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      flex-direction: column;
      gap: 24px;
      background: var(--bg-dark);
    }
    
    .loader-ring {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      position: relative;
    }
    
    .loader-ring::before {
      content: '';
      position: absolute;
      inset: 0;
      border-radius: 50%;
      border: 4px solid transparent;
      border-top-color: var(--accent);
      animation: spin 1s linear infinite;
    }
    
    .loader-ring::after {
      content: '';
      position: absolute;
      inset: 8px;
      border-radius: 50%;
      border: 4px solid transparent;
      border-top-color: var(--accent-light);
      animation: spin 0.8s linear infinite reverse;
    }
    
    @keyframes spin { to { transform: rotate(360deg); } }
    
    .loading-text {
      font-size: 14px;
      color: var(--text-muted);
      letter-spacing: 2px;
      text-transform: uppercase;
    }
    
    /* Error State */
    .error-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 40px;
      background: var(--bg-dark);
    }
    
    .error-card {
      text-align: center;
      padding: 60px 40px;
      background: var(--bg-card);
      border-radius: 32px;
      border: 1px solid var(--border);
      max-width: 500px;
    }
    
    .error-icon {
      font-size: 80px;
      margin-bottom: 24px;
      opacity: 0.6;
    }
    
    .error-title {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 48px;
      font-weight: 700;
      margin-bottom: 16px;
      background: linear-gradient(135deg, var(--accent), var(--accent-light));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    
    .error-message {
      color: var(--text-muted);
      margin-bottom: 32px;
      line-height: 1.6;
    }
    
    .cta-btn {
      display: inline-flex;
      align-items: center;
      gap: 12px;
      padding: 16px 32px;
      background: linear-gradient(135deg, var(--accent), var(--accent-dark));
      color: var(--text);
      text-decoration: none;
      border-radius: 16px;
      font-weight: 600;
      font-size: 15px;
      transition: all 0.3s ease;
      box-shadow: 0 8px 32px rgba(139, 92, 246, 0.3);
    }
    
    .cta-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 12px 40px rgba(139, 92, 246, 0.4);
    }
    
    /* ============================================
       IMMERSIVE PROFILE LAYOUT
       ============================================ */
    
    /* Animated Background */
    .profile-bg {
      position: fixed;
      inset: 0;
      z-index: 0;
      overflow: hidden;
      pointer-events: none;
    }
    
    .bg-gradient-1 {
      position: absolute;
      width: 800px;
      height: 800px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(139, 92, 246, 0.15) 0%, transparent 70%);
      top: -200px;
      right: -200px;
      animation: float 20s ease-in-out infinite;
    }
    
    .bg-gradient-2 {
      position: absolute;
      width: 600px;
      height: 600px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(236, 72, 153, 0.1) 0%, transparent 70%);
      bottom: -150px;
      left: -150px;
      animation: float 25s ease-in-out infinite reverse;
    }
    
    @keyframes float {
      0%, 100% { transform: translate(0, 0) scale(1); }
      33% { transform: translate(30px, -30px) scale(1.05); }
      66% { transform: translate(-20px, 20px) scale(0.95); }
    }
    
    /* Main Profile Container */
    .profile-container {
      position: relative;
      z-index: 1;
      min-height: 100vh;
    }
    
    /* ============================================
       HERO SECTION
       ============================================ */
    .hero {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 60px 24px;
      position: relative;
    }
    
    .hero-content {
      max-width: 900px;
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
    }
    
    .hero-photo-container {
      position: relative;
      margin-bottom: 40px;
    }
    
    .hero-photo {
      width: 220px;
      height: 220px;
      border-radius: 50%;
      object-fit: cover;
      border: 6px solid var(--accent);
      box-shadow: 
        0 0 0 10px rgba(139, 92, 246, 0.15),
        0 0 0 20px rgba(139, 92, 246, 0.08),
        0 30px 80px rgba(0, 0, 0, 0.5),
        0 0 120px rgba(139, 92, 246, 0.25);
      animation: heroPhotoIn 1s ease-out;
    }
    
    @keyframes heroPhotoIn {
      from { transform: scale(0.8); opacity: 0; }
      to { transform: scale(1); opacity: 1; }
    }
    
    .photo-ring {
      position: absolute;
      inset: -20px;
      border-radius: 50%;
      border: 2px dashed rgba(139, 92, 246, 0.4);
      animation: photoRingSpin 20s linear infinite;
    }
    
    .photo-ring-2 {
      position: absolute;
      inset: -35px;
      border-radius: 50%;
      border: 1px solid rgba(139, 92, 246, 0.15);
      animation: photoRingSpin 30s linear infinite reverse;
    }
    
    @keyframes photoRingSpin {
      to { transform: rotate(360deg); }
    }
    
    .hero-photo-placeholder {
      width: 220px;
      height: 220px;
      border-radius: 50%;
      background: linear-gradient(135deg, var(--accent), var(--accent-dark));
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 72px;
      font-weight: 800;
      color: white;
      box-shadow: 
        0 0 0 10px rgba(139, 92, 246, 0.15),
        0 30px 80px rgba(0, 0, 0, 0.5);
    }
    
    /* ============================================
       TRADITIONAL RESUME PREVIEW CARD
       ============================================ */
    .resume-preview-section {
      padding: 40px 24px 80px;
      display: flex;
      justify-content: center;
    }
    
    .resume-preview-container {
      max-width: 1100px;
      width: 100%;
      display: flex;
      gap: 40px;
      align-items: flex-start;
      flex-wrap: wrap;
      justify-content: center;
    }
    
    .resume-card {
      width: 380px;
      background: #fff;
      border-radius: 16px;
      box-shadow: 
        0 25px 80px rgba(0, 0, 0, 0.4),
        0 0 0 1px rgba(255, 255, 255, 0.1);
      overflow: hidden;
      transform: perspective(1000px) rotateY(-5deg) rotateX(2deg);
      transition: transform 0.5s ease;
      flex-shrink: 0;
    }
    
    .resume-card:hover {
      transform: perspective(1000px) rotateY(0deg) rotateX(0deg) scale(1.02);
    }
    
    .resume-card-header {
      background: linear-gradient(135deg, var(--accent), var(--accent-dark));
      padding: 24px;
      color: white;
      text-align: center;
    }
    
    .resume-card-photo {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      border: 3px solid white;
      object-fit: cover;
      margin-bottom: 12px;
    }
    
    .resume-card-photo-placeholder {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      border: 3px solid white;
      background: rgba(255,255,255,0.2);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 28px;
      font-weight: 700;
      margin: 0 auto 12px;
    }
    
    .resume-card-name {
      font-size: 18px;
      font-weight: 700;
      margin-bottom: 4px;
    }
    
    .resume-card-title {
      font-size: 12px;
      opacity: 0.9;
    }
    
    .resume-card-body {
      padding: 20px;
      color: #1a1a2e;
      font-size: 11px;
      line-height: 1.5;
    }
    
    .resume-card-section {
      margin-bottom: 16px;
    }
    
    .resume-card-section h4 {
      font-size: 10px;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: var(--accent);
      margin-bottom: 8px;
      padding-bottom: 4px;
      border-bottom: 1px solid rgba(139, 92, 246, 0.2);
    }
    
    .resume-card-exp {
      margin-bottom: 10px;
    }
    
    .resume-card-exp strong {
      font-size: 11px;
      display: block;
    }
    
    .resume-card-exp span {
      color: #666;
      font-size: 10px;
    }
    
    .resume-card-skills {
      display: flex;
      flex-wrap: wrap;
      gap: 4px;
    }
    
    .resume-card-skill {
      padding: 3px 8px;
      background: rgba(139, 92, 246, 0.1);
      border-radius: 4px;
      font-size: 9px;
      color: var(--accent);
    }
    
    .resume-info-panel {
      flex: 1;
      min-width: 300px;
      max-width: 500px;
    }
    
    .resume-info-title {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 28px;
      font-weight: 700;
      margin-bottom: 16px;
      color: var(--text);
    }
    
    .resume-info-desc {
      font-size: 15px;
      color: var(--text-muted);
      line-height: 1.7;
      margin-bottom: 24px;
    }
    
    .resume-stats {
      display: flex;
      gap: 24px;
      margin-bottom: 24px;
    }
    
    .resume-stat {
      text-align: center;
    }
    
    .resume-stat-value {
      font-size: 32px;
      font-weight: 800;
      color: var(--accent);
    }
    
    .resume-stat-label {
      font-size: 11px;
      color: var(--text-dim);
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    
    .resume-actions {
      display: flex;
      gap: 12px;
      flex-wrap: wrap;
    }
    
    .resume-action-btn {
      padding: 12px 24px;
      border-radius: 12px;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      gap: 8px;
      border: none;
    }
    
    .resume-action-btn.primary {
      background: linear-gradient(135deg, var(--accent), var(--accent-dark));
      color: white;
    }
    
    .resume-action-btn.secondary {
      background: var(--bg-card);
      border: 1px solid var(--border);
      color: var(--text);
    }
    
    .resume-action-btn:hover {
      transform: translateY(-2px);
    }
    
    .hero-name {
      font-family: 'Playfair Display', serif;
      font-size: clamp(36px, 8vw, 64px);
      font-weight: 700;
      margin-bottom: 16px;
      line-height: 1.1;
      animation: fadeInUp 0.8s ease-out 0.2s both;
    }
    
    .hero-title {
      font-size: clamp(18px, 4vw, 24px);
      color: var(--accent-light);
      font-weight: 600;
      margin-bottom: 16px;
      animation: fadeInUp 0.8s ease-out 0.4s both;
    }
    
    .hero-tagline {
      font-size: 16px;
      color: var(--text-muted);
      max-width: 600px;
      line-height: 1.7;
      margin-bottom: 32px;
      animation: fadeInUp 0.8s ease-out 0.6s both;
    }
    
    @keyframes fadeInUp {
      from { transform: translateY(30px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
    
    .hero-contact {
      display: flex;
      gap: 20px;
      flex-wrap: wrap;
      justify-content: center;
      margin-bottom: 48px;
      animation: fadeInUp 0.8s ease-out 0.8s both;
    }
    
    .contact-chip {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 10px 20px;
      background: var(--bg-card);
      border: 1px solid var(--border);
      border-radius: 100px;
      font-size: 13px;
      color: var(--text-muted);
      text-decoration: none;
      transition: all 0.3s ease;
    }
    
    .contact-chip:hover {
      background: rgba(139, 92, 246, 0.1);
      border-color: var(--accent);
      color: var(--text);
      transform: translateY(-2px);
    }
    
    .contact-chip i {
      color: var(--accent);
    }
    
    .scroll-indicator {
      position: absolute;
      bottom: 40px;
      left: 50%;
      transform: translateX(-50%);
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 12px;
      animation: bounce 2s ease-in-out infinite;
      cursor: pointer;
    }
    
    .scroll-indicator span {
      font-size: 11px;
      color: var(--text-dim);
      text-transform: uppercase;
      letter-spacing: 2px;
    }
    
    .scroll-arrow {
      width: 24px;
      height: 40px;
      border: 2px solid var(--border);
      border-radius: 12px;
      position: relative;
    }
    
    .scroll-arrow::after {
      content: '';
      position: absolute;
      width: 4px;
      height: 8px;
      background: var(--accent);
      border-radius: 2px;
      left: 50%;
      top: 8px;
      transform: translateX(-50%);
      animation: scrollDot 2s ease-in-out infinite;
    }
    
    @keyframes bounce {
      0%, 100% { transform: translateX(-50%) translateY(0); }
      50% { transform: translateX(-50%) translateY(10px); }
    }
    
    @keyframes scrollDot {
      0%, 100% { top: 8px; opacity: 1; }
      50% { top: 20px; opacity: 0.5; }
    }
    
    /* ============================================
       EXPERIENCE TIMELINE SECTION
       ============================================ */
    .timeline-section {
      padding: 80px 24px;
      position: relative;
    }
    
    .section-header {
      text-align: center;
      margin-bottom: 60px;
    }
    
    .section-label {
      font-size: 12px;
      color: var(--accent);
      text-transform: uppercase;
      letter-spacing: 3px;
      margin-bottom: 16px;
    }
    
    .section-title {
      font-family: 'Space Grotesk', sans-serif;
      font-size: clamp(28px, 5vw, 40px);
      font-weight: 700;
      margin-bottom: 16px;
    }
    
    .section-subtitle {
      font-size: 15px;
      color: var(--text-muted);
      max-width: 500px;
      margin: 0 auto;
    }
    
    .timeline-container {
      max-width: 1400px;
      margin: 0 auto;
      display: flex;
      gap: 40px;
    }
    
    .timeline-list {
      flex: 1;
      max-width: 600px;
    }
    
    .timeline-item {
      position: relative;
      padding: 28px;
      margin-bottom: 20px;
      background: var(--bg-card);
      border: 1px solid var(--border);
      border-radius: 20px;
      cursor: pointer;
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    }
    
    .timeline-item::before {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      width: 4px;
      background: var(--border);
      border-radius: 4px 0 0 4px;
      transition: all 0.4s ease;
    }
    
    .timeline-item:hover,
    .timeline-item.active {
      background: rgba(139, 92, 246, 0.08);
      border-color: var(--accent);
      transform: translateX(8px);
      box-shadow: 0 10px 40px rgba(139, 92, 246, 0.15);
    }
    
    .timeline-item:hover::before,
    .timeline-item.active::before {
      background: linear-gradient(180deg, var(--accent), var(--accent-dark));
      width: 5px;
    }
    
    .timeline-header {
      display: flex;
      align-items: center;
      gap: 16px;
      margin-bottom: 12px;
    }
    
    .company-logo {
      width: 72px;
      height: 72px;
      border-radius: 18px;
      background: white;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      flex-shrink: 0;
      border: 3px solid var(--border);
      transition: all 0.4s ease;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
    }
    
    .timeline-item:hover .company-logo,
    .timeline-item.active .company-logo {
      border-color: var(--accent);
      box-shadow: 0 8px 24px rgba(139, 92, 246, 0.25);
      transform: scale(1.05);
    }
    
    .company-logo img {
      width: 100%;
      height: 100%;
      object-fit: contain;
      padding: 10px;
    }
    
    .company-logo-placeholder {
      width: 72px;
      height: 72px;
      border-radius: 18px;
      background: linear-gradient(135deg, var(--accent), var(--accent-dark));
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 26px;
      font-weight: 700;
      color: white;
      box-shadow: 0 4px 16px rgba(139, 92, 246, 0.3);
    }
    
    .timeline-info h3 {
      font-size: 17px;
      font-weight: 700;
      margin-bottom: 4px;
    }
    
    .timeline-company {
      font-size: 14px;
      color: var(--accent);
      font-weight: 600;
    }
    
    .timeline-meta {
      display: flex;
      gap: 16px;
      font-size: 12px;
      color: var(--text-dim);
      margin-top: 12px;
    }
    
    .timeline-meta span {
      display: flex;
      align-items: center;
      gap: 6px;
    }
    
    .view-details-badge {
      position: absolute;
      top: 16px;
      right: 16px;
      padding: 6px 12px;
      background: var(--accent);
      border-radius: 8px;
      font-size: 10px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 1px;
      opacity: 0;
      transform: translateX(10px);
      transition: all 0.3s ease;
    }
    
    .timeline-item:hover .view-details-badge,
    .timeline-item.active .view-details-badge {
      opacity: 1;
      transform: translateX(0);
    }
    
    /* ============================================
       DETAIL PANEL (Side Panel)
       ============================================ */
    .detail-panel {
      position: fixed;
      top: 0;
      right: 0;
      width: 550px;
      max-width: 90vw;
      height: 100vh;
      background: linear-gradient(180deg, #0f0f1a 0%, #0a0a12 100%);
      border-left: 1px solid var(--border);
      z-index: 1000;
      transform: translateX(100%);
      transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
      overflow-y: auto;
      box-shadow: -20px 0 60px rgba(0, 0, 0, 0.5);
    }
    
    .detail-panel.open {
      transform: translateX(0);
    }
    
    .detail-panel::-webkit-scrollbar { width: 6px; }
    .detail-panel::-webkit-scrollbar-track { background: transparent; }
    .detail-panel::-webkit-scrollbar-thumb { 
      background: rgba(139, 92, 246, 0.3);
      border-radius: 3px;
    }
    
    .panel-header {
      position: sticky;
      top: 0;
      background: linear-gradient(180deg, rgba(15, 15, 26, 0.98) 0%, rgba(15, 15, 26, 0.9) 100%);
      backdrop-filter: blur(20px);
      padding: 24px;
      border-bottom: 1px solid var(--border);
      z-index: 10;
    }
    
    .panel-close {
      position: absolute;
      top: 24px;
      right: 24px;
      width: 40px;
      height: 40px;
      border-radius: 12px;
      background: var(--bg-card);
      border: 1px solid var(--border);
      color: var(--text-muted);
      font-size: 18px;
      cursor: pointer;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .panel-close:hover {
      background: rgba(239, 68, 68, 0.2);
      border-color: #EF4444;
      color: #EF4444;
    }
    
    .panel-company-header {
      display: flex;
      align-items: center;
      gap: 20px;
      padding-right: 50px;
    }
    
    .panel-logo {
      width: 72px;
      height: 72px;
      border-radius: 18px;
      background: white;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      border: 3px solid var(--accent);
      box-shadow: 0 8px 24px rgba(139, 92, 246, 0.2);
    }
    
    .panel-logo img {
      width: 100%;
      height: 100%;
      object-fit: contain;
      padding: 10px;
    }
    
    .panel-logo-placeholder {
      width: 72px;
      height: 72px;
      border-radius: 18px;
      background: linear-gradient(135deg, var(--accent), var(--accent-dark));
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 28px;
      font-weight: 700;
      color: white;
    }
    
    .panel-title-section h2 {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 22px;
      font-weight: 700;
      margin-bottom: 6px;
    }
    
    .panel-title-section .role {
      font-size: 15px;
      color: var(--accent-light);
      font-weight: 600;
      margin-bottom: 8px;
    }
    
    .panel-title-section .dates {
      font-size: 13px;
      color: var(--text-dim);
    }
    
    .panel-content {
      padding: 24px;
    }
    
    /* Detail Sections */
    .detail-section {
      margin-bottom: 32px;
    }
    
    .detail-section-header {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 16px;
      padding-bottom: 12px;
      border-bottom: 1px solid var(--border);
    }
    
    .detail-section-icon {
      width: 36px;
      height: 36px;
      border-radius: 10px;
      background: rgba(139, 92, 246, 0.15);
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--accent);
      font-size: 14px;
    }
    
    .detail-section-header h3 {
      font-size: 14px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: var(--text-muted);
    }
    
    .detail-section-content {
      font-size: 14px;
      line-height: 1.7;
      color: var(--text-muted);
    }
    
    .detail-section-content p {
      margin-bottom: 12px;
    }
    
    .detail-section-content ul {
      list-style: none;
      padding: 0;
    }
    
    .detail-section-content li {
      position: relative;
      padding-left: 20px;
      margin-bottom: 10px;
    }
    
    .detail-section-content li::before {
      content: '';
      position: absolute;
      left: 0;
      top: 8px;
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: var(--accent);
    }
    
    /* Metrics Grid */
    .metrics-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 16px;
    }
    
    .metric-card {
      padding: 20px;
      background: var(--bg-card);
      border: 1px solid var(--border);
      border-radius: 16px;
      text-align: center;
    }
    
    .metric-value {
      font-size: 28px;
      font-weight: 800;
      color: var(--accent);
      margin-bottom: 4px;
    }
    
    .metric-label {
      font-size: 11px;
      color: var(--text-dim);
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    
    /* Media Gallery */
    .media-gallery {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 12px;
    }
    
    .media-item {
      aspect-ratio: 16/10;
      border-radius: 12px;
      overflow: hidden;
      background: var(--bg-card);
      border: 1px solid var(--border);
    }
    
    .media-item img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.3s ease;
    }
    
    .media-item:hover img {
      transform: scale(1.05);
    }
    
    /* Awards/Projects */
    .award-item, .project-item {
      padding: 16px;
      background: var(--bg-card);
      border: 1px solid var(--border);
      border-radius: 14px;
      margin-bottom: 12px;
    }
    
    .award-item h4, .project-item h4 {
      font-size: 14px;
      font-weight: 600;
      margin-bottom: 6px;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    
    .award-item h4 i {
      color: #F59E0B;
    }
    
    .project-item h4 i {
      color: var(--accent);
    }
    
    .award-item p, .project-item p {
      font-size: 13px;
      color: var(--text-dim);
      line-height: 1.5;
    }
    
    /* Panel Overlay */
    .panel-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.6);
      backdrop-filter: blur(4px);
      z-index: 999;
      opacity: 0;
      visibility: hidden;
      transition: all 0.4s ease;
    }
    
    .panel-overlay.visible {
      opacity: 1;
      visibility: visible;
    }
    
    /* ============================================
       SKILLS & EDUCATION SECTIONS
       ============================================ */
    .skills-section, .education-section {
      padding: 60px 24px;
      max-width: 900px;
      margin: 0 auto;
    }
    
    .skills-grid {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
      justify-content: center;
    }
    
    .skill-chip {
      padding: 12px 24px;
      background: var(--bg-card);
      border: 1px solid var(--border);
      border-radius: 100px;
      font-size: 14px;
      font-weight: 500;
      transition: all 0.3s ease;
    }
    
    .skill-chip:hover {
      background: rgba(139, 92, 246, 0.15);
      border-color: var(--accent);
      transform: translateY(-2px);
    }
    
    .education-cards {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 24px;
    }
    
    .education-card {
      padding: 28px;
      background: var(--bg-card);
      border: 1px solid var(--border);
      border-radius: 20px;
      transition: all 0.3s ease;
    }
    
    .education-card:hover {
      border-color: var(--accent);
      transform: translateY(-4px);
    }
    
    .education-card h3 {
      font-size: 17px;
      font-weight: 700;
      margin-bottom: 8px;
    }
    
    .education-card p {
      font-size: 14px;
      color: var(--text-muted);
    }
    
    .education-card .year {
      display: inline-block;
      margin-top: 12px;
      padding: 6px 14px;
      background: rgba(139, 92, 246, 0.15);
      border-radius: 8px;
      font-size: 12px;
      color: var(--accent);
      font-weight: 600;
    }
    
    /* ============================================
       FOOTER
       ============================================ */
    .profile-footer {
      text-align: center;
      padding: 60px 24px;
      border-top: 1px solid var(--border);
    }
    
    .qr-section {
      margin-bottom: 32px;
    }
    
    .qr-code {
      width: 120px;
      height: 120px;
      border-radius: 16px;
      margin-bottom: 12px;
    }
    
    .qr-label {
      font-size: 12px;
      color: var(--text-dim);
    }
    
    .profile-views {
      font-size: 13px;
      color: var(--text-dim);
      margin-bottom: 24px;
    }
    
    .profile-views i {
      color: var(--accent);
      margin-right: 8px;
    }
    
    .powered-by {
      font-size: 12px;
      color: var(--text-dim);
      margin-top: 24px;
    }
    
    /* ============================================
       RESPONSIVE
       ============================================ */
    @media (max-width: 900px) {
      .timeline-container {
        flex-direction: column;
      }
      
      .timeline-list {
        max-width: 100%;
      }
      
      .detail-panel {
        width: 100%;
        max-width: 100%;
      }
    }
    
    @media (max-width: 600px) {
      .hero {
        padding: 40px 16px;
      }
      
      .hero-photo, .hero-photo-placeholder {
        width: 140px;
        height: 140px;
      }
      
      .hero-contact {
        flex-direction: column;
        align-items: center;
      }
      
      .metrics-grid {
        grid-template-columns: 1fr;
      }
      
      .panel-company-header {
        flex-direction: column;
        text-align: center;
      }
      
      .panel-title-section {
        text-align: center;
      }
    }
  </style>
</head>
<body>
  <div id="root">
    <div class="loading">
      <div class="loader-ring"></div>
      <p class="loading-text">Loading Profile</p>
    </div>
  </div>
  
  <script type="text/babel">
    const { useState, useEffect, useRef } = React;
    const SLUG = '${slug}';
    
    const PublicProfile = () => {
      const [profile, setProfile] = useState(null);
      const [loading, setLoading] = useState(true);
      const [error, setError] = useState(null);
      const [qrCode, setQrCode] = useState(null);
      const [selectedExp, setSelectedExp] = useState(null);
      const [panelOpen, setPanelOpen] = useState(false);
      const timelineRef = useRef(null);
      
      useEffect(() => {
        fetch('/api/public/' + SLUG)
          .then(r => r.json())
          .then(data => {
            if (data.error) {
              setError(data.error);
            } else {
              setProfile(data);
              document.title = (data.profile?.basics?.name || data.name) + ' | Webumé';
              // Generate QR code
              if (window.QRCode) {
                QRCode.toDataURL(window.location.href, { width: 200, margin: 2 })
                  .then(url => setQrCode(url));
              }
            }
            setLoading(false);
          })
          .catch(e => {
            setError('Failed to load profile');
            setLoading(false);
          });
      }, []);
      
      const openPanel = (exp) => {
        setSelectedExp(exp);
        setPanelOpen(true);
        document.body.style.overflow = 'hidden';
      };
      
      const closePanel = () => {
        setPanelOpen(false);
        document.body.style.overflow = '';
      };
      
      // Hover timer for auto-open panel
      const hoverTimerRef = useRef(null);
      
      const handleExpHover = (exp) => {
        // Clear any existing timer
        if (hoverTimerRef.current) {
          clearTimeout(hoverTimerRef.current);
        }
        // Set timer to open panel after 400ms hover
        hoverTimerRef.current = setTimeout(() => {
          openPanel(exp);
        }, 400);
      };
      
      const handleExpLeave = () => {
        // Clear the timer if mouse leaves before 400ms
        if (hoverTimerRef.current) {
          clearTimeout(hoverTimerRef.current);
          hoverTimerRef.current = null;
        }
      };
      
      const copyProfileUrl = () => {
        navigator.clipboard.writeText(window.location.href);
        alert('Profile URL copied to clipboard!');
      };
      
      const shareProfile = () => {
        if (navigator.share) {
          navigator.share({
            title: basics.name + ' - Professional Profile',
            text: 'Check out my professional profile on Webumé',
            url: window.location.href
          });
        } else {
          copyProfileUrl();
        }
      };
      
      // Known company domain mappings for automatic logo lookup
      const KNOWN_DOMAINS = {
        'in the house productions': 'inthehouseproductions.com',
        'in the house production': 'inthehouseproductions.com',
        'in house productions': 'inthehouseproductions.com',
        'inthehouseproductions': 'inthehouseproductions.com',
        'in-the-house productions': 'inthehouseproductions.com',
        'the house productions': 'inthehouseproductions.com',
        'house productions': 'inthehouseproductions.com',
        'google': 'google.com',
        'stripe': 'stripe.com',
        'salesforce': 'salesforce.com',
        'amazon': 'amazon.com',
        'microsoft': 'microsoft.com',
        'apple': 'apple.com',
        'meta': 'meta.com',
        'facebook': 'facebook.com',
        'netflix': 'netflix.com',
        'walmart': 'walmart.com',
        'target': 'target.com',
        'starbucks': 'starbucks.com',
        'mcdonalds': 'mcdonalds.com',
        "mcdonald's": 'mcdonalds.com',
        'publix': 'publix.com',
        'cvs': 'cvs.com',
        'walgreens': 'walgreens.com',
        'bank of america': 'bankofamerica.com',
        'wells fargo': 'wellsfargo.com',
        'chase': 'chase.com',
        'jpmorgan': 'jpmorgan.com',
        'citibank': 'citibank.com',
      };
      
      // Local static logo mappings - for companies without good external logos
      const LOCAL_LOGOS = {
        'in the house productions': '/static/inthehouse-logo.png',
        'in the house production': '/static/inthehouse-logo.png',
        'in house productions': '/static/inthehouse-logo.png',
        'inthehouseproductions': '/static/inthehouse-logo.png',
        'in-the-house productions': '/static/inthehouse-logo.png',
        'the house productions': '/static/inthehouse-logo.png',
        'house productions': '/static/inthehouse-logo.png',
        'chapters health system': '/static/chapters-health-logo.png',
        'chapters health': '/static/chapters-health-logo.png',
        'chapters': '/static/chapters-health-logo.png',
      };
      
      const getLocalLogo = (companyName) => {
        if (!companyName) return null;
        const lowerName = companyName.toLowerCase().trim();
        if (LOCAL_LOGOS[lowerName]) return LOCAL_LOGOS[lowerName];
        for (const [key, path] of Object.entries(LOCAL_LOGOS)) {
          if (lowerName.includes(key) || key.includes(lowerName)) return path;
        }
        return null;
      };
      
      const getKnownDomain = (companyName, existingDomain) => {
        if (existingDomain) return existingDomain;
        if (!companyName) return null;
        const lowerName = companyName.toLowerCase().trim();
        if (KNOWN_DOMAINS[lowerName]) return KNOWN_DOMAINS[lowerName];
        for (const [key, domain] of Object.entries(KNOWN_DOMAINS)) {
          if (lowerName.includes(key) || key.includes(lowerName)) return domain;
        }
        return null;
      };
      
      const scrollToTimeline = () => {
        if (timelineRef.current) {
          timelineRef.current.scrollIntoView({ behavior: 'smooth' });
        }
      };
      
      const getInitials = (name) => {
        if (!name) return '?';
        return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
      };
      
      const getCompanyInitial = (company) => {
        if (!company) return '?';
        return company.charAt(0).toUpperCase();
      };
      
      if (loading) {
        return (
          <div className="loading">
            <div className="loader-ring"></div>
            <p className="loading-text">Loading Profile</p>
          </div>
        );
      }
      
      if (error) {
        return (
          <div className="error-container">
            <div className="error-card">
              <div className="error-icon">🔍</div>
              <h1 className="error-title">Not Found</h1>
              <p className="error-message">{error}</p>
              <a href="/" className="cta-btn">
                <i className="fas fa-rocket"></i>
                Create Your Own Webumé
              </a>
            </div>
          </div>
        );
      }
      
      const p = profile.profile || {};
      const basics = p.basics || {};
      const experience = p.experience || [];
      const skills = p.skills || [];
      const education = p.education || [];
      
      // Get accent color from template
      const templateColors = {
        executive: '#8B5CF6',
        corporate: '#1E3A5F',
        healthcare: '#0EA5E9',
        restaurant: '#DC2626',
        trades: '#D97706',
        beauty: '#EC4899',
        creative: '#F472B6',
        tech: '#06B6D4',
        nonprofit: '#0891B2',
        minimal: '#10B981'
      };
      const accent = templateColors[profile.selectedTemplate] || '#8B5CF6';
      
      // Apply accent color to CSS variables
      useEffect(() => {
        document.documentElement.style.setProperty('--accent', accent);
      }, [accent]);
      
      return (
        <div className="profile-container">
          {/* Animated Background */}
          <div className="profile-bg">
            <div className="bg-gradient-1"></div>
            <div className="bg-gradient-2"></div>
          </div>
          
          {/* Hero Section */}
          <section className="hero">
            <div className="hero-content">
              <div className="hero-photo-container">
                <div className="photo-ring"></div>
                <div className="photo-ring-2"></div>
                {profile.profilePhoto ? (
                  <img src={profile.profilePhoto} alt={basics.name} className="hero-photo" />
                ) : (
                  <div className="hero-photo-placeholder">{getInitials(basics.name)}</div>
                )}
              </div>
              
              <h1 className="hero-name">{basics.name || 'Professional'}</h1>
              <p className="hero-title">{basics.title || 'Career Professional'}</p>
              {basics.tagline && <p className="hero-tagline">{basics.tagline}</p>}
              {basics.summary && !basics.tagline && (
                <p className="hero-tagline">{basics.summary.substring(0, 200)}{basics.summary.length > 200 ? '...' : ''}</p>
              )}
              
              <div className="hero-contact">
                {basics.email && (
                  <a href={"mailto:" + basics.email} className="contact-chip">
                    <i className="fas fa-envelope"></i>
                    {basics.email}
                  </a>
                )}
                {basics.phone && (
                  <a href={"tel:" + basics.phone} className="contact-chip">
                    <i className="fas fa-phone"></i>
                    {basics.phone}
                  </a>
                )}
                {basics.location && (
                  <span className="contact-chip">
                    <i className="fas fa-map-marker-alt"></i>
                    {basics.location}
                  </span>
                )}
                {basics.linkedin && (
                  <a href={basics.linkedin.startsWith('http') ? basics.linkedin : 'https://' + basics.linkedin} target="_blank" className="contact-chip">
                    <i className="fab fa-linkedin"></i>
                    LinkedIn
                  </a>
                )}
              </div>
            </div>
            
            {experience.length > 0 && (
              <div className="scroll-indicator" onClick={scrollToTimeline}>
                <span>Explore Career</span>
                <div className="scroll-arrow"></div>
              </div>
            )}
          </section>
          
          {/* Traditional Resume Preview */}
          <section className="resume-preview-section">
            <div className="resume-preview-container">
              <div className="resume-card">
                <div className="resume-card-header">
                  {profile.profilePhoto ? (
                    <img src={profile.profilePhoto} alt={basics.name} className="resume-card-photo" />
                  ) : (
                    <div className="resume-card-photo-placeholder">{getInitials(basics.name)}</div>
                  )}
                  <div className="resume-card-name">{basics.name || 'Your Name'}</div>
                  <div className="resume-card-title">{basics.title || 'Professional Title'}</div>
                </div>
                <div className="resume-card-body">
                  {experience.length > 0 && (
                    <div className="resume-card-section">
                      <h4>Experience</h4>
                      {experience.slice(0, 3).map((exp, i) => (
                        <div key={i} className="resume-card-exp">
                          <strong>{exp.role}</strong>
                          <span>{exp.company} • {exp.startDate} - {exp.endDate || 'Present'}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  {skills.length > 0 && (
                    <div className="resume-card-section">
                      <h4>Skills</h4>
                      <div className="resume-card-skills">
                        {skills.slice(0, 8).map((skill, i) => (
                          <span key={i} className="resume-card-skill">{skill}</span>
                        ))}
                      </div>
                    </div>
                  )}
                  {education.length > 0 && (
                    <div className="resume-card-section">
                      <h4>Education</h4>
                      {education.slice(0, 2).map((edu, i) => (
                        <div key={i} className="resume-card-exp">
                          <strong>{edu.degree}</strong>
                          <span>{edu.school}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="resume-info-panel">
                <h2 className="resume-info-title">Your Digital Resume</h2>
                <p className="resume-info-desc">
                  This interactive profile showcases your professional journey in a modern, engaging format. 
                  Explore the career timeline below to discover detailed experiences, achievements, and more.
                </p>
                <div className="resume-stats">
                  <div className="resume-stat">
                    <div className="resume-stat-value">{experience.length}</div>
                    <div className="resume-stat-label">Experiences</div>
                  </div>
                  <div className="resume-stat">
                    <div className="resume-stat-value">{skills.length}</div>
                    <div className="resume-stat-label">Skills</div>
                  </div>
                  <div className="resume-stat">
                    <div className="resume-stat-value">{profile.views || 0}</div>
                    <div className="resume-stat-label">Views</div>
                  </div>
                </div>
                <div className="resume-actions">
                  <button className="resume-action-btn primary" onClick={shareProfile}>
                    <i className="fas fa-share-alt"></i>
                    Share Profile
                  </button>
                  <button className="resume-action-btn secondary" onClick={copyProfileUrl}>
                    <i className="fas fa-copy"></i>
                    Copy Link
                  </button>
                </div>
              </div>
            </div>
          </section>
          
          {/* Experience Timeline */}
          {experience.length > 0 && (
            <section className="timeline-section" ref={timelineRef}>
              <div className="section-header">
                <p className="section-label">Career Journey</p>
                <h2 className="section-title">Professional Experience</h2>
                <p className="section-subtitle">Hover over any experience to explore the full story</p>
              </div>
              
              <div className="timeline-container">
                <div className="timeline-list">
                  {experience.map((exp, i) => {
                    // Try multiple logo sources: customLogo > logoUrl > local static > logo.dev API > fallback
                    // Use getKnownDomain to auto-resolve company names to domains
                    const localLogo = getLocalLogo(exp.company);
                    const domain = getKnownDomain(exp.company, exp.companyInfo?.domain);
                    const logoUrl = exp.customLogo || exp.logoUrl || localLogo || (domain ? 'https://img.logo.dev/' + domain + '?token=pk_X-1ZO13GSgeOoUrIuJ6GMQ' : null);
                    const isActive = selectedExp?.id === exp.id || (selectedExp && !exp.id && selectedExp.company === exp.company && selectedExp.role === exp.role);
                    
                    return (
                      <div 
                        key={exp.id || i}
                        className={"timeline-item" + (isActive ? " active" : "")}
                        onClick={() => openPanel(exp)}
                        onMouseEnter={() => handleExpHover(exp)}
                        onMouseLeave={handleExpLeave}
                      >
                        <span className="view-details-badge">{isActive ? 'Viewing' : 'Hover for Details'}</span>
                        
                        <div className="timeline-header">
                          {logoUrl ? (
                            <div className="company-logo">
                              <img 
                                src={logoUrl} 
                                alt={exp.company}
                                onError={(e) => {
                                  // Fallback: try DuckDuckGo icons
                                  const ddgUrl = domain ? 'https://icons.duckduckgo.com/ip3/' + domain + '.ico' : null;
                                  if (ddgUrl && e.target.src !== ddgUrl) {
                                    e.target.src = ddgUrl;
                                  } else {
                                    e.target.style.display = 'none';
                                    e.target.parentElement.innerHTML = '<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;background:linear-gradient(135deg,' + accent + ',#6D28D9);border-radius:16px;color:white;font-weight:700;font-size:26px">' + getCompanyInitial(exp.company) + '</div>';
                                  }
                                }}
                              />
                            </div>
                          ) : (
                            <div className="company-logo-placeholder">{getCompanyInitial(exp.company)}</div>
                          )}
                          <div className="timeline-info">
                            <h3>{exp.role}</h3>
                            <p className="timeline-company">{exp.company}</p>
                          </div>
                        </div>
                        
                        <div className="timeline-meta">
                          <span><i className="far fa-calendar"></i>{exp.startDate} — {exp.endDate || 'Present'}</span>
                          {exp.companyInfo?.location && (
                            <span><i className="fas fa-map-marker-alt"></i>{exp.companyInfo.location}</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>
          )}
          
          {/* Skills Section */}
          {skills.length > 0 && (
            <section className="skills-section">
              <div className="section-header">
                <p className="section-label">Expertise</p>
                <h2 className="section-title">Skills & Capabilities</h2>
              </div>
              
              <div className="skills-grid">
                {skills.map((skill, i) => (
                  <span key={i} className="skill-chip">{skill}</span>
                ))}
              </div>
            </section>
          )}
          
          {/* Education Section */}
          {education.length > 0 && (
            <section className="education-section">
              <div className="section-header">
                <p className="section-label">Foundation</p>
                <h2 className="section-title">Education</h2>
              </div>
              
              <div className="education-cards">
                {education.map((edu, i) => (
                  <div key={i} className="education-card">
                    <h3>{edu.degree}</h3>
                    <p>{edu.school}</p>
                    {edu.year && <span className="year">{edu.year}</span>}
                    {edu.details && <p style={{ marginTop: '12px', fontSize: '13px' }}>{edu.details}</p>}
                  </div>
                ))}
              </div>
            </section>
          )}
          
          {/* Footer */}
          <footer className="profile-footer">
            {qrCode && (
              <div className="qr-section">
                <img src={qrCode} alt="QR Code" className="qr-code" />
                <p className="qr-label">Scan to share this profile</p>
              </div>
            )}
            
            <p className="profile-views">
              <i className="fas fa-eye"></i>
              {profile.views || 0} profile views
            </p>
            
            <a href="/" className="cta-btn">
              <i className="fas fa-rocket"></i>
              Create Your Own Webumé
            </a>
            
            <p className="powered-by">
              Powered by <strong>Webumé</strong> • The Digital Resume Revolution
            </p>
          </footer>
          
          {/* Panel Overlay */}
          <div 
            className={"panel-overlay" + (panelOpen ? " visible" : "")}
            onClick={closePanel}
          ></div>
          
          {/* Detail Panel */}
          <div className={"detail-panel" + (panelOpen ? " open" : "")}>
            {selectedExp && (
              <>
                <div className="panel-header">
                  <button className="panel-close" onClick={closePanel}>
                    <i className="fas fa-times"></i>
                  </button>
                  
                  <div className="panel-company-header">
                    {(() => {
                      // Use getKnownDomain to auto-resolve company names to domains
                      const panelLocalLogo = getLocalLogo(selectedExp.company);
                      const panelDomain = getKnownDomain(selectedExp.company, selectedExp.companyInfo?.domain);
                      const panelLogoUrl = selectedExp.customLogo || selectedExp.logoUrl || panelLocalLogo || (panelDomain ? 'https://img.logo.dev/' + panelDomain + '?token=pk_X-1ZO13GSgeOoUrIuJ6GMQ' : null);
                      
                      return panelLogoUrl ? (
                        <div className="panel-logo">
                          <img 
                            src={panelLogoUrl}
                            alt={selectedExp.company}
                            onError={(e) => {
                              const ddgUrl = panelDomain ? 'https://icons.duckduckgo.com/ip3/' + panelDomain + '.ico' : null;
                              if (ddgUrl && e.target.src !== ddgUrl) {
                                e.target.src = ddgUrl;
                              } else {
                                e.target.parentElement.innerHTML = '<div class="panel-logo-placeholder">' + getCompanyInitial(selectedExp.company) + '</div>';
                              }
                            }}
                          />
                        </div>
                      ) : (
                        <div className="panel-logo-placeholder">{getCompanyInitial(selectedExp.company)}</div>
                      );
                    })()}
                    
                    <div className="panel-title-section">
                      <h2>{selectedExp.company}</h2>
                      <p className="role">{selectedExp.role}</p>
                      <p className="dates">{selectedExp.startDate} — {selectedExp.endDate || 'Present'}</p>
                    </div>
                  </div>
                </div>
                
                <div className="panel-content">
                  {/* Overview / Description */}
                  {selectedExp.description && (
                    <div className="detail-section">
                      <div className="detail-section-header">
                        <div className="detail-section-icon"><i className="fas fa-file-alt"></i></div>
                        <h3>Overview</h3>
                      </div>
                      <div className="detail-section-content">
                        <p>{selectedExp.description}</p>
                      </div>
                    </div>
                  )}
                  
                  {/* Metrics / Achievements */}
                  {selectedExp.metrics && selectedExp.metrics.length > 0 && (
                    <div className="detail-section">
                      <div className="detail-section-header">
                        <div className="detail-section-icon"><i className="fas fa-chart-line"></i></div>
                        <h3>Key Metrics</h3>
                      </div>
                      <div className="metrics-grid">
                        {selectedExp.metrics.map((metric, i) => (
                          <div key={i} className="metric-card">
                            <div className="metric-value">{metric.value}</div>
                            <div className="metric-label">{metric.label}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Responsibilities */}
                  {selectedExp.responsibilities && selectedExp.responsibilities.length > 0 && (
                    <div className="detail-section">
                      <div className="detail-section-header">
                        <div className="detail-section-icon"><i className="fas fa-tasks"></i></div>
                        <h3>Responsibilities</h3>
                      </div>
                      <div className="detail-section-content">
                        <ul>
                          {selectedExp.responsibilities.map((resp, i) => (
                            <li key={i}>{resp}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                  
                  {/* Victories / Accomplishments */}
                  {selectedExp.victories && selectedExp.victories.length > 0 && (
                    <div className="detail-section">
                      <div className="detail-section-header">
                        <div className="detail-section-icon"><i className="fas fa-trophy"></i></div>
                        <h3>Victories</h3>
                      </div>
                      <div className="detail-section-content">
                        <ul>
                          {selectedExp.victories.map((vic, i) => (
                            <li key={i}>{vic}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                  
                  {/* Awards */}
                  {selectedExp.awards && selectedExp.awards.length > 0 && (
                    <div className="detail-section">
                      <div className="detail-section-header">
                        <div className="detail-section-icon"><i className="fas fa-award"></i></div>
                        <h3>Awards & Recognition</h3>
                      </div>
                      {selectedExp.awards.map((award, i) => (
                        <div key={i} className="award-item">
                          <h4><i className="fas fa-star"></i>{award.title || award}</h4>
                          {award.description && <p>{award.description}</p>}
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {/* Projects */}
                  {selectedExp.projects && selectedExp.projects.length > 0 && (
                    <div className="detail-section">
                      <div className="detail-section-header">
                        <div className="detail-section-icon"><i className="fas fa-project-diagram"></i></div>
                        <h3>Notable Projects</h3>
                      </div>
                      {selectedExp.projects.map((project, i) => (
                        <div key={i} className="project-item">
                          <h4><i className="fas fa-folder-open"></i>{project.name || project}</h4>
                          {project.description && <p>{project.description}</p>}
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {/* Media / Photos */}
                  {selectedExp.photos && selectedExp.photos.length > 0 && (
                    <div className="detail-section">
                      <div className="detail-section-header">
                        <div className="detail-section-icon"><i className="fas fa-images"></i></div>
                        <h3>Photos</h3>
                      </div>
                      <div className="media-gallery">
                        {selectedExp.photos.map((photo, i) => (
                          <div key={i} className="media-item">
                            <img src={photo.url || photo} alt={photo.caption || 'Work photo'} />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Reviews / Testimonials */}
                  {selectedExp.reviews && selectedExp.reviews.length > 0 && (
                    <div className="detail-section">
                      <div className="detail-section-header">
                        <div className="detail-section-icon"><i className="fas fa-quote-left"></i></div>
                        <h3>Reviews & Testimonials</h3>
                      </div>
                      {selectedExp.reviews.map((review, i) => (
                        <div key={i} style={{ 
                          padding: '20px', 
                          background: 'var(--bg-card)', 
                          border: '1px solid var(--border)', 
                          borderRadius: '14px',
                          marginBottom: '12px',
                          fontStyle: 'italic',
                          color: 'var(--text-muted)'
                        }}>
                          "{review.text || review}"
                          {review.author && (
                            <p style={{ marginTop: '12px', fontStyle: 'normal', fontWeight: '600', color: 'var(--accent)' }}>
                              — {review.author}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {/* Company Info */}
                  {selectedExp.companyInfo && (
                    <div className="detail-section">
                      <div className="detail-section-header">
                        <div className="detail-section-icon"><i className="fas fa-building"></i></div>
                        <h3>About {selectedExp.company}</h3>
                      </div>
                      <div className="detail-section-content">
                        {selectedExp.companyInfo.description && <p>{selectedExp.companyInfo.description}</p>}
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginTop: '12px' }}>
                          {selectedExp.companyInfo.industry && (
                            <span style={{ 
                              padding: '6px 14px', 
                              background: 'rgba(139,92,246,0.15)', 
                              borderRadius: '8px', 
                              fontSize: '12px' 
                            }}>
                              <i className="fas fa-industry" style={{ marginRight: '6px' }}></i>
                              {selectedExp.companyInfo.industry}
                            </span>
                          )}
                          {selectedExp.companyInfo.location && (
                            <span style={{ 
                              padding: '6px 14px', 
                              background: 'rgba(139,92,246,0.15)', 
                              borderRadius: '8px', 
                              fontSize: '12px' 
                            }}>
                              <i className="fas fa-map-marker-alt" style={{ marginRight: '6px' }}></i>
                              {selectedExp.companyInfo.location}
                            </span>
                          )}
                          {selectedExp.companyInfo.size && (
                            <span style={{ 
                              padding: '6px 14px', 
                              background: 'rgba(139,92,246,0.15)', 
                              borderRadius: '8px', 
                              fontSize: '12px' 
                            }}>
                              <i className="fas fa-users" style={{ marginRight: '6px' }}></i>
                              {selectedExp.companyInfo.size}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      );
    };
    
    ReactDOM.createRoot(document.getElementById('root')).render(<PublicProfile />);
  </script>
</body>
</html>`);
});

// PWA Manifest - App Store Ready
app.get('/manifest.json', (c) => {
  return c.json({
    name: 'Webumé - Digital Resume',
    short_name: 'Webumé',
    description: 'Transform your resume into an immersive digital experience. AI-powered resume parsing, interactive career timeline, 10 professional templates, and instant shareable profiles.',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    background_color: '#0a0a12',
    theme_color: '#8B5CF6',
    orientation: 'portrait-primary',
    dir: 'ltr',
    lang: 'en-US',
    prefer_related_applications: false,
    icons: [
      { src: '/static/icon-48.png', sizes: '48x48', type: 'image/png', purpose: 'any' },
      { src: '/static/icon-72.png', sizes: '72x72', type: 'image/png', purpose: 'any' },
      { src: '/static/icon-96.png', sizes: '96x96', type: 'image/png', purpose: 'any' },
      { src: '/static/icon-128.png', sizes: '128x128', type: 'image/png', purpose: 'any' },
      { src: '/static/icon-144.png', sizes: '144x144', type: 'image/png', purpose: 'any' },
      { src: '/static/icon-152.png', sizes: '152x152', type: 'image/png', purpose: 'any' },
      { src: '/static/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '/static/icon-256.png', sizes: '256x256', type: 'image/png', purpose: 'any' },
      { src: '/static/icon-384.png', sizes: '384x384', type: 'image/png', purpose: 'any' },
      { src: '/static/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
      { src: '/static/icon-1024.png', sizes: '1024x1024', type: 'image/png', purpose: 'any' },
      { src: '/static/icon-192-maskable.png', sizes: '192x192', type: 'image/png', purpose: 'maskable' },
      { src: '/static/icon-512-maskable.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' }
    ],
    categories: ['business', 'productivity', 'lifestyle'],
    iarc_rating_id: '',
    screenshots: [],  // Screenshots are optional - add when available
    shortcuts: [
      { 
        name: 'Upload Resume', 
        short_name: 'Upload',
        description: 'Upload and parse your resume with AI',
        url: '/?action=upload', 
        icons: [{ src: '/static/icon-96.png', sizes: '96x96', type: 'image/png' }] 
      },
      { 
        name: 'View Profile', 
        short_name: 'Profile',
        description: 'Preview your digital resume',
        url: '/?action=preview', 
        icons: [{ src: '/static/icon-96.png', sizes: '96x96', type: 'image/png' }] 
      }
    ],
    related_applications: [],
    protocol_handlers: [],
    share_target: {
      action: '/',
      method: 'POST',
      enctype: 'multipart/form-data',
      params: {
        title: 'title',
        text: 'text',
        url: 'url',
        files: [
          {
            name: 'resume',
            accept: ['application/pdf', '.pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', '.docx', 'text/plain', '.txt']
          }
        ]
      }
    }
  });
});

app.get('/', (c) => {
  // Prevent caching to ensure fresh JavaScript
  c.header('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0');
  c.header('Pragma', 'no-cache');
  c.header('Expires', '0');
  return c.html(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Webumé | Your WebApp Resume</title>
  <link rel="icon" type="image/png" href="/static/icon-192.png">
  <link rel="apple-touch-icon" href="/static/icon-192.png">
  <link rel="apple-touch-icon" sizes="152x152" href="/static/icon-152.png">
  <link rel="apple-touch-icon" sizes="180x180" href="/static/icon-192.png">
  <link rel="apple-touch-icon" sizes="167x167" href="/static/icon-192.png">
  <link rel="manifest" href="/manifest.json">
  <meta name="theme-color" content="#8B5CF6">
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
  <meta name="apple-mobile-web-app-title" content="Webumé">
  <meta name="application-name" content="Webumé">
  <meta name="msapplication-TileColor" content="#8B5CF6">
  <meta name="msapplication-TileImage" content="/static/icon-144.png">
  <meta name="description" content="Transform your resume into an immersive digital experience. AI-powered resume parsing, interactive career timeline, and professional templates.">
  <meta property="og:title" content="Webumé - Digital Resume Revolution">
  <meta property="og:description" content="AI-powered digital profiles that get you hired. Create stunning interactive resumes in minutes.">
  <meta property="og:type" content="website">
  <meta property="og:image" content="/static/icon-512.png">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="Webumé - Digital Resume Revolution">
  <meta name="twitter:description" content="AI-powered digital profiles that get you hired">
  
  <script src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
  <script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js"></script>
  <script>pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';</script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/mammoth/1.6.0/mammoth.browser.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/qrcode@1.5.3/build/qrcode.min.js"></script>
  
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Space+Grotesk:wght@500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
  
  <style>
    :root {
      --purple-main: #8B5CF6;
      --purple-light: #A78BFA;
      --pink-main: #EC4899;
      --cyan-main: #06B6D4;
      --green-main: #10B981;
    }
    
    * { margin: 0; padding: 0; box-sizing: border-box; }
    
    html, body, #root {
      height: 100%;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      overflow: hidden;
      -webkit-tap-highlight-color: transparent;
    }
    
    /* CRITICAL: Root element must be above the fixed background */
    #root {
      position: relative;
      z-index: 10;
      pointer-events: auto;
    }
    
    /* Ensure all interactive elements work on touch devices */
    input, button, textarea, select, a {
      touch-action: manipulation;
      -webkit-user-select: text;
      user-select: text;
    }
    
    button {
      -webkit-user-select: none;
      user-select: none;
    }
    
    /* ===========================================================
       PREMIUM BACKGROUND - Glass Cards Image - CRYSTAL CLEAR
       The beautiful glass cards image as background - NO BLUR
       =========================================================== */
    .premium-bg {
      position: fixed;
      inset: 0;
      background: #0a0a12;
      overflow: hidden;
      pointer-events: none; /* Allow clicks to pass through to content */
      z-index: -1; /* Explicitly place behind all content */
    }
    
    /* Background image - NO BLUR - crystal clear glass cards */
    .bg-image {
      position: absolute;
      inset: 0;
      background-image: url('/static/background.png');
      background-size: cover;
      background-position: center;
      background-repeat: no-repeat;
      /* NO BLUR - show the beautiful glass cards clearly */
      filter: brightness(1) saturate(1.05);
      opacity: 1;
    }
    
    /* Minimal overlay - just a hint of darkness for text readability */
    .bg-gradient {
      position: absolute;
      inset: 0;
      background: linear-gradient(180deg, rgba(0, 0, 0, 0.15) 0%, rgba(0, 0, 0, 0.25) 100%);
    }
    
    /* No noise overlay - keep it clean */
    .noise-overlay {
      display: none;
    }
    
    /* ===========================================================
       GLASSMORPHISM COMPONENTS
       Semi-transparent cards with blur effect
       =========================================================== */
    .glass {
      background: rgba(255, 255, 255, 0.03);
      backdrop-filter: blur(4px);
      -webkit-backdrop-filter: blur(4px);
      border: 1px solid rgba(255, 255, 255, 0.06);
      border-radius: 20px;
      position: relative;
      z-index: 10;
      pointer-events: auto;
    }
    
    .glass-card {
      background: rgba(255, 255, 255, 0.04);
      backdrop-filter: blur(6px);
      -webkit-backdrop-filter: blur(6px);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 24px;
      box-shadow: 
        0 4px 16px rgba(0, 0, 0, 0.15),
        inset 0 1px 0 rgba(255, 255, 255, 0.06);
    }
    
    .glass-sidebar {
      background: rgba(15, 8, 24, 0.5);
      backdrop-filter: blur(6px);
      -webkit-backdrop-filter: blur(6px);
      border-right: 1px solid rgba(255, 255, 255, 0.05);
    }
    
    .glass-input {
      background: rgba(0, 0, 0, 0.2);
      backdrop-filter: blur(4px);
      -webkit-backdrop-filter: blur(4px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 12px;
      padding: 14px 18px;
      color: #fff;
      font-family: inherit;
      font-size: 14px;
      transition: all 0.25s ease;
      width: 100%;
      position: relative;
      z-index: 10;
      pointer-events: auto;
    }
    
    .glass-input:focus {
      outline: none;
      border-color: var(--purple-main);
      box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.2);
    }
    
    .glass-input::placeholder {
      color: rgba(255, 255, 255, 0.3);
    }
    
    /* ===========================================================
       LAYOUT - Dashboard Style with Sidebar
       =========================================================== */
    .app-container {
      position: relative;
      z-index: 10;
      display: flex;
      height: 100vh;
    }
    
    /* Sidebar */
    .sidebar {
      width: 280px;
      padding: 28px 20px;
      display: flex;
      flex-direction: column;
      flex-shrink: 0;
    }
    
    .logo {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0 12px;
      margin-bottom: 40px;
    }
    
    .logo-img {
      width: 180px;
      height: auto;
      filter: drop-shadow(0 8px 24px rgba(139, 92, 246, 0.4));
      transition: transform 0.3s ease, filter 0.3s ease;
    }
    
    .logo-img:hover {
      transform: scale(1.05);
      filter: drop-shadow(0 12px 32px rgba(139, 92, 246, 0.5));
    }
    
    .nav-group {
      margin-bottom: 28px;
    }
    
    .nav-label {
      font-size: 11px;
      font-weight: 600;
      color: rgba(255, 255, 255, 0.35);
      text-transform: uppercase;
      letter-spacing: 1.2px;
      padding: 0 16px;
      margin-bottom: 12px;
    }
    
    .nav-btn {
      display: flex;
      align-items: center;
      gap: 14px;
      width: 100%;
      padding: 13px 16px;
      border-radius: 14px;
      border: none;
      background: transparent;
      color: rgba(255, 255, 255, 0.55);
      font-family: inherit;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
      text-align: left;
    }
    
    .nav-btn:hover {
      background: rgba(255, 255, 255, 0.05);
      color: #fff;
    }
    
    .nav-btn.active {
      background: linear-gradient(135deg, rgba(139, 92, 246, 0.25), rgba(236, 72, 153, 0.15));
      color: #fff;
      border: 1px solid rgba(139, 92, 246, 0.3);
    }
    
    .nav-btn i {
      width: 20px;
      font-size: 15px;
    }
    
    .sidebar-footer {
      margin-top: auto;
      padding: 20px;
      background: rgba(139, 92, 246, 0.1);
      border: 1px solid rgba(139, 92, 246, 0.2);
      border-radius: 16px;
    }
    
    .stat-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 10px 0;
    }
    
    .stat-row:not(:last-child) {
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
    }
    
    .stat-name {
      font-size: 13px;
      color: rgba(255, 255, 255, 0.5);
    }
    
    .stat-num {
      font-size: 20px;
      font-weight: 700;
      color: var(--purple-light);
    }
    
    /* Main Content Area */
    .main {
      flex: 1;
      padding: 28px 32px;
      overflow-y: auto;
    }
    
    .main::-webkit-scrollbar { width: 6px; }
    .main::-webkit-scrollbar-track { background: transparent; }
    .main::-webkit-scrollbar-thumb { 
      background: rgba(139, 92, 246, 0.3); 
      border-radius: 3px;
    }
    .main::-webkit-scrollbar-thumb:hover {
      background: rgba(139, 92, 246, 0.5);
    }
    
    /* Page Header */
    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 28px;
    }
    
    .page-title {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 32px;
      font-weight: 700;
      color: #fff;
      letter-spacing: -0.5px;
    }
    
    .page-desc {
      font-size: 14px;
      color: rgba(255, 255, 255, 0.45);
      margin-top: 6px;
    }
    
    /* ===========================================================
       STAT CARDS GRID
       =========================================================== */
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 20px;
      margin-bottom: 28px;
    }
    
    .stat-card {
      padding: 24px;
      position: relative;
      overflow: hidden;
    }
    
    .stat-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 3px;
      background: linear-gradient(90deg, var(--purple-main), var(--pink-main));
    }
    
    .stat-card.cyan::before {
      background: linear-gradient(90deg, var(--cyan-main), #22D3EE);
    }
    
    .stat-card.green::before {
      background: linear-gradient(90deg, var(--green-main), #34D399);
    }
    
    .stat-icon-wrap {
      width: 52px;
      height: 52px;
      background: rgba(139, 92, 246, 0.15);
      border-radius: 14px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 18px;
    }
    
    .stat-icon-wrap i {
      font-size: 22px;
      color: var(--purple-main);
    }
    
    .stat-card.cyan .stat-icon-wrap {
      background: rgba(6, 182, 212, 0.15);
    }
    
    .stat-card.cyan .stat-icon-wrap i {
      color: var(--cyan-main);
    }
    
    .stat-card.green .stat-icon-wrap {
      background: rgba(16, 185, 129, 0.15);
    }
    
    .stat-card.green .stat-icon-wrap i {
      color: var(--green-main);
    }
    
    .stat-card .value {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 40px;
      font-weight: 700;
      color: #fff;
      line-height: 1;
      margin-bottom: 6px;
    }
    
    .stat-card .label {
      font-size: 13px;
      color: rgba(255, 255, 255, 0.45);
      font-weight: 500;
    }
    
    /* ===========================================================
       UPLOAD ZONE
       =========================================================== */
    .upload-zone {
      padding: 60px 48px;
      text-align: center;
    }
    
    .dropzone {
      padding: 70px 50px;
      border: 2px dashed rgba(139, 92, 246, 0.4);
      border-radius: 24px;
      cursor: pointer;
      transition: all 0.3s ease;
      background: linear-gradient(135deg, rgba(139, 92, 246, 0.05), rgba(236, 72, 153, 0.03));
    }
    
    .dropzone:hover {
      border-color: var(--purple-main);
      background: linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(236, 72, 153, 0.06));
      transform: translateY(-2px);
    }
    
    .dropzone.drag-active {
      border-color: var(--cyan-main);
      border-style: solid;
      background: linear-gradient(135deg, rgba(6, 182, 212, 0.1), rgba(139, 92, 246, 0.05));
    }
    
    .upload-logo {
      width: 280px;
      height: auto;
      margin: 0 auto 32px;
      filter: drop-shadow(0 20px 50px rgba(139, 92, 246, 0.5));
      animation: floatLogo 4s ease-in-out infinite;
    }
    
    @keyframes floatLogo {
      0%, 100% { transform: translateY(0) scale(1); }
      50% { transform: translateY(-15px) scale(1.02); }
    }
    
    .upload-icon-wrap {
      width: 80px;
      height: 80px;
      margin: 0 auto 20px;
      background: linear-gradient(135deg, var(--purple-main), var(--pink-main));
      border-radius: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 16px 40px rgba(139, 92, 246, 0.4);
    }
    
    .upload-icon-wrap i {
      font-size: 32px;
      color: #fff;
    }
    
    .upload-title {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 30px;
      font-weight: 700;
      color: #fff;
      margin-bottom: 10px;
    }
    
    .upload-subtitle {
      font-size: 15px;
      color: rgba(255, 255, 255, 0.45);
      margin-bottom: 32px;
    }
    
    .format-pills {
      display: flex;
      justify-content: center;
      gap: 14px;
    }
    
    .format-pill {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 12px 22px;
      background: rgba(255, 255, 255, 0.06);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 100px;
      font-size: 13px;
      font-weight: 500;
      color: rgba(255, 255, 255, 0.7);
    }
    
    .format-pill i {
      color: var(--purple-main);
    }
    
    /* ===========================================================
       PROCESSING STATE
       =========================================================== */
    .processing-state {
      padding: 70px;
      text-align: center;
    }
    
    .ai-visual {
      width: 140px;
      height: 140px;
      margin: 0 auto 36px;
      position: relative;
    }
    
    .ai-core {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 70px;
      height: 70px;
      background: linear-gradient(135deg, var(--purple-main), var(--pink-main));
      border-radius: 50%;
      box-shadow: 0 0 60px rgba(139, 92, 246, 0.5);
      animation: pulsate 2s ease-in-out infinite;
    }
    
    @keyframes pulsate {
      0%, 100% { transform: translate(-50%, -50%) scale(1); }
      50% { transform: translate(-50%, -50%) scale(1.1); }
    }
    
    .ai-ring {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      border: 2px solid var(--purple-main);
      border-radius: 50%;
      opacity: 0;
      animation: ringExpand 2s ease-out infinite;
    }
    
    .ai-ring:nth-child(2) { animation-delay: 0.6s; }
    .ai-ring:nth-child(3) { animation-delay: 1.2s; }
    
    @keyframes ringExpand {
      0% { width: 70px; height: 70px; opacity: 0.7; }
      100% { width: 140px; height: 140px; opacity: 0; }
    }
    
    .ai-badge {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      padding: 10px 24px;
      background: linear-gradient(135deg, var(--purple-main), var(--pink-main));
      border-radius: 100px;
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 1.2px;
      text-transform: uppercase;
      color: #fff;
      margin-bottom: 20px;
    }
    
    .ai-badge-dot {
      width: 7px;
      height: 7px;
      background: #fff;
      border-radius: 50%;
      animation: blinkDot 1s infinite;
    }
    
    @keyframes blinkDot {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.3; }
    }
    
    .processing-title {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 26px;
      font-weight: 700;
      color: #fff;
      margin-bottom: 10px;
    }
    
    .processing-subtitle {
      font-size: 14px;
      color: rgba(255, 255, 255, 0.45);
      margin-bottom: 36px;
    }
    
    .progress-percent {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 52px;
      font-weight: 700;
      color: var(--cyan-main);
      margin-bottom: 20px;
    }
    
    .progress-track {
      max-width: 420px;
      height: 6px;
      margin: 0 auto 32px;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 3px;
      overflow: hidden;
    }
    
    .progress-bar {
      height: 100%;
      background: linear-gradient(90deg, var(--purple-main), var(--cyan-main));
      border-radius: 3px;
      transition: width 0.3s ease;
    }
    
    .step-list {
      display: flex;
      flex-direction: column;
      gap: 10px;
      max-width: 340px;
      margin: 0 auto;
    }
    
    .step-item {
      display: flex;
      align-items: center;
      gap: 14px;
      padding: 14px 18px;
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.05);
      border-radius: 12px;
      font-size: 13px;
      color: rgba(255, 255, 255, 0.35);
    }
    
    .step-item.active {
      background: rgba(139, 92, 246, 0.12);
      border-color: rgba(139, 92, 246, 0.25);
      color: var(--purple-light);
    }
    
    .step-item.done {
      background: rgba(16, 185, 129, 0.1);
      border-color: rgba(16, 185, 129, 0.25);
      color: var(--green-main);
    }
    
    .step-item i {
      width: 18px;
    }
    
    /* ===========================================================
       FORM ELEMENTS
       =========================================================== */
    .form-row {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 18px;
    }
    
    .form-field {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    
    .form-field.full-width {
      grid-column: 1 / -1;
    }
    
    .form-label {
      font-size: 12px;
      font-weight: 600;
      color: rgba(255, 255, 255, 0.5);
      text-transform: uppercase;
      letter-spacing: 0.6px;
    }
    
    .form-textarea {
      min-height: 110px;
      resize: vertical;
    }
    
    /* ===========================================================
       BUTTONS
       =========================================================== */
    .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      padding: 14px 28px;
      border-radius: 12px;
      font-family: inherit;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      border: none;
      transition: all 0.25s ease;
      position: relative;
      z-index: 10;
      pointer-events: auto;
    }
    
    .btn-primary {
      background: linear-gradient(135deg, var(--purple-main), var(--pink-main));
      color: #fff;
      box-shadow: 0 10px 30px rgba(139, 92, 246, 0.35);
    }
    
    .btn-primary:hover {
      transform: translateY(-3px);
      box-shadow: 0 15px 40px rgba(139, 92, 246, 0.45);
    }
    
    .btn-secondary {
      background: rgba(255, 255, 255, 0.08);
      color: #fff;
      border: 1px solid rgba(255, 255, 255, 0.15);
    }
    
    .btn-secondary:hover {
      background: rgba(255, 255, 255, 0.12);
    }
    
    .btn-ghost {
      width: 100%;
      padding: 18px;
      background: transparent;
      border: 2px dashed rgba(255, 255, 255, 0.15);
      color: rgba(255, 255, 255, 0.45);
      border-radius: 14px;
    }
    
    .btn-ghost:hover {
      border-color: var(--purple-main);
      color: var(--purple-light);
    }
    
    .btn-icon {
      width: 38px;
      height: 38px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 10px;
      color: rgba(255, 255, 255, 0.5);
      cursor: pointer;
      font-size: 14px;
    }
    
    .btn-icon:hover {
      background: rgba(239, 68, 68, 0.15);
      border-color: rgba(239, 68, 68, 0.3);
      color: #EF4444;
    }
    
    /* ===========================================================
       EXPERIENCE CARDS
       =========================================================== */
    .exp-entry {
      padding: 26px;
      margin-bottom: 18px;
      border-left: 4px solid var(--purple-main);
    }
    
    .exp-head {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }
    
    .exp-badge {
      width: 40px;
      height: 40px;
      background: linear-gradient(135deg, var(--purple-main), var(--pink-main));
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 15px;
      font-weight: 700;
      color: #fff;
    }
    
    /* Day in Life Section */
    .day-section {
      margin-top: 24px;
      padding: 20px;
      background: rgba(6, 182, 212, 0.06);
      border: 1px solid rgba(6, 182, 212, 0.15);
      border-radius: 14px;
    }
    
    .day-header {
      font-size: 13px;
      font-weight: 600;
      color: var(--cyan-main);
      margin-bottom: 16px;
      display: flex;
      align-items: center;
      gap: 10px;
    }
    
    .day-entry {
      display: flex;
      align-items: center;
      gap: 14px;
      margin-bottom: 10px;
    }
    
    .day-time {
      width: 90px;
      font-size: 12px;
      font-weight: 600;
      color: var(--purple-light);
    }
    
    .day-input {
      flex: 1;
      padding: 10px 14px;
      background: rgba(0, 0, 0, 0.25);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 8px;
      color: #fff;
      font-size: 13px;
    }
    
    .day-input:focus {
      outline: none;
      border-color: var(--cyan-main);
    }
    
    /* Metrics Section */
    .metrics-section {
      margin-top: 24px;
    }
    
    .metrics-header {
      font-size: 13px;
      font-weight: 600;
      color: var(--green-main);
      margin-bottom: 16px;
      display: flex;
      align-items: center;
      gap: 10px;
    }
    
    .metrics-row {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 12px;
    }
    
    .metric-box {
      background: rgba(0, 0, 0, 0.25);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 12px;
      padding: 14px;
      text-align: center;
      transition: border-color 0.2s ease;
    }
    
    .metric-box:hover {
      border-color: var(--green-main);
    }
    
    .metric-box input {
      width: 100%;
      background: transparent;
      border: none;
      outline: none;
      text-align: center;
      color: #fff;
      font-family: inherit;
    }
    
    .metric-box input:first-child {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 22px;
      font-weight: 700;
      color: var(--green-main);
      margin-bottom: 6px;
    }
    
    .metric-box input:last-child {
      font-size: 10px;
      font-weight: 600;
      text-transform: uppercase;
      color: rgba(255, 255, 255, 0.45);
      letter-spacing: 0.5px;
    }
    
    /* ===========================================================
       SKILLS CHIPS
       =========================================================== */
    .skills-list {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      margin-bottom: 20px;
    }
    
    .skill-chip {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 10px 18px;
      background: rgba(139, 92, 246, 0.15);
      border: 1px solid rgba(139, 92, 246, 0.25);
      border-radius: 100px;
      font-size: 13px;
      font-weight: 500;
      color: #E9D5FF;
    }
    
    .skill-chip button {
      background: none;
      border: none;
      color: rgba(255, 255, 255, 0.4);
      cursor: pointer;
      padding: 0;
      font-size: 12px;
    }
    
    .skill-chip button:hover {
      color: #EF4444;
    }
    
    /* ===========================================================
       PREVIEW PAGE
       =========================================================== */
    .preview-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 24px 28px;
      margin-bottom: 24px;
    }
    
    .profile-hero {
      padding: 50px;
      text-align: center;
      margin-bottom: 24px;
    }
    
    .profile-avatar {
      width: 110px;
      height: 110px;
      margin: 0 auto 24px;
      background: linear-gradient(135deg, var(--purple-main), var(--pink-main), var(--cyan-main));
      border-radius: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: 'Space Grotesk', sans-serif;
      font-size: 40px;
      font-weight: 700;
      color: #fff;
      box-shadow: 0 20px 50px rgba(139, 92, 246, 0.35);
    }
    
    .profile-name {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 32px;
      font-weight: 700;
      color: #fff;
      margin-bottom: 10px;
    }
    
    .profile-title {
      font-size: 18px;
      font-weight: 600;
      color: var(--cyan-main);
      margin-bottom: 14px;
    }
    
    .profile-tagline {
      color: rgba(255, 255, 255, 0.55);
      max-width: 520px;
      margin: 0 auto;
      line-height: 1.7;
    }
    
    /* Timeline */
    .timeline-wrap {
      padding-left: 45px;
      position: relative;
    }
    
    .timeline-wrap::before {
      content: '';
      position: absolute;
      left: 16px;
      top: 0;
      bottom: 0;
      width: 2px;
      background: linear-gradient(180deg, var(--purple-main), var(--cyan-main), var(--pink-main));
    }
    
    .timeline-item {
      position: relative;
      margin-bottom: 26px;
      padding: 24px;
    }
    
    .timeline-item::before {
      content: '';
      position: absolute;
      left: -37px;
      top: 28px;
      width: 14px;
      height: 14px;
      background: var(--purple-main);
      border-radius: 50%;
      border: 4px solid #150b24;
      box-shadow: 0 0 20px var(--purple-main);
    }
    
    .timeline-company {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 22px;
      font-weight: 700;
      color: #fff;
      margin-bottom: 6px;
    }
    
    .timeline-role {
      font-size: 15px;
      font-weight: 600;
      color: var(--cyan-main);
      margin-bottom: 14px;
    }
    
    .timeline-dates {
      display: inline-block;
      padding: 6px 14px;
      background: rgba(139, 92, 246, 0.15);
      border: 1px solid rgba(139, 92, 246, 0.25);
      border-radius: 100px;
      font-size: 12px;
      font-weight: 600;
      color: var(--purple-light);
      margin-bottom: 14px;
    }
    
    .timeline-desc {
      color: rgba(255, 255, 255, 0.55);
      font-size: 14px;
      line-height: 1.7;
    }
    
    .timeline-metrics {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 12px;
      margin-top: 18px;
    }
    
    .timeline-metric {
      background: rgba(16, 185, 129, 0.1);
      border: 1px solid rgba(16, 185, 129, 0.2);
      border-radius: 12px;
      padding: 14px;
      text-align: center;
    }
    
    .timeline-metric-val {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 22px;
      font-weight: 700;
      color: var(--green-main);
    }
    
    .timeline-metric-label {
      font-size: 10px;
      font-weight: 600;
      text-transform: uppercase;
      color: rgba(255, 255, 255, 0.45);
      margin-top: 4px;
    }
    
    /* ===========================================================
       RESPONSIVE
       =========================================================== */
    @media (max-width: 1100px) {
      .stats-grid { grid-template-columns: repeat(2, 1fr); }
      .metrics-row, .timeline-metrics { grid-template-columns: repeat(2, 1fr); }
    }
    
    @media (max-width: 800px) {
      .sidebar { display: none; }
      .stats-grid, .form-row { grid-template-columns: 1fr; }
    }
    
    /* Animation for floating save indicator */
    @keyframes slideIn {
      from { transform: translateX(100px); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
    
    /* Responsibilities editor styles */
    .resp-section {
      margin-top: 24px;
      padding: 20px;
      background: rgba(139, 92, 246, 0.06);
      border: 1px solid rgba(139, 92, 246, 0.15);
      border-radius: 14px;
    }
    
    .resp-header {
      font-size: 13px;
      font-weight: 600;
      color: var(--purple-light);
      margin-bottom: 16px;
      display: flex;
      align-items: center;
      gap: 10px;
    }
    
    .resp-item {
      display: flex;
      align-items: flex-start;
      gap: 10px;
      margin-bottom: 10px;
    }
    
    .resp-bullet {
      width: 24px;
      height: 24px;
      min-width: 24px;
      background: rgba(139, 92, 246, 0.2);
      border-radius: 6px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 10px;
      color: var(--purple-light);
      margin-top: 8px;
    }
    
    .resp-input {
      flex: 1;
      padding: 10px 14px;
      background: rgba(0, 0, 0, 0.25);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 8px;
      color: #fff;
      font-size: 13px;
      line-height: 1.5;
    }
    
    .resp-input:focus {
      outline: none;
      border-color: var(--purple-main);
    }
    
    .resp-delete {
      width: 28px;
      height: 28px;
      min-width: 28px;
      background: rgba(239, 68, 68, 0.1);
      border: 1px solid rgba(239, 68, 68, 0.2);
      border-radius: 6px;
      color: rgba(239, 68, 68, 0.6);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 11px;
      margin-top: 8px;
      transition: all 0.2s;
    }
    
    .resp-delete:hover {
      background: rgba(239, 68, 68, 0.2);
      color: #EF4444;
    }
    
    .add-resp-btn {
      width: 100%;
      padding: 12px;
      margin-top: 12px;
      background: transparent;
      border: 2px dashed rgba(139, 92, 246, 0.3);
      border-radius: 8px;
      color: var(--purple-light);
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
    }
    
    .add-resp-btn:hover {
      border-color: var(--purple-main);
      background: rgba(139, 92, 246, 0.1);
    }
    
    /* Enhanced image quality rendering */
    img {
      -webkit-backface-visibility: hidden;
      backface-visibility: hidden;
      image-rendering: -webkit-optimize-contrast;
    }
    
    /* Video player improvements */
    video {
      outline: none;
      -webkit-tap-highlight-color: transparent;
    }
    
    video::-webkit-media-controls {
      background: linear-gradient(transparent, rgba(0,0,0,0.7));
    }
    
    video::-webkit-media-controls-enclosure {
      padding: 0;
    }
    
    video::-webkit-media-controls-panel {
      padding: 0 8px 8px;
    }
  </style>
</head>
<body>
  <!-- Premium Background with Glass Cards Image -->
  <div class="premium-bg">
    <div class="bg-image"></div>
    <div class="bg-gradient"></div>
    <div class="noise-overlay"></div>
  </div>
  
  <div id="root"></div>
  
  <script type="text/babel">
    const { useState, useRef, useEffect } = React;
    
    // File Parsers
    const FileParser = {
      async pdf(file) {
        const ab = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: ab }).promise;
        let text = '';
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const content = await page.getTextContent();
          text += content.items.map(x => x.str).join(' ') + '\\n';
        }
        return text;
      },
      async docx(file) {
        const ab = await file.arrayBuffer();
        return (await mammoth.extractRawText({ arrayBuffer: ab })).value;
      },
      async txt(file) {
        return await file.text();
      }
    };
    
    const VIEW = { AUTH: 0, UPLOAD: 1, BUILDER: 2, PREVIEW: 3, TAILOR: 4 };
    
    // INDUSTRY-SPECIFIC TEMPLATES - 10 Premium Options
    const TEMPLATE_CATEGORIES = [
      { id: 'professional', name: 'Professional', icon: 'fa-briefcase' },
      { id: 'service', name: 'Service Industry', icon: 'fa-hands-helping' },
      { id: 'creative', name: 'Creative', icon: 'fa-palette' },
      { id: 'technical', name: 'Technical', icon: 'fa-code' }
    ];
    
    const TEMPLATES = [
      // Professional Category
      { 
        id: 'executive', 
        category: 'professional',
        name: 'Executive', 
        desc: 'Bold & authoritative for C-suite and senior leaders', 
        color: '#8B5CF6', 
        accent2: '#6D28D9',
        icon: 'fa-crown',
        gradient: 'linear-gradient(135deg, #8B5CF6, #6D28D9, #4C1D95)',
        industries: ['Finance', 'Consulting', 'Legal', 'Corporate']
      },
      { 
        id: 'corporate', 
        category: 'professional',
        name: 'Corporate', 
        desc: 'Professional navy & gold for business roles', 
        color: '#1E3A5F', 
        accent2: '#D4AF37',
        icon: 'fa-building',
        gradient: 'linear-gradient(135deg, #1E3A5F, #2C5282, #D4AF37)',
        industries: ['Banking', 'Insurance', 'Real Estate', 'Management']
      },
      { 
        id: 'nonprofit', 
        category: 'professional',
        name: 'Nonprofit', 
        desc: 'Trust-building blues & greens for mission-driven work', 
        color: '#0891B2', 
        accent2: '#059669',
        icon: 'fa-heart',
        gradient: 'linear-gradient(135deg, #0891B2, #0D9488, #059669)',
        industries: ['Charity', 'NGO', 'Social Work', 'Education']
      },
      
      // Service Industry Category
      { 
        id: 'healthcare', 
        category: 'service',
        name: 'Healthcare', 
        desc: 'Calming blues & teals for medical professionals', 
        color: '#0EA5E9', 
        accent2: '#14B8A6',
        icon: 'fa-heartbeat',
        gradient: 'linear-gradient(135deg, #0EA5E9, #06B6D4, #14B8A6)',
        industries: ['Medical', 'Nursing', 'Pharmacy', 'Dental']
      },
      { 
        id: 'restaurant', 
        category: 'service',
        name: 'Restaurant & Hospitality', 
        desc: 'Warm appetizing colors for food service', 
        color: '#DC2626', 
        accent2: '#EA580C',
        icon: 'fa-utensils',
        gradient: 'linear-gradient(135deg, #DC2626, #EA580C, #F59E0B)',
        industries: ['Chef', 'Server', 'Hotel', 'Catering']
      },
      { 
        id: 'trades', 
        category: 'service',
        name: 'Trades & Services', 
        desc: 'Strong earth tones for skilled trades', 
        color: '#D97706', 
        accent2: '#78716C',
        icon: 'fa-tools',
        gradient: 'linear-gradient(135deg, #D97706, #B45309, #78716C)',
        industries: ['Plumbing', 'Electric', 'HVAC', 'Construction']
      },
      { 
        id: 'beauty', 
        category: 'service',
        name: 'Beauty & Wellness', 
        desc: 'Elegant rose gold & soft tones for salons & spas', 
        color: '#EC4899', 
        accent2: '#BE185D',
        icon: 'fa-spa',
        gradient: 'linear-gradient(135deg, #EC4899, #DB2777, #BE185D)',
        industries: ['Hair Salon', 'Spa', 'Makeup', 'Fitness']
      },
      
      // Creative Category
      { 
        id: 'creative', 
        category: 'creative',
        name: 'Creative', 
        desc: 'Vibrant gradients for designers & artists', 
        color: '#F472B6', 
        accent2: '#A855F7',
        icon: 'fa-paint-brush',
        gradient: 'linear-gradient(135deg, #F472B6, #E879F9, #A855F7)',
        industries: ['Design', 'Art', 'Photography', 'Marketing']
      },
      
      // Technical Category
      { 
        id: 'tech', 
        category: 'technical',
        name: 'Tech Pioneer', 
        desc: 'Data-driven cyan & neon for engineers', 
        color: '#06B6D4', 
        accent2: '#22D3EE',
        icon: 'fa-microchip',
        gradient: 'linear-gradient(135deg, #06B6D4, #22D3EE, #67E8F9)',
        industries: ['Software', 'Data Science', 'DevOps', 'IT']
      },
      { 
        id: 'minimal', 
        category: 'technical',
        name: 'Minimal', 
        desc: 'Clean & elegant simplicity for any industry', 
        color: '#10B981', 
        accent2: '#34D399',
        icon: 'fa-feather',
        gradient: 'linear-gradient(135deg, #10B981, #34D399, #6EE7B7)',
        industries: ['General', 'Startup', 'Freelance', 'Academic']
      }
    ];
    
    // Storage keys
    const STORAGE_KEYS = {
      PROFILE: 'webume_profile',
      PHOTO: 'webume_photo',
      TEMPLATE: 'webume_template',
      RAW_TEXT: 'webume_rawtext',
      LAST_SAVED: 'webume_last_saved'
    };
    
    // Auth View Component - Simplified for maximum compatibility
    const AuthView = ({ onLogin, authLoading, authError, clearAuthError }) => {
      const [isLogin, setIsLogin] = useState(true);
      const [email, setEmail] = useState('');
      const [password, setPassword] = useState('');
      const [name, setName] = useState('');
      const [error, setError] = useState('');
      const [showPassword, setShowPassword] = useState(false);
      
      const handleSubmit = (e) => {
        e.preventDefault();
        e.stopPropagation();
        console.log('📝 Form submitted!', { email, password: '***', name, isLogin });
        setError('');
        
        if (!email || !password || (!isLogin && !name)) {
          console.log('❌ Validation failed - missing fields');
          setError('Please fill in all fields');
          return;
        }
        
        console.log('✅ Validation passed, calling onLogin...');
        onLogin(isLogin, email, password, name);
      };
      
      // Direct input handlers for maximum compatibility
      const handleEmailChange = (e) => {
        console.log('📧 Email:', e.target.value);
        setEmail(e.target.value);
      };
      
      const handlePasswordChange = (e) => {
        console.log('🔑 Password changed');
        setPassword(e.target.value);
      };
      
      const handleNameChange = (e) => {
        console.log('👤 Name:', e.target.value);
        setName(e.target.value);
      };
      
      return (
        <div style={{ 
          minHeight: '100vh', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          padding: '20px',
          position: 'relative',
          zIndex: 100
        }}>
          <div className="glass" style={{ 
            width: '100%', 
            maxWidth: '440px', 
            padding: '48px 40px',
            borderRadius: '28px',
            position: 'relative',
            zIndex: 200
          }}>
            <div style={{ textAlign: 'center', marginBottom: '36px' }}>
              <div style={{
                width: '80px',
                height: '80px',
                borderRadius: '24px',
                background: 'linear-gradient(135deg, var(--purple-main), var(--pink-main))',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px',
                boxShadow: '0 12px 40px rgba(139,92,246,0.4)'
              }}>
                <i className="fas fa-rocket" style={{ fontSize: '32px', color: '#fff' }}></i>
              </div>
              <h1 style={{ fontSize: '28px', fontWeight: '800', color: '#fff', marginBottom: '8px' }}>
                {isLogin ? 'Welcome Back!' : 'Create Account'}
              </h1>
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px' }}>
                {isLogin ? 'Sign in to access your saved profiles' : 'Start building your digital profile'}
              </p>
            </div>
            
            {(error || authError) && (
              <div style={{
                padding: '14px 18px',
                background: 'rgba(239,68,68,0.15)',
                border: '1px solid rgba(239,68,68,0.3)',
                borderRadius: '12px',
                marginBottom: '20px',
                color: '#EF4444',
                fontSize: '13px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}>
                <i className="fas fa-exclamation-circle"></i>
                {error || authError}
              </div>
            )}
            
            <form onSubmit={handleSubmit}>
              {!isLogin && (
                <div style={{ marginBottom: '18px' }}>
                  <label style={{ display: 'block', color: 'rgba(255,255,255,0.7)', fontSize: '13px', fontWeight: '600', marginBottom: '8px' }}>
                    <i className="fas fa-user" style={{ marginRight: '8px', color: 'var(--purple-main)' }}></i>
                    Full Name
                  </label>
                  <input
                    type="text"
                    className="glass-input"
                    id="auth-name"
                    name="name"
                    value={name}
                    onChange={handleNameChange}
                    onFocus={() => console.log('👤 Name focused')}
                    placeholder="John Smith"
                    autoComplete="name"
                    style={{ 
                      width: '100%', 
                      padding: '14px 16px', 
                      fontSize: '16px',
                      WebkitAppearance: 'none',
                      appearance: 'none'
                    }}
                  />
                </div>
              )}
              
              <div style={{ marginBottom: '18px' }}>
                <label style={{ display: 'block', color: 'rgba(255,255,255,0.7)', fontSize: '13px', fontWeight: '600', marginBottom: '8px' }}>
                  <i className="fas fa-envelope" style={{ marginRight: '8px', color: 'var(--purple-main)' }}></i>
                  Email Address
                </label>
                <input
                  type="email"
                  id="auth-email"
                  name="email"
                  className="glass-input"
                  value={email}
                  onChange={handleEmailChange}
                  onFocus={() => console.log('📧 Email focused')}
                  onTouchStart={() => console.log('📧 Email touch start')}
                  placeholder="you@example.com"
                  autoComplete="email"
                  autoCapitalize="none"
                  autoCorrect="off"
                  spellCheck="false"
                  style={{ 
                    width: '100%', 
                    padding: '14px 16px', 
                    fontSize: '16px',
                    WebkitAppearance: 'none',
                    appearance: 'none'
                  }}
                />
              </div>
              
              <div style={{ marginBottom: '28px' }}>
                <label style={{ display: 'block', color: 'rgba(255,255,255,0.7)', fontSize: '13px', fontWeight: '600', marginBottom: '8px' }}>
                  <i className="fas fa-lock" style={{ marginRight: '8px', color: 'var(--purple-main)' }}></i>
                  Password
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="auth-password"
                    name="password"
                    className="glass-input"
                    value={password}
                    onChange={handlePasswordChange}
                    onFocus={() => console.log('🔑 Password focused')}
                    onTouchStart={() => console.log('🔑 Password touch start')}
                    placeholder="••••••••"
                    autoComplete="current-password"
                    style={{ 
                      width: '100%', 
                      padding: '14px 16px', 
                      fontSize: '16px',
                      paddingRight: '50px',
                      WebkitAppearance: 'none',
                      appearance: 'none'
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute',
                      right: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      color: 'rgba(255,255,255,0.5)',
                      cursor: 'pointer',
                      padding: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <i className={showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'}></i>
                  </button>
                </div>
              </div>
              
              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={authLoading}
                onClick={(e) => { 
                  console.log('🖱️ BUTTON CLICKED!');
                  // If form submit doesn't work, try direct call
                  if (email && password && (isLogin || name)) {
                    handleSubmit(e);
                  }
                }}
                onTouchEnd={(e) => {
                  console.log('👆 BUTTON TOUCH END!');
                }}
                style={{ 
                  width: '100%', 
                  padding: '18px', 
                  fontSize: '16px',
                  fontWeight: '700',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minHeight: '56px',
                  WebkitTapHighlightColor: 'transparent',
                  gap: '10px',
                  position: 'relative',
                  zIndex: 100
                }}
              >
                {authLoading ? (
                  <>
                    <i className="fas fa-spinner fa-spin"></i>
                    {isLogin ? 'Signing in...' : 'Creating account...'}
                  </>
                ) : (
                  <>
                    <i className={isLogin ? 'fas fa-sign-in-alt' : 'fas fa-user-plus'}></i>
                    {isLogin ? 'Sign In' : 'Create Account'}
                  </>
                )}
              </button>
            </form>
            
            <div style={{ marginTop: '28px', textAlign: 'center' }}>
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px' }}>
                {isLogin ? "Don't have an account?" : "Already have an account?"}
                <button
                  onClick={() => { setIsLogin(!isLogin); setError(''); if(clearAuthError) clearAuthError(); }}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--purple-light)',
                    fontWeight: '600',
                    cursor: 'pointer',
                    marginLeft: '6px'
                  }}
                >
                  {isLogin ? 'Sign Up' : 'Sign In'}
                </button>
              </p>
            </div>
            
            <div style={{ marginTop: '32px', paddingTop: '24px', borderTop: '1px solid rgba(255,255,255,0.08)', textAlign: 'center' }}>
              <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '11px' }}>
                <i className="fas fa-shield-alt" style={{ marginRight: '6px' }}></i>
                Your data is securely stored and never shared
              </p>
            </div>
          </div>
        </div>
      );
    };
    
    const App = () => {
      const [view, setViewInternal] = useState(VIEW.AUTH);
      
      // Wrapper to log view changes
      const setView = (newView) => {
        const viewNames = { 0: 'AUTH', 1: 'UPLOAD', 2: 'BUILDER', 3: 'PREVIEW', 4: 'TAILOR' };
        console.log('📍 View changing from', viewNames[view], 'to', viewNames[newView]);
        setViewInternal(newView);
      };
      const [user, setUser] = useState(null);
      const [authLoading, setAuthLoading] = useState(true);
      const [authError, setAuthError] = useState('');
      const [profile, setProfile] = useState(null);
      const [loading, setLoading] = useState(false);
      const [progress, setProgress] = useState(0);
      const [activeTab, setTab] = useState('basics');
      const [rawText, setRawText] = useState('');
      const [selectedTemplate, setTemplate] = useState('executive');
      const [profilePhoto, setProfilePhoto] = useState(null);
      const [lastSaved, setLastSaved] = useState(null);
      const [saveStatus, setSaveStatus] = useState(''); // 'saving', 'saved', 'error'
      const [slug, setSlug] = useState('');
      const [isPublic, setIsPublic] = useState(false);
      const [profileViews, setProfileViews] = useState(0);
      const [steps, setSteps] = useState([
        { text: 'Reading file', state: 'pending' },
        { text: 'Extracting text', state: 'pending' },
        { text: 'AI deep analysis', state: 'pending' },
        { text: 'Extracting experiences', state: 'pending' },
        { text: 'Generating descriptions', state: 'pending' },
        { text: 'Building rich profile', state: 'pending' }
      ]);
      
      // Check auth status on mount
      React.useEffect(() => {
        checkAuth();
      }, []);
      
      const checkAuth = async () => {
        try {
          const res = await fetch('/api/auth/me', { credentials: 'include' });
          const data = await res.json();
          if (data.user) {
            setUser(data.user);
            // Load profile from server - loadProfile handles setting the view
            await loadProfile();
          } else {
            setView(VIEW.AUTH);
          }
        } catch (e) {
          console.error('Auth check failed:', e);
          setView(VIEW.AUTH);
        }
        setAuthLoading(false);
      };
      
      const loadProfile = async () => {
        try {
          const res = await fetch('/api/profile/load', { credentials: 'include' });
          const data = await res.json();
          
          if (data.profile) {
            setProfile(data.profile);
            if (data.profilePhoto) setProfilePhoto(data.profilePhoto);
            if (data.selectedTemplate) setTemplate(data.selectedTemplate);
            if (data.rawText) setRawText(data.rawText);
            if (data.slug) setSlug(data.slug);
            if (data.isPublic !== undefined) setIsPublic(data.isPublic);
            if (data.profileViews) setProfileViews(data.profileViews);
            setView(VIEW.BUILDER);
            console.log('✅ Loaded profile from server');
          } else {
            // No profile exists, go to upload
            setView(VIEW.UPLOAD);
            console.log('📤 No profile found, redirecting to upload');
          }
        } catch (e) {
          console.error('Error loading profile:', e);
          // On error, go to upload as fallback
          setView(VIEW.UPLOAD);
        }
      };
      
      const handleAuth = async (isLogin, email, password, name) => {
        setAuthLoading(true);
        setAuthError('');
        console.log('🔐 Auth attempt:', isLogin ? 'login' : 'register', email);
        
        try {
          const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
          const body = isLogin ? { email, password } : { email, password, name };
          
          const res = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
            credentials: 'include' // Ensure cookies are sent
          });
          
          console.log('📡 Auth response status:', res.status);
          const data = await res.json();
          console.log('📦 Auth response data:', data);
          
          if (data.error) {
            setAuthError(data.error);
            setAuthLoading(false);
            return;
          }
          
          if (!data.user) {
            setAuthError('Invalid response from server');
            setAuthLoading(false);
            return;
          }
          
          console.log('✅ Auth successful, user:', data.user.email);
          setUser(data.user);
          
          if (data.user.hasProfile) {
            console.log('📂 Loading existing profile...');
            await loadProfile();
          } else {
            console.log('🆕 New user, going to upload');
            setView(VIEW.UPLOAD);
          }
        } catch (e) {
          setAuthError('Connection error. Please try again.');
        }
        setAuthLoading(false);
      };
      
      const handleLogout = async () => {
        if (confirm('Are you sure you want to sign out?')) {
          await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
          setUser(null);
          setProfile(null);
          setProfilePhoto(null);
          setRawText('');
          setTemplate('executive');
          setView(VIEW.AUTH);
        }
      };
      
      // Auto-save profile to SERVER when it changes
      React.useEffect(() => {
        if (profile && user) {
          setSaveStatus('saving');
          
          const saveTimeout = setTimeout(async () => {
            try {
              const res = await fetch('/api/profile/save', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                  profile,
                  profilePhoto,
                  selectedTemplate,
                  rawText
                })
              });
              
              const data = await res.json();
              if (data.success) {
                setLastSaved(new Date(data.savedAt));
                setSaveStatus('saved');
                console.log('✅ Auto-saved to server at', data.savedAt);
              } else {
                throw new Error(data.error);
              }
              setTimeout(() => setSaveStatus(''), 3000);
            } catch (e) {
              console.error('Error saving profile:', e);
              setSaveStatus('error');
              setTimeout(() => setSaveStatus(''), 5000);
            }
          }, 1000);
          return () => clearTimeout(saveTimeout);
        }
      }, [profile, profilePhoto, selectedTemplate]);
      
      // Manual save function
      const saveProgress = async () => {
        if (!profile) {
          alert('No profile to save yet. Upload a resume first.');
          return;
        }
        if (!user) {
          alert('Please sign in to save your profile.');
          return;
        }
        try {
          setSaveStatus('saving');
          const res = await fetch('/api/profile/save', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({
              profile,
              profilePhoto,
              selectedTemplate,
              rawText
            })
          });
          const data = await res.json();
          if (data.success) {
            setLastSaved(new Date(data.savedAt));
            setSaveStatus('saved');
            alert('✅ Profile saved to your account! You can access it from any device.');
          } else {
            throw new Error(data.error);
          }
        } catch (e) {
          setSaveStatus('error');
          alert('❌ Error saving profile: ' + e.message);
        }
      };
      
      // Clear saved data (server + local)
      const clearSavedData = async () => {
        if (confirm('Are you sure you want to clear ALL profile data? This cannot be undone.')) {
          try {
            await fetch('/api/profile/save', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              credentials: 'include',
              body: JSON.stringify({
                profile: null,
                profilePhoto: null,
                selectedTemplate: 'executive',
                rawText: ''
              })
            });
          } catch (e) {}
          setProfile(null);
          setProfilePhoto(null);
          setRawText('');
          setTemplate('executive');
          setLastSaved(null);
          setView(VIEW.UPLOAD);
          alert('All profile data has been cleared.');
        }
      };
      
      // Format last saved time
      const formatLastSaved = (date) => {
        if (!date) return null;
        const now = new Date();
        const diff = Math.floor((now - date) / 1000);
        if (diff < 60) return 'Just now';
        if (diff < 3600) return Math.floor(diff / 60) + ' min ago';
        if (diff < 86400) return Math.floor(diff / 3600) + ' hours ago';
        return date.toLocaleDateString();
      };
      
      const processFile = async (file) => {
        setLoading(true);
        setProgress(0);
        const st = [...steps];
        
        try {
          // Step 1: Reading file
          st[0].state = 'active';
          setSteps([...st]);
          await new Promise(r => setTimeout(r, 300));
          
          // Step 2: Extracting text
          st[0].state = 'done';
          st[1].state = 'active';
          setSteps([...st]);
          setProgress(15);
          
          const ext = file.name.split('.').pop().toLowerCase();
          let text = '';
          
          if (ext === 'pdf') text = await FileParser.pdf(file);
          else if (ext === 'docx' || ext === 'doc') text = await FileParser.docx(file);
          else text = await FileParser.txt(file);
          
          setRawText(text);
          
          // Step 3: AI analyzing
          st[1].state = 'done';
          st[2].state = 'active';
          setSteps([...st]);
          setProgress(30);
          
          let aiResult = null;
          try {
            const res = await fetch('/api/parse-resume', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ text })
            });
            if (res.ok) aiResult = await res.json();
          } catch (e) {
            console.error('AI parsing error:', e);
          }
          
          // Step 4: Finding experiences
          st[2].state = 'done';
          st[3].state = 'active';
          setSteps([...st]);
          setProgress(55);
          await new Promise(r => setTimeout(r, 300));
          
          // Step 5: Generating insights
          st[3].state = 'done';
          st[4].state = 'active';
          setSteps([...st]);
          setProgress(75);
          await new Promise(r => setTimeout(r, 300));
          
          // Step 6: Building profile
          st[4].state = 'done';
          st[5].state = 'active';
          setSteps([...st]);
          setProgress(92);
          
          const finalProfile = buildProfile(aiResult, text);
          
          st[5].state = 'done';
          setSteps([...st]);
          setProgress(100);
          await new Promise(r => setTimeout(r, 400));
          
          setProfile(finalProfile);
          setLoading(false);
          setView(VIEW.BUILDER);
        } catch (err) {
          alert('Error processing file: ' + err.message);
          setLoading(false);
        }
      };
      
      // Helper to get company logo URL from Clearbit
      const getCompanyLogoUrl = (domain) => {
        if (!domain) return null;
        // Clean domain
        const cleanDomain = domain.replace(/^(https?:\\/\\/)?(www\\.)?/, '').split('/')[0];
        return \`https://logo.clearbit.com/\${cleanDomain}\`;
      };
      
      const buildProfile = (aiData, text) => {
        if (aiData && !aiData.error && aiData.basics) {
          return {
            basics: { 
              ...aiData.basics,
              summary: aiData.basics.summary || ''
            },
            experience: (aiData.experience || []).map((e, i) => {
              // Auto-generate logo URL from company domain
              const companyInfo = e.companyInfo || {};
              const domain = companyInfo.domain || '';
              const logoUrl = getCompanyLogoUrl(domain);
              
              return {
                id: Date.now() + i,
                ...e,
                companyInfo: {
                  website: companyInfo.website || '',
                  domain: domain,
                  industry: companyInfo.industry || '',
                  location: companyInfo.location || '',
                  size: companyInfo.size || '',
                  description: companyInfo.description || ''
                },
                logoUrl: logoUrl,
                customLogo: null, // For manual upload
                responsibilities: e.responsibilities || [],
                // Rich content for Employer Detail Page
                projects: e.projects || [],
                victories: e.victories || [],
                challenges: e.challenges || [],
                reviews: e.reviews || [],
                media: e.media || { photos: [], videos: [] },
                dayInLife: e.dayInLife || [
                  { time: '9:00 AM', activity: '' },
                  { time: '10:30 AM', activity: '' },
                  { time: '12:00 PM', activity: '' },
                  { time: '2:00 PM', activity: '' },
                  { time: '4:00 PM', activity: '' },
                  { time: '5:30 PM', activity: '' }
                ],
                metrics: e.metrics || [
                  { value: '', label: '' },
                  { value: '', label: '' },
                  { value: '', label: '' },
                  { value: '', label: '' }
                ]
              };
            }),
            skills: aiData.skills || [],
            achievements: (aiData.achievements || []).map((a, i) => ({
              id: Date.now() + i + 1000,
              ...a
            })),
            education: (aiData.education || []).map((e, i) => ({
              id: Date.now() + i + 2000,
              ...e
            })),
            certifications: aiData.certifications || [],
            awards: [],
            reviews: [],
            payHistory: [],
            projects: [],
            photos: [],
            videos: []
          };
        }
        
        // Fallback extraction
        const email = text.match(/[\\w.-]+@[\\w.-]+\\.\\w+/)?.[0] || '';
        const phone = text.match(/[\\+]?[(]?[0-9]{3}[)]?[-\\s.]?[0-9]{3}[-\\s.]?[0-9]{4}/)?.[0] || '';
        const name = text.split('\\n').filter(l => l.trim())[0]?.trim() || '';
        
        return {
          basics: {
            name, title: '', tagline: '', email, phone,
            location: '', linkedin: '', website: '', summary: ''
          },
          experience: [],
          skills: [],
          achievements: [],
          education: [],
          certifications: [],
          awards: [],
          reviews: [],
          payHistory: [],
          projects: [],
          photos: [],
          videos: []
        };
      };
      
      const navItems = [
        { id: 'basics', icon: 'fa-user', label: 'Basic Info' },
        { id: 'experience', icon: 'fa-briefcase', label: 'Experience' },
        { id: 'skills', icon: 'fa-code', label: 'Skills' },
        { id: 'achievements', icon: 'fa-trophy', label: 'Achievements' },
        { id: 'education', icon: 'fa-graduation-cap', label: 'Education' },
        { id: 'awards', icon: 'fa-award', label: 'Awards' },
        { id: 'reviews', icon: 'fa-star', label: 'Reviews' },
        { id: 'pay', icon: 'fa-dollar-sign', label: 'Pay History' },
        { id: 'projects', icon: 'fa-folder', label: 'Projects' },
        { id: 'media', icon: 'fa-image', label: 'Media' },
        { id: 'templates', icon: 'fa-palette', label: 'Templates' }
      ];
      
      // Show loading state while checking auth
      if (authLoading && view === VIEW.AUTH) {
        return (
          <div style={{ 
            minHeight: '100vh', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            flexDirection: 'column',
            gap: '20px',
            position: 'relative',
            zIndex: 100
          }}>
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '24px',
              background: 'linear-gradient(135deg, var(--purple-main), var(--pink-main))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 12px 40px rgba(139,92,246,0.4)'
            }}>
              <i className="fas fa-spinner fa-spin" style={{ fontSize: '32px', color: '#fff' }}></i>
            </div>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '14px' }}>Loading...</p>
          </div>
        );
      }
      
      // Show Auth view if not logged in
      if (view === VIEW.AUTH) {
        return <AuthView onLogin={handleAuth} authLoading={authLoading} authError={authError} clearAuthError={() => setAuthError('')} />;
      }
      
      return (
        <div className="app-container">
          {/* FLOATING AUTO-SAVE INDICATOR - Always visible */}
          {saveStatus && (
            <div style={{
              position: 'fixed',
              top: '20px',
              right: '20px',
              zIndex: 9999,
              padding: '12px 20px',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              fontSize: '13px',
              fontWeight: '600',
              boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
              animation: 'slideIn 0.3s ease',
              background: saveStatus === 'saving' 
                ? 'linear-gradient(135deg, rgba(6,182,212,0.9), rgba(139,92,246,0.9))' 
                : saveStatus === 'saved'
                ? 'linear-gradient(135deg, rgba(16,185,129,0.9), rgba(6,182,212,0.9))'
                : 'linear-gradient(135deg, rgba(239,68,68,0.9), rgba(236,72,153,0.9))',
              color: '#fff',
              backdropFilter: 'blur(10px)'
            }}>
              {saveStatus === 'saving' && (
                <>
                  <i className="fas fa-circle-notch fa-spin"></i>
                  Auto-saving...
                </>
              )}
              {saveStatus === 'saved' && (
                <>
                  <i className="fas fa-check-circle"></i>
                  All changes saved!
                </>
              )}
              {saveStatus === 'error' && (
                <>
                  <i className="fas fa-exclamation-triangle"></i>
                  Save failed - click Save Now
                </>
              )}
            </div>
          )}
          
          {/* Sidebar */}
          <aside className="sidebar glass-sidebar">
            <div className="logo">
              <img src="/static/logo.png" alt="Webumé" className="logo-img" />
            </div>
            
            {/* User Info */}
            {user && (
              <div style={{
                padding: '16px',
                margin: '0 16px 16px',
                background: 'rgba(139,92,246,0.1)',
                borderRadius: '12px',
                border: '1px solid rgba(139,92,246,0.2)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '10px',
                    background: 'linear-gradient(135deg, var(--purple-main), var(--pink-main))',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    fontWeight: '700',
                    fontSize: '14px'
                  }}>
                    {user.name?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ color: '#fff', fontWeight: '600', fontSize: '13px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {user.name}
                    </div>
                    <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '11px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {user.email}
                    </div>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  style={{
                    width: '100%',
                    padding: '8px',
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px',
                    color: 'rgba(255,255,255,0.6)',
                    fontSize: '11px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    transition: 'all 0.2s'
                  }}
                >
                  <i className="fas fa-sign-out-alt"></i>
                  Sign Out
                </button>
              </div>
            )}
            
            <div className="nav-group">
              <div className="nav-label">Profile Sections</div>
              {navItems.map(item => (
                <button
                  key={item.id}
                  className={'nav-btn' + (activeTab === item.id && view === VIEW.BUILDER ? ' active' : '')}
                  onClick={() => {
                    setTab(item.id);
                    if (view !== VIEW.BUILDER && profile) setView(VIEW.BUILDER);
                  }}
                >
                  <i className={'fas ' + item.icon}></i>
                  {item.label}
                </button>
              ))}
            </div>
            
            <div className="nav-group">
              <div className="nav-label">Actions</div>
              <button className="nav-btn" onClick={() => profile && setView(VIEW.PREVIEW)}>
                <i className="fas fa-eye"></i>
                Live Preview
              </button>
              <button 
                className="nav-btn" 
                onClick={() => profile && setView(VIEW.TAILOR)}
                style={{ 
                  background: 'linear-gradient(135deg, rgba(236,72,153,0.2), rgba(139,92,246,0.2))',
                  borderColor: 'rgba(236,72,153,0.4)'
                }}
              >
                <i className="fas fa-magic" style={{ color: '#EC4899' }}></i>
                <span style={{ color: '#EC4899' }}>AI Tailor</span>
                <span style={{ 
                  fontSize: '9px', 
                  background: 'linear-gradient(135deg, #EC4899, #8B5CF6)',
                  padding: '2px 6px',
                  borderRadius: '10px',
                  marginLeft: '4px'
                }}>PRO</span>
              </button>
              <button className="nav-btn" onClick={() => setView(VIEW.UPLOAD)}>
                <i className="fas fa-upload"></i>
                Upload New
              </button>
            </div>
            
            {/* Save/Load Section */}
            <div className="nav-group">
              <div className="nav-label">Save Progress</div>
              <button 
                className="nav-btn" 
                onClick={saveProgress}
                style={{ background: 'rgba(16,185,129,0.15)', borderColor: 'rgba(16,185,129,0.3)' }}
              >
                <i className="fas fa-save" style={{ color: 'var(--green-main)' }}></i>
                <span style={{ color: 'var(--green-main)' }}>Save Now</span>
              </button>
              <button 
                className="nav-btn" 
                onClick={clearSavedData}
                style={{ opacity: 0.7 }}
              >
                <i className="fas fa-trash-alt"></i>
                Clear Saved Data
              </button>
              
              {/* Save Status */}
              {(lastSaved || saveStatus) && (
                <div style={{ 
                  padding: '10px 16px', 
                  fontSize: '11px',
                  color: saveStatus === 'error' ? '#EF4444' : 'rgba(255,255,255,0.4)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  {saveStatus === 'saving' && (
                    <>
                      <i className="fas fa-spinner fa-spin" style={{ color: 'var(--cyan-main)' }}></i>
                      Saving...
                    </>
                  )}
                  {saveStatus === 'saved' && (
                    <>
                      <i className="fas fa-check-circle" style={{ color: 'var(--green-main)' }}></i>
                      Saved!
                    </>
                  )}
                  {saveStatus === 'error' && (
                    <>
                      <i className="fas fa-exclamation-circle"></i>
                      Save failed
                    </>
                  )}
                  {!saveStatus && lastSaved && (
                    <>
                      <i className="fas fa-clock"></i>
                      Last saved: {formatLastSaved(lastSaved)}
                    </>
                  )}
                </div>
              )}
            </div>
            
            <div className="sidebar-footer">
              <div className="stat-row">
                <span className="stat-name">Experiences</span>
                <span className="stat-num">{profile?.experience?.length || 0}</span>
              </div>
              <div className="stat-row">
                <span className="stat-name">Skills</span>
                <span className="stat-num">{profile?.skills?.length || 0}</span>
              </div>
              <div className="stat-row">
                <span className="stat-name">Completeness</span>
                <span className="stat-num">{profile ? Math.min(100, Math.round((
                  (profile.basics?.name ? 10 : 0) +
                  (profile.basics?.title ? 10 : 0) +
                  (profile.basics?.tagline ? 10 : 0) +
                  (profile.basics?.email ? 5 : 0) +
                  (profile.experience?.length > 0 ? 25 : 0) +
                  (profile.skills?.length > 0 ? 20 : 0) +
                  (profile.achievements?.length > 0 ? 10 : 0) +
                  (profile.education?.length > 0 ? 10 : 0)
                ))) : 0}%</span>
              </div>
            </div>
          </aside>
          
          {/* Main Content */}
          <main className="main">
            {view === VIEW.UPLOAD && (
              <UploadView
                onUpload={processFile}
                loading={loading}
                progress={progress}
                steps={steps}
                hasSavedData={!!profile}
                savedName={profile?.basics?.name}
                onContinue={() => setView(VIEW.BUILDER)}
              />
            )}
            {view === VIEW.BUILDER && (
              profile ? (
                <BuilderView
                  profile={profile}
                  setProfile={setProfile}
                  activeTab={activeTab}
                  rawText={rawText}
                  profilePhoto={profilePhoto}
                  setProfilePhoto={setProfilePhoto}
                  selectedTemplate={selectedTemplate}
                  setTemplate={setTemplate}
                  onBack={() => setView(VIEW.UPLOAD)}
                  onPreview={() => setView(VIEW.PREVIEW)}
                  onSave={saveProgress}
                  saveStatus={saveStatus}
                />
              ) : (
                <div style={{ padding: '60px', textAlign: 'center' }}>
                  <div style={{ fontSize: '80px', marginBottom: '24px' }}>🚀</div>
                  <h2 style={{ fontSize: '28px', fontWeight: '700', color: '#fff', marginBottom: '12px' }}>Let's Get Started!</h2>
                  <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '28px', maxWidth: '400px', margin: '0 auto 28px' }}>
                    Upload your resume to auto-fill your profile, or create one from scratch.
                  </p>
                  <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
                    <button 
                      className="btn btn-primary" 
                      onClick={() => setView(VIEW.UPLOAD)}
                      style={{ padding: '14px 28px', background: 'linear-gradient(135deg, #8B5CF6, #EC4899)' }}
                    >
                      <i className="fas fa-upload" style={{ marginRight: '10px' }}></i>
                      Upload Resume
                    </button>
                    <button 
                      className="btn btn-secondary" 
                      onClick={() => {
                        // Create empty profile to start from scratch
                        setProfile({
                          basics: { name: user?.name || '', title: '', tagline: '', email: user?.email || '', phone: '', location: '', linkedin: '', website: '', summary: '' },
                          experience: [],
                          skills: [],
                          achievements: [],
                          education: [],
                          certifications: [],
                          awards: [],
                          reviews: [],
                          payHistory: [],
                          projects: [],
                          photos: [],
                          videos: []
                        });
                      }}
                      style={{ padding: '14px 28px' }}
                    >
                      <i className="fas fa-pencil-alt" style={{ marginRight: '10px' }}></i>
                      Start From Scratch
                    </button>
                  </div>
                </div>
              )
            )}
            {view === VIEW.PREVIEW && (
              profile ? (
                <PreviewView
                  profile={profile}
                  setProfile={setProfile}
                  setView={setView}
                  profilePhoto={profilePhoto}
                  selectedTemplate={selectedTemplate}
                  slug={slug}
                  isPublic={isPublic}
                  setIsPublic={setIsPublic}
                  profileViews={profileViews}
                />
              ) : (
                <div style={{ padding: '60px', textAlign: 'center' }}>
                  <div style={{ fontSize: '80px', marginBottom: '24px' }}>📋</div>
                  <h2 style={{ fontSize: '28px', fontWeight: '700', color: '#fff', marginBottom: '12px' }}>No Profile Data</h2>
                  <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '28px', maxWidth: '400px', margin: '0 auto 28px' }}>
                    You need to create or upload a profile before you can preview it.
                  </p>
                  <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
                    <button 
                      className="btn btn-secondary" 
                      onClick={() => setView(VIEW.UPLOAD)}
                      style={{ padding: '14px 28px' }}
                    >
                      <i className="fas fa-upload" style={{ marginRight: '10px' }}></i>
                      Upload Resume
                    </button>
                    <button 
                      className="btn btn-primary" 
                      onClick={() => setView(VIEW.BUILDER)}
                      style={{ padding: '14px 28px', background: 'linear-gradient(135deg, #8B5CF6, #EC4899)' }}
                    >
                      <i className="fas fa-plus" style={{ marginRight: '10px' }}></i>
                      Create Profile
                    </button>
                  </div>
                </div>
              )
            )}
            {view === VIEW.TAILOR && profile && (
              <TailorView
                profile={profile}
                user={user}
                setView={setView}
              />
            )}
          </main>
          
          {/* AI Chat Assistant - Available on all views except AUTH */}
          {view !== VIEW.AUTH && (
            <ChatWidget
              user={user}
              profile={profile}
              setProfile={setProfile}
              view={view}
            />
          )}
        </div>
      );
    };
    
    // Upload View Component
    const UploadView = ({ onUpload, loading, progress, steps, hasSavedData, savedName, onContinue }) => {
      const [isDragging, setDragging] = useState(false);
      const fileInputRef = useRef(null);
      
      const handleDrop = (e) => {
        e.preventDefault();
        setDragging(false);
        if (e.dataTransfer.files[0]) {
          onUpload(e.dataTransfer.files[0]);
        }
      };
      
      if (loading) {
        return (
          <div className="glass-card upload-zone">
            <div className="processing-state">
              <div className="ai-visual">
                <div className="ai-core"></div>
                <div className="ai-ring"></div>
                <div className="ai-ring"></div>
                <div className="ai-ring"></div>
              </div>
              
              <div className="ai-badge">
                <div className="ai-badge-dot"></div>
                GEMINI AI
              </div>
              
              <h2 className="processing-title">Analyzing Your Resume</h2>
              <p className="processing-subtitle">Extracting career details and generating insights</p>
              
              <div className="progress-percent">{Math.round(progress)}%</div>
              <div className="progress-track">
                <div className="progress-bar" style={{ width: progress + '%' }}></div>
              </div>
              
              <div className="step-list">
                {steps.map((step, i) => (
                  <div
                    key={i}
                    className={'step-item' + (step.state === 'active' ? ' active' : step.state === 'done' ? ' done' : '')}
                  >
                    <i className={'fas ' + (step.state === 'done' ? 'fa-check' : step.state === 'active' ? 'fa-spinner fa-spin' : 'fa-circle')}></i>
                    {step.text}
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      }
      
      return (
        <div>
          <div className="page-header">
            <div>
              <h1 className="page-title">Upload Resume</h1>
              <p className="page-desc">Drop your resume to begin the AI-powered analysis</p>
            </div>
          </div>
          
          {/* Welcome Back Card - Show if there's saved data */}
          {hasSavedData && (
            <div className="glass-card" style={{ 
              padding: '24px 28px', 
              marginBottom: '24px',
              background: 'linear-gradient(135deg, rgba(16,185,129,0.1), rgba(6,182,212,0.05))',
              border: '1px solid rgba(16,185,129,0.25)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{
                    width: '52px',
                    height: '52px',
                    borderRadius: '14px',
                    background: 'rgba(16,185,129,0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <i className="fas fa-user-check" style={{ fontSize: '22px', color: 'var(--green-main)' }}></i>
                  </div>
                  <div>
                    <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#fff', marginBottom: '4px' }}>
                      Welcome back{savedName ? ', ' + savedName.split(' ')[0] : ''}!
                    </h3>
                    <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)' }}>
                      You have a saved profile. Continue where you left off or start fresh.
                    </p>
                  </div>
                </div>
                <button 
                  className="btn btn-primary"
                  onClick={onContinue}
                  style={{ background: 'linear-gradient(135deg, var(--green-main), var(--cyan-main))' }}
                >
                  <i className="fas fa-arrow-right"></i>
                  Continue Editing
                </button>
              </div>
            </div>
          )}
          
          <div className="glass-card upload-zone">
            <div
              className={'dropzone' + (isDragging ? ' drag-active' : '')}
              onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={(e) => e.target.files[0] && onUpload(e.target.files[0])}
                accept=".pdf,.docx,.doc,.txt"
                style={{ display: 'none' }}
              />
              
              <img src="/static/logo.png" alt="Webumé" className="upload-logo" />
              
              <div className="upload-icon-wrap">
                <i className="fas fa-cloud-upload-alt"></i>
              </div>
              
              <h2 className="upload-title">Drop Your Resume Here</h2>
              <p className="upload-subtitle">Powered by Gemini AI • Instant Career Analysis</p>
              
              <div className="format-pills">
                <span className="format-pill"><i className="fas fa-file-pdf"></i> PDF</span>
                <span className="format-pill"><i className="fas fa-file-word"></i> DOCX</span>
                <span className="format-pill"><i className="fas fa-file-alt"></i> TXT</span>
              </div>
            </div>
          </div>
        </div>
      );
    };
    
    // Builder View Component
    const BuilderView = ({ profile, setProfile, activeTab, rawText, profilePhoto, setProfilePhoto, selectedTemplate, setTemplate, onBack, onPreview, onSave, saveStatus }) => {
      const updateField = (key, value) => setProfile(p => ({ ...p, [key]: value }));
      const updateBasics = (key, value) => setProfile(p => ({ ...p, basics: { ...p.basics, [key]: value } }));
      
      return (
        <div>
          {/* Workflow Progress Indicator */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '0',
            marginBottom: '24px',
            padding: '16px 20px',
            background: 'rgba(0,0,0,0.2)',
            borderRadius: '16px',
            border: '1px solid rgba(255,255,255,0.08)'
          }}>
            {[
              { num: 1, label: 'Upload', icon: 'fa-upload', done: true },
              { num: 2, label: 'Edit Profile', icon: 'fa-edit', active: true },
              { num: 3, label: 'Preview & Publish', icon: 'fa-eye', done: false }
            ].map((step, i) => (
              <React.Fragment key={step.num}>
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '6px',
                  cursor: step.done ? 'pointer' : 'default',
                  opacity: step.active ? 1 : step.done ? 0.8 : 0.4
                }}
                onClick={() => {
                  if (step.num === 1) onBack();
                  if (step.num === 3 && profile) onPreview();
                }}>
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    background: step.active ? 'linear-gradient(135deg, #8B5CF6, #EC4899)' : step.done ? 'rgba(16,185,129,0.2)' : 'rgba(255,255,255,0.1)',
                    border: step.active ? 'none' : step.done ? '2px solid #10B981' : '2px solid rgba(255,255,255,0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: step.active ? 'white' : step.done ? '#10B981' : 'rgba(255,255,255,0.5)',
                    fontSize: '14px'
                  }}>
                    {step.done && !step.active ? <i className="fas fa-check"></i> : <i className={'fas ' + step.icon}></i>}
                  </div>
                  <span style={{
                    fontSize: '11px',
                    fontWeight: step.active ? '600' : '500',
                    color: step.active ? 'white' : 'rgba(255,255,255,0.5)'
                  }}>{step.label}</span>
                </div>
                {i < 2 && (
                  <div style={{
                    width: '60px',
                    height: '2px',
                    background: step.done ? 'linear-gradient(90deg, #10B981, rgba(255,255,255,0.2))' : 'rgba(255,255,255,0.1)',
                    margin: '0 8px',
                    marginBottom: '20px'
                  }}></div>
                )}
              </React.Fragment>
            ))}
          </div>
          
          <div className="page-header">
            <div>
              <h1 className="page-title">{activeTab === 'templates' ? 'Templates' : activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h1>
              <p className="page-desc">{activeTab === 'templates' ? 'Choose your profile style' : 'Edit and customize your profile information'}</p>
            </div>
          </div>
          
          {/* Stats Grid */}
          <div className="stats-grid">
            <div className="glass stat-card">
              <div className="stat-icon-wrap"><i className="fas fa-briefcase"></i></div>
              <div className="value">{profile.experience.length}</div>
              <div className="label">Experiences</div>
            </div>
            <div className="glass stat-card cyan">
              <div className="stat-icon-wrap"><i className="fas fa-code"></i></div>
              <div className="value">{profile.skills.length}</div>
              <div className="label">Skills</div>
            </div>
            <div className="glass stat-card green">
              <div className="stat-icon-wrap"><i className="fas fa-trophy"></i></div>
              <div className="value">{profile.achievements.length}</div>
              <div className="label">Achievements</div>
            </div>
          </div>
          
          {/* Content Card */}
          <div className="glass-card" style={{ padding: '28px' }}>
            {activeTab === 'basics' && (
              <BasicsEditor 
                profile={profile} 
                updateBasics={updateBasics} 
                rawText={rawText}
                profilePhoto={profilePhoto}
                setProfilePhoto={setProfilePhoto}
              />
            )}
            {activeTab === 'experience' && (
              <ExperienceEditor
                experiences={profile.experience}
                setExperiences={(e) => updateField('experience', e)}
              />
            )}
            {activeTab === 'skills' && (
              <SkillsEditor
                skills={profile.skills}
                setSkills={(s) => updateField('skills', s)}
              />
            )}
            {activeTab === 'achievements' && (
              <ListEditor
                title="Achievements"
                items={profile.achievements}
                setItems={(i) => updateField('achievements', i)}
                fields={[
                  { key: 'title', label: 'Title', placeholder: 'Achievement title' },
                  { key: 'description', label: 'Description', placeholder: 'Details', textarea: true }
                ]}
              />
            )}
            {activeTab === 'education' && (
              <ListEditor
                title="Education"
                items={profile.education || []}
                setItems={(i) => updateField('education', i)}
                fields={[
                  { key: 'degree', label: 'Degree', placeholder: 'Bachelor of Science in Computer Science' },
                  { key: 'school', label: 'School', placeholder: 'Stanford University' },
                  { key: 'year', label: 'Year', placeholder: '2020' },
                  { key: 'details', label: 'Details', placeholder: 'GPA, honors, relevant coursework' }
                ]}
              />
            )}
            {activeTab === 'awards' && (
              <ListEditor
                title="Awards"
                items={profile.awards}
                setItems={(i) => updateField('awards', i)}
                fields={[
                  { key: 'title', label: 'Award Name', placeholder: 'Award title' },
                  { key: 'org', label: 'Organization', placeholder: 'Issuing organization' },
                  { key: 'year', label: 'Year', placeholder: '2024' }
                ]}
              />
            )}
            {activeTab === 'reviews' && (
              <ListEditor
                title="Reviews"
                items={profile.reviews}
                setItems={(i) => updateField('reviews', i)}
                fields={[
                  { key: 'quote', label: 'Quote', placeholder: 'What they said', textarea: true },
                  { key: 'author', label: 'Author', placeholder: 'Name' },
                  { key: 'role', label: 'Role', placeholder: 'Title' }
                ]}
              />
            )}
            {activeTab === 'pay' && (
              <ListEditor
                title="Pay History"
                items={profile.payHistory}
                setItems={(i) => updateField('payHistory', i)}
                fields={[
                  { key: 'year', label: 'Year', placeholder: '2024' },
                  { key: 'base', label: 'Base Salary', placeholder: '$150,000' },
                  { key: 'bonus', label: 'Bonus', placeholder: '$30,000' },
                  { key: 'equity', label: 'Equity', placeholder: '$50,000' }
                ]}
              />
            )}
            {activeTab === 'projects' && (
              <ListEditor
                title="Projects"
                items={profile.projects}
                setItems={(i) => updateField('projects', i)}
                fields={[
                  { key: 'name', label: 'Project Name', placeholder: 'Project title' },
                  { key: 'description', label: 'Description', placeholder: 'What you built', textarea: true },
                  { key: 'url', label: 'URL', placeholder: 'https://...' },
                  { key: 'tech', label: 'Technologies', placeholder: 'React, Node, AWS' }
                ]}
              />
            )}
            {activeTab === 'media' && (
              <MediaEditor
                photos={profile.photos}
                videos={profile.videos}
                setPhotos={(p) => updateField('photos', p)}
                setVideos={(v) => updateField('videos', v)}
              />
            )}
            {activeTab === 'templates' && (
              <TemplateSelector
                selectedTemplate={selectedTemplate}
                setTemplate={setTemplate}
              />
            )}
          </div>
          
          {/* Navigation Footer - Always visible */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: '24px',
            padding: '20px 24px',
            background: 'rgba(0,0,0,0.3)',
            borderRadius: '16px',
            border: '1px solid rgba(255,255,255,0.1)'
          }}>
            <button
              onClick={onBack}
              style={{
                padding: '12px 24px',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.15)',
                borderRadius: '10px',
                color: 'rgba(255,255,255,0.7)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '14px'
              }}
            >
              <i className="fas fa-arrow-left"></i>
              Back to Upload
            </button>
            
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={onSave}
                disabled={saveStatus === 'saving'}
                style={{
                  padding: '12px 24px',
                  background: saveStatus === 'saved' ? 'rgba(16,185,129,0.2)' : 'rgba(255,255,255,0.05)',
                  border: '1px solid ' + (saveStatus === 'saved' ? 'rgba(16,185,129,0.4)' : 'rgba(255,255,255,0.15)'),
                  borderRadius: '10px',
                  color: saveStatus === 'saved' ? '#10B981' : 'white',
                  cursor: saveStatus === 'saving' ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '14px'
                }}
              >
                {saveStatus === 'saving' ? (
                  <><i className="fas fa-spinner fa-spin"></i> Saving...</>
                ) : saveStatus === 'saved' ? (
                  <><i className="fas fa-check"></i> Saved!</>
                ) : (
                  <><i className="fas fa-save"></i> Save Progress</>
                )}
              </button>
              
              <button
                onClick={() => {
                  console.log('🔍 Preview clicked - profile:', profile);
                  console.log('🔍 Preview clicked - profile.basics:', profile?.basics);
                  if (!profile || !profile.basics) {
                    alert('Please fill in your basic profile information first (Name, Title, etc.)');
                    return;
                  }
                  onPreview();
                }}
                style={{
                  padding: '12px 28px',
                  background: 'linear-gradient(135deg, #8B5CF6, #EC4899)',
                  border: 'none',
                  borderRadius: '10px',
                  color: 'white',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '14px',
                  fontWeight: '600'
                }}
              >
                Preview & Publish
                <i className="fas fa-arrow-right"></i>
              </button>
            </div>
          </div>
        </div>
      );
    };
    
    // Basics Editor with Profile Photo Upload - ENHANCED with quality handling
    const BasicsEditor = ({ profile, updateBasics, rawText, profilePhoto, setProfilePhoto }) => {
      const photoInputRef = useRef(null);
      const [photoLoading, setPhotoLoading] = useState(false);
      
      const handlePhotoChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        setPhotoLoading(true);
        
        try {
          // Create high-quality image with proper handling
          const reader = new FileReader();
          reader.onload = (event) => {
            const img = new Image();
            img.onload = () => {
              // Create canvas for optimal quality
              const canvas = document.createElement('canvas');
              const ctx = canvas.getContext('2d');
              
              // Target size for profile photos (high quality - preserve larger images)
              const maxSize = 1600;
              let width = img.width;
              let height = img.height;
              
              // Scale down if needed while maintaining aspect ratio
              if (width > height && width > maxSize) {
                height = (height * maxSize) / width;
                width = maxSize;
              } else if (height > maxSize) {
                width = (width * maxSize) / height;
                height = maxSize;
              }
              
              canvas.width = width;
              canvas.height = height;
              
              // Use high quality rendering
              ctx.imageSmoothingEnabled = true;
              ctx.imageSmoothingQuality = 'high';
              ctx.drawImage(img, 0, 0, width, height);
              
              // Convert to high quality (0.95 quality, use PNG for best quality)
              const dataUrl = canvas.toDataURL('image/png', 0.95);
              setProfilePhoto(dataUrl);
              setPhotoLoading(false);
            };
            img.onerror = () => {
              // Fallback to original if processing fails
              setProfilePhoto(URL.createObjectURL(file));
              setPhotoLoading(false);
            };
            img.src = event.target.result;
          };
          reader.readAsDataURL(file);
        } catch (err) {
          console.error('Photo processing error:', err);
          setProfilePhoto(URL.createObjectURL(file));
          setPhotoLoading(false);
        }
      };
      
      return (
        <div>
          {/* Profile Photo Section - ENHANCED */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '28px', marginBottom: '32px', padding: '24px', background: 'rgba(139,92,246,0.08)', borderRadius: '20px', border: '1px solid rgba(139,92,246,0.2)' }}>
            <input
              type="file"
              ref={photoInputRef}
              onChange={handlePhotoChange}
              accept="image/jpeg,image/png,image/webp,image/heic"
              hidden
            />
            <div
              onClick={() => !photoLoading && photoInputRef.current?.click()}
              style={{
                width: '140px',
                height: '140px',
                borderRadius: '24px',
                background: profilePhoto ? '#1a1a2e' : 'linear-gradient(135deg, var(--purple-main), var(--pink-main))',
                border: profilePhoto ? '4px solid var(--purple-main)' : '3px dashed rgba(255,255,255,0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: photoLoading ? 'wait' : 'pointer',
                overflow: 'hidden',
                flexShrink: 0,
                transition: 'all 0.3s ease',
                boxShadow: profilePhoto ? '0 12px 40px rgba(139,92,246,0.35)' : '0 8px 32px rgba(139,92,246,0.25)',
                position: 'relative'
              }}
            >
              {photoLoading ? (
                <div style={{ textAlign: 'center', color: '#fff' }}>
                  <i className="fas fa-spinner fa-spin" style={{ fontSize: '32px', marginBottom: '8px', display: 'block' }}></i>
                  <span style={{ fontSize: '11px', fontWeight: '600' }}>Processing...</span>
                </div>
              ) : profilePhoto ? (
                <img 
                  src={profilePhoto} 
                  style={{ 
                    width: '100%', 
                    height: '100%', 
                    objectFit: 'cover',
                    imageRendering: '-webkit-optimize-contrast',
                    WebkitBackfaceVisibility: 'hidden',
                    backfaceVisibility: 'hidden',
                    transform: 'translateZ(0)'
                  }} 
                  alt="Profile"
                />
              ) : (
                <div style={{ textAlign: 'center', color: '#fff' }}>
                  <i className="fas fa-camera" style={{ fontSize: '32px', marginBottom: '10px', display: 'block' }}></i>
                  <span style={{ fontSize: '12px', fontWeight: '600' }}>Add Photo</span>
                </div>
              )}
              
              {/* Hover overlay */}
              {profilePhoto && !photoLoading && (
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'rgba(0,0,0,0.5)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  opacity: 0,
                  transition: 'opacity 0.2s',
                  borderRadius: '20px'
                }} className="photo-hover-overlay">
                  <i className="fas fa-camera" style={{ color: '#fff', fontSize: '24px' }}></i>
                </div>
              )}
            </div>
            <div style={{ flex: 1 }}>
              <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#fff', marginBottom: '8px' }}>
                Profile Photo
                {profilePhoto && <i className="fas fa-check-circle" style={{ marginLeft: '10px', color: 'var(--green-main)', fontSize: '14px' }}></i>}
              </h3>
              <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', marginBottom: '14px' }}>
                Upload a professional headshot (JPEG, PNG, WebP supported)
              </p>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <button 
                  className="btn btn-primary" 
                  style={{ padding: '10px 20px', fontSize: '13px' }}
                  onClick={() => photoInputRef.current?.click()}
                  disabled={photoLoading}
                >
                  <i className={photoLoading ? 'fas fa-spinner fa-spin' : 'fas fa-upload'}></i> 
                  {photoLoading ? 'Processing...' : profilePhoto ? 'Change Photo' : 'Upload Photo'}
                </button>
                {profilePhoto && (
                  <button 
                    className="btn btn-secondary" 
                    style={{ padding: '10px 20px', fontSize: '13px' }}
                    onClick={() => { setProfilePhoto(null); localStorage.removeItem(STORAGE_KEYS.PHOTO); }}
                  >
                    <i className="fas fa-trash"></i> Remove
                  </button>
                )}
              </div>
              <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)', marginTop: '10px' }}>
                <i className="fas fa-info-circle" style={{ marginRight: '6px' }}></i>
                High-quality images are automatically optimized for best display
              </p>
            </div>
          </div>
          
          <style>{\`
            .photo-hover-overlay:hover { opacity: 1 !important; }
          \`}</style>
          
          <div className="form-row">
            <div className="form-field">
              <label className="form-label">Full Name</label>
              <input
                className="glass-input"
                value={profile.basics.name}
                onChange={(e) => updateBasics('name', e.target.value)}
                placeholder="John Smith"
              />
            </div>
            <div className="form-field">
              <label className="form-label">Job Title</label>
              <input
                className="glass-input"
                value={profile.basics.title}
                onChange={(e) => updateBasics('title', e.target.value)}
                placeholder="Senior Software Engineer"
              />
            </div>
            <div className="form-field full-width">
              <label className="form-label">Professional Tagline</label>
              <input
                className="glass-input"
                value={profile.basics.tagline}
                onChange={(e) => updateBasics('tagline', e.target.value)}
                placeholder="Building scalable systems that drive business growth"
              />
            </div>
            <div className="form-field full-width">
              <label className="form-label">Professional Summary</label>
              <textarea
                className="glass-input form-textarea"
                value={profile.basics.summary || ''}
                onChange={(e) => updateBasics('summary', e.target.value)}
                placeholder="A compelling 2-3 sentence summary of your professional background and expertise..."
              />
            </div>
            <div className="form-field">
              <label className="form-label">Email</label>
              <input
                className="glass-input"
                value={profile.basics.email}
                onChange={(e) => updateBasics('email', e.target.value)}
                placeholder="john@example.com"
              />
            </div>
            <div className="form-field">
              <label className="form-label">Phone</label>
              <input
                className="glass-input"
                value={profile.basics.phone}
                onChange={(e) => updateBasics('phone', e.target.value)}
                placeholder="+1 555 123 4567"
              />
            </div>
            <div className="form-field">
              <label className="form-label">Location</label>
              <input
                className="glass-input"
                value={profile.basics.location}
                onChange={(e) => updateBasics('location', e.target.value)}
                placeholder="San Francisco, CA"
              />
            </div>
            <div className="form-field">
              <label className="form-label">LinkedIn</label>
              <input
                className="glass-input"
                value={profile.basics.linkedin}
                onChange={(e) => updateBasics('linkedin', e.target.value)}
                placeholder="linkedin.com/in/johnsmith"
              />
            </div>
            <div className="form-field">
              <label className="form-label">Website</label>
              <input
                className="glass-input"
                value={profile.basics.website || ''}
                onChange={(e) => updateBasics('website', e.target.value)}
                placeholder="yourwebsite.com"
              />
            </div>
          </div>
          
          {rawText && (
            <details style={{ marginTop: '28px' }}>
              <summary style={{ cursor: 'pointer', color: 'rgba(255,255,255,0.45)', fontSize: '13px', fontWeight: '500' }}>
                <i className="fas fa-file-alt" style={{ marginRight: '8px' }}></i>
                View Extracted Text
              </summary>
              <pre style={{
                marginTop: '14px',
                padding: '18px',
                background: 'rgba(0,0,0,0.3)',
                borderRadius: '12px',
                fontSize: '11px',
                color: 'rgba(255,255,255,0.4)',
                maxHeight: '180px',
                overflow: 'auto',
                whiteSpace: 'pre-wrap',
                border: '1px solid rgba(255,255,255,0.08)'
              }}>{rawText}</pre>
            </details>
          )}
        </div>
      );
    };
    
    // Experience Editor with Company Logo Support
    const ExperienceEditor = ({ experiences, setExperiences }) => {
      const [logoErrors, setLogoErrors] = useState({});
      const [showCompanyInfo, setShowCompanyInfo] = useState({});
      const logoInputRefs = useRef({});
      
      const addExperience = () => {
        setExperiences([...experiences, {
          id: Date.now(),
          company: '',
          companyInfo: {
            website: '',
            domain: '',
            industry: '',
            location: '',
            size: '',
            description: ''
          },
          logoUrl: null,
          customLogo: null,
          role: '',
          startDate: '',
          endDate: '',
          description: '',
          responsibilities: [],
          dayInLife: [
            { time: '9:00 AM', activity: '' },
            { time: '11:00 AM', activity: '' },
            { time: '1:00 PM', activity: '' },
            { time: '3:00 PM', activity: '' },
            { time: '5:00 PM', activity: '' }
          ],
          metrics: [
            { value: '', label: '' },
            { value: '', label: '' },
            { value: '', label: '' },
            { value: '', label: '' }
          ],
          // NEW: Employer-specific rich content
          challenges: [],      // Challenges faced at this employer
          victories: [],       // Key wins and successes
          impactStories: [],   // Detailed impact narratives
          projects: [],        // Projects at this employer
          awards: [],          // Awards received at this employer
          reviews: [],         // Performance reviews/testimonials
          photos: [],          // Photos from this employer
          videos: [],          // Videos from this employer
          skills: []           // Skills learned/used at this employer
        }]);
      };
      
      const updateExperience = (idx, key, value) => {
        const updated = [...experiences];
        updated[idx] = { ...updated[idx], [key]: value };
        setExperiences(updated);
      };
      
      const updateCompanyInfo = (idx, key, value) => {
        const updated = [...experiences];
        updated[idx].companyInfo = { ...updated[idx].companyInfo, [key]: value };
        
        // Auto-update logo URL when domain changes
        if (key === 'domain' && value) {
          const cleanDomain = value.replace(/^(https?:\\/\\/)?(www\\.)?/, '').split('/')[0];
          updated[idx].logoUrl = \`https://logo.clearbit.com/\${cleanDomain}\`;
          // Clear any previous error
          setLogoErrors(prev => ({ ...prev, [idx]: false }));
        }
        
        setExperiences(updated);
      };
      
      const removeExperience = (idx) => {
        if (confirm('Are you sure you want to remove this experience? This action cannot be undone.')) {
          setExperiences(experiences.filter((_, i) => i !== idx));
        }
      };
      
      const updateMetric = (expIdx, metricIdx, key, value) => {
        const updated = [...experiences];
        updated[expIdx].metrics[metricIdx][key] = value;
        setExperiences(updated);
      };
      
      const updateDayActivity = (expIdx, dayIdx, value) => {
        const updated = [...experiences];
        updated[expIdx].dayInLife[dayIdx].activity = value;
        setExperiences(updated);
      };
      
      // Responsibility management functions
      const addResponsibility = (expIdx) => {
        const updated = [...experiences];
        if (!updated[expIdx].responsibilities) {
          updated[expIdx].responsibilities = [];
        }
        updated[expIdx].responsibilities.push('');
        setExperiences(updated);
      };
      
      const updateResponsibility = (expIdx, respIdx, value) => {
        const updated = [...experiences];
        updated[expIdx].responsibilities[respIdx] = value;
        setExperiences(updated);
      };
      
      const removeResponsibility = (expIdx, respIdx) => {
        const updated = [...experiences];
        updated[expIdx].responsibilities = updated[expIdx].responsibilities.filter((_, i) => i !== respIdx);
        setExperiences(updated);
      };
      
      const handleLogoUpload = (idx, e) => {
        const file = e.target.files[0];
        if (file) {
          if (confirm('Upload this logo for ' + (experiences[idx].company || 'this company') + '?')) {
            const url = URL.createObjectURL(file);
            const updated = [...experiences];
            updated[idx].customLogo = url;
            setExperiences(updated);
          }
        }
      };
      
      const handleLogoError = (idx) => {
        setLogoErrors(prev => ({ ...prev, [idx]: true }));
      };
      
      const clearCustomLogo = (idx) => {
        if (confirm('Remove custom logo and revert to auto-detected logo?')) {
          const updated = [...experiences];
          updated[idx].customLogo = null;
          setExperiences(updated);
        }
      };
      
      const toggleCompanyInfo = (idx) => {
        setShowCompanyInfo(prev => ({ ...prev, [idx]: !prev[idx] }));
      };
      
      // Get display logo - custom takes priority over auto
      const getDisplayLogo = (exp, idx) => {
        if (exp.customLogo) return exp.customLogo;
        if (exp.logoUrl && !logoErrors[idx]) return exp.logoUrl;
        return null;
      };
      
      return (
        <div>
          {experiences.map((exp, idx) => (
            <div key={exp.id} className="glass exp-entry">
              <div className="exp-head">
                {/* Company Logo Section */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1 }}>
                  <input
                    type="file"
                    ref={el => logoInputRefs.current[idx] = el}
                    onChange={(e) => handleLogoUpload(idx, e)}
                    accept="image/*"
                    hidden
                  />
                  <div
                    onClick={() => logoInputRefs.current[idx]?.click()}
                    style={{
                      width: '60px',
                      height: '60px',
                      borderRadius: '14px',
                      background: getDisplayLogo(exp, idx) ? '#fff' : 'linear-gradient(135deg, var(--purple-main), var(--pink-main))',
                      border: '2px solid rgba(255,255,255,0.15)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      overflow: 'hidden',
                      flexShrink: 0,
                      position: 'relative'
                    }}
                    title={getDisplayLogo(exp, idx) ? "Click to upload custom logo" : "Auto-detect or upload company logo"}
                  >
                    {getDisplayLogo(exp, idx) ? (
                      <img 
                        src={getDisplayLogo(exp, idx)} 
                        onError={() => handleLogoError(idx)}
                        style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '6px' }} 
                      />
                    ) : (
                      <div style={{ textAlign: 'center', color: '#fff' }}>
                        <i className="fas fa-building" style={{ fontSize: '20px' }}></i>
                      </div>
                    )}
                    {/* Upload overlay */}
                    <div style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'rgba(0,0,0,0.6)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      opacity: 0,
                      transition: 'opacity 0.2s',
                      borderRadius: '12px'
                    }} className="logo-upload-overlay">
                      <i className="fas fa-camera" style={{ color: '#fff', fontSize: '16px' }}></i>
                    </div>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '18px', fontWeight: '700', color: '#fff' }}>
                      {exp.company || 'New Experience'}
                    </div>
                    <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)' }}>
                      {exp.role || 'Role'} • {exp.startDate || 'Start'} - {exp.endDate || 'End'}
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {exp.customLogo && (
                    <button 
                      className="btn-icon" 
                      onClick={() => clearCustomLogo(idx)}
                      title="Remove custom logo"
                      style={{ background: 'rgba(236,72,153,0.15)', borderColor: 'rgba(236,72,153,0.3)' }}
                    >
                      <i className="fas fa-image" style={{ color: 'var(--pink-main)' }}></i>
                    </button>
                  )}
                  <button 
                    className="btn-icon" 
                    onClick={() => toggleCompanyInfo(idx)}
                    title="Company details"
                    style={{ 
                      background: showCompanyInfo[idx] ? 'rgba(6,182,212,0.2)' : 'rgba(255,255,255,0.05)',
                      borderColor: showCompanyInfo[idx] ? 'var(--cyan-main)' : 'rgba(255,255,255,0.1)'
                    }}
                  >
                    <i className="fas fa-info-circle" style={{ color: showCompanyInfo[idx] ? 'var(--cyan-main)' : 'rgba(255,255,255,0.5)' }}></i>
                  </button>
                  <button className="btn-icon" onClick={() => removeExperience(idx)}>
                    <i className="fas fa-trash"></i>
                  </button>
                </div>
              </div>
              
              {/* Company Info Section - Expandable */}
              {showCompanyInfo[idx] && (
                <div style={{ 
                  margin: '20px 0', 
                  padding: '20px', 
                  background: 'rgba(6,182,212,0.08)', 
                  borderRadius: '14px',
                  border: '1px solid rgba(6,182,212,0.2)'
                }}>
                  <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--cyan-main)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <i className="fas fa-building"></i>
                    Company Information
                    <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', fontWeight: '400', marginLeft: 'auto' }}>
                      Auto-generated • Edit if needed
                    </span>
                  </div>
                  <div className="form-row">
                    <div className="form-field">
                      <label className="form-label">Domain (for logo)</label>
                      <input
                        className="glass-input"
                        value={exp.companyInfo?.domain || ''}
                        onChange={(e) => updateCompanyInfo(idx, 'domain', e.target.value)}
                        placeholder="google.com"
                      />
                    </div>
                    <div className="form-field">
                      <label className="form-label">Website</label>
                      <input
                        className="glass-input"
                        value={exp.companyInfo?.website || ''}
                        onChange={(e) => updateCompanyInfo(idx, 'website', e.target.value)}
                        placeholder="https://company.com"
                      />
                    </div>
                    <div className="form-field">
                      <label className="form-label">Industry</label>
                      <input
                        className="glass-input"
                        value={exp.companyInfo?.industry || ''}
                        onChange={(e) => updateCompanyInfo(idx, 'industry', e.target.value)}
                        placeholder="Technology, Finance, etc."
                      />
                    </div>
                    <div className="form-field">
                      <label className="form-label">Location</label>
                      <input
                        className="glass-input"
                        value={exp.companyInfo?.location || ''}
                        onChange={(e) => updateCompanyInfo(idx, 'location', e.target.value)}
                        placeholder="San Francisco, CA"
                      />
                    </div>
                    <div className="form-field">
                      <label className="form-label">Company Size</label>
                      <input
                        className="glass-input"
                        value={exp.companyInfo?.size || ''}
                        onChange={(e) => updateCompanyInfo(idx, 'size', e.target.value)}
                        placeholder="1000+ employees"
                      />
                    </div>
                    <div className="form-field">
                      <label className="form-label">Description</label>
                      <input
                        className="glass-input"
                        value={exp.companyInfo?.description || ''}
                        onChange={(e) => updateCompanyInfo(idx, 'description', e.target.value)}
                        placeholder="Brief company description"
                      />
                    </div>
                  </div>
                  {(logoErrors[idx] && !exp.customLogo) && (
                    <div style={{ 
                      marginTop: '12px', 
                      padding: '10px 14px', 
                      background: 'rgba(239,68,68,0.1)', 
                      border: '1px solid rgba(239,68,68,0.2)',
                      borderRadius: '8px',
                      fontSize: '12px',
                      color: '#EF4444',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}>
                      <i className="fas fa-exclamation-triangle"></i>
                      Logo not found for this domain. Please upload a custom logo.
                    </div>
                  )}
                </div>
              )}
              
              <div className="form-row">
                <div className="form-field">
                  <label className="form-label">Company</label>
                  <input
                    className="glass-input"
                    value={exp.company}
                    onChange={(e) => updateExperience(idx, 'company', e.target.value)}
                    placeholder="Company name"
                  />
                </div>
                <div className="form-field">
                  <label className="form-label">Role</label>
                  <input
                    className="glass-input"
                    value={exp.role}
                    onChange={(e) => updateExperience(idx, 'role', e.target.value)}
                    placeholder="Job title"
                  />
                </div>
                <div className="form-field">
                  <label className="form-label">Start Date</label>
                  <input
                    className="glass-input"
                    value={exp.startDate}
                    onChange={(e) => updateExperience(idx, 'startDate', e.target.value)}
                    placeholder="Jan 2020"
                  />
                </div>
                <div className="form-field">
                  <label className="form-label">End Date</label>
                  <input
                    className="glass-input"
                    value={exp.endDate}
                    onChange={(e) => updateExperience(idx, 'endDate', e.target.value)}
                    placeholder="Present"
                  />
                </div>
                <div className="form-field full-width">
                  <label className="form-label">Description</label>
                  <textarea
                    className="glass-input form-textarea"
                    value={exp.description}
                    onChange={(e) => updateExperience(idx, 'description', e.target.value)}
                    placeholder="Describe your role and responsibilities..."
                    style={{ minHeight: '120px' }}
                  />
                </div>
              </div>
              
              {/* KEY RESPONSIBILITIES - Editable List */}
              <div className="resp-section">
                <div className="resp-header">
                  <i className="fas fa-tasks"></i>
                  Key Responsibilities
                  <span style={{ marginLeft: 'auto', fontSize: '11px', color: 'rgba(255,255,255,0.4)', fontWeight: '400' }}>
                    {(exp.responsibilities || []).length} items
                  </span>
                </div>
                
                {(exp.responsibilities || []).map((resp, respIdx) => (
                  <div key={respIdx} className="resp-item">
                    <div className="resp-bullet">{respIdx + 1}</div>
                    <input
                      className="resp-input"
                      value={resp}
                      onChange={(e) => updateResponsibility(idx, respIdx, e.target.value)}
                      placeholder="Led a team of 5 engineers to deliver..."
                    />
                    <button 
                      className="resp-delete"
                      onClick={() => removeResponsibility(idx, respIdx)}
                      title="Remove this responsibility"
                    >
                      <i className="fas fa-times"></i>
                    </button>
                  </div>
                ))}
                
                <button className="add-resp-btn" onClick={() => addResponsibility(idx)}>
                  <i className="fas fa-plus" style={{ marginRight: '8px' }}></i>
                  Add Responsibility
                </button>
              </div>
              
              {/* Day in Life */}
              <div className="day-section">
                <div className="day-header">
                  <i className="fas fa-sun"></i>
                  Day in the Life
                </div>
                {(exp.dayInLife || []).map((day, dayIdx) => (
                  <div key={dayIdx} className="day-entry">
                    <span className="day-time">{day.time}</span>
                    <input
                      className="day-input"
                      value={day.activity}
                      onChange={(e) => updateDayActivity(idx, dayIdx, e.target.value)}
                      placeholder="What you do at this time..."
                    />
                  </div>
                ))}
              </div>
              
              {/* Metrics */}
              <div className="metrics-section">
                <div className="metrics-header">
                  <i className="fas fa-chart-line"></i>
                  Impact Metrics
                </div>
                <div className="metrics-row">
                  {(exp.metrics || []).map((metric, metricIdx) => (
                    <div key={metricIdx} className="metric-box">
                      <input
                        value={metric.value}
                        onChange={(e) => updateMetric(idx, metricIdx, 'value', e.target.value)}
                        placeholder="+40%"
                      />
                      <input
                        value={metric.label}
                        onChange={(e) => updateMetric(idx, metricIdx, 'label', e.target.value)}
                        placeholder="METRIC"
                      />
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Rich Content Summary & Link */}
              <div style={{
                marginTop: '20px',
                padding: '20px',
                background: 'linear-gradient(135deg, rgba(139,92,246,0.1), rgba(236,72,153,0.05))',
                borderRadius: '14px',
                border: '1px solid rgba(139,92,246,0.2)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                  <div>
                    <h4 style={{ fontSize: '15px', fontWeight: '700', color: '#fff', marginBottom: '6px' }}>
                      <i className="fas fa-folder-open" style={{ marginRight: '10px', color: '#A78BFA' }}></i>
                      Employer Content Library
                    </h4>
                    <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>
                      Add projects, achievements, challenges, photos, videos, and reviews specific to this employer
                    </p>
                  </div>
                </div>
                
                {/* Content Summary */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '16px' }}>
                  <span style={{ 
                    padding: '6px 14px', 
                    background: (exp.projects?.length > 0) ? 'rgba(139,92,246,0.2)' : 'rgba(255,255,255,0.05)', 
                    borderRadius: '8px', 
                    fontSize: '12px', 
                    color: (exp.projects?.length > 0) ? '#A78BFA' : 'rgba(255,255,255,0.4)',
                    fontWeight: '600'
                  }}>
                    <i className="fas fa-folder" style={{ marginRight: '6px' }}></i>
                    {exp.projects?.length || 0} Projects
                  </span>
                  <span style={{ 
                    padding: '6px 14px', 
                    background: (exp.victories?.length > 0) ? 'rgba(245,158,11,0.2)' : 'rgba(255,255,255,0.05)', 
                    borderRadius: '8px', 
                    fontSize: '12px', 
                    color: (exp.victories?.length > 0) ? '#F59E0B' : 'rgba(255,255,255,0.4)',
                    fontWeight: '600'
                  }}>
                    <i className="fas fa-trophy" style={{ marginRight: '6px' }}></i>
                    {exp.victories?.length || 0} Victories
                  </span>
                  <span style={{ 
                    padding: '6px 14px', 
                    background: (exp.challenges?.length > 0) ? 'rgba(239,68,68,0.2)' : 'rgba(255,255,255,0.05)', 
                    borderRadius: '8px', 
                    fontSize: '12px', 
                    color: (exp.challenges?.length > 0) ? '#EF4444' : 'rgba(255,255,255,0.4)',
                    fontWeight: '600'
                  }}>
                    <i className="fas fa-mountain" style={{ marginRight: '6px' }}></i>
                    {exp.challenges?.length || 0} Challenges
                  </span>
                  <span style={{ 
                    padding: '6px 14px', 
                    background: (exp.photos?.length > 0) ? 'rgba(6,182,212,0.2)' : 'rgba(255,255,255,0.05)', 
                    borderRadius: '8px', 
                    fontSize: '12px', 
                    color: (exp.photos?.length > 0) ? '#06B6D4' : 'rgba(255,255,255,0.4)',
                    fontWeight: '600'
                  }}>
                    <i className="fas fa-images" style={{ marginRight: '6px' }}></i>
                    {exp.photos?.length || 0} Photos
                  </span>
                  <span style={{ 
                    padding: '6px 14px', 
                    background: (exp.videos?.length > 0) ? 'rgba(236,72,153,0.2)' : 'rgba(255,255,255,0.05)', 
                    borderRadius: '8px', 
                    fontSize: '12px', 
                    color: (exp.videos?.length > 0) ? '#EC4899' : 'rgba(255,255,255,0.4)',
                    fontWeight: '600'
                  }}>
                    <i className="fas fa-video" style={{ marginRight: '6px' }}></i>
                    {exp.videos?.length || 0} Videos
                  </span>
                  <span style={{ 
                    padding: '6px 14px', 
                    background: (exp.reviews?.length > 0) ? 'rgba(16,185,129,0.2)' : 'rgba(255,255,255,0.05)', 
                    borderRadius: '8px', 
                    fontSize: '12px', 
                    color: (exp.reviews?.length > 0) ? '#10B981' : 'rgba(255,255,255,0.4)',
                    fontWeight: '600'
                  }}>
                    <i className="fas fa-star" style={{ marginRight: '6px' }}></i>
                    {exp.reviews?.length || 0} Reviews
                  </span>
                </div>
                
                <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', fontStyle: 'italic' }}>
                  <i className="fas fa-lightbulb" style={{ marginRight: '6px' }}></i>
                  Tip: Go to Live Preview and click on this experience to add rich content
                </p>
              </div>
            </div>
          ))}
          
          <button className="btn-ghost" onClick={addExperience}>
            <i className="fas fa-plus"></i> Add Experience
          </button>
          
          <style>{\`
            .exp-entry:hover .logo-upload-overlay {
              opacity: 1 !important;
            }
          \`}</style>
        </div>
      );
    };
    
    // Skills Editor
    const SkillsEditor = ({ skills, setSkills }) => {
      const [inputValue, setInputValue] = useState('');
      
      const addSkill = () => {
        if (inputValue.trim()) {
          setSkills([...skills, inputValue.trim()]);
          setInputValue('');
        }
      };
      
      return (
        <div>
          <div style={{ display: 'flex', gap: '14px', marginBottom: '24px' }}>
            <input
              className="glass-input"
              style={{ flex: 1 }}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addSkill()}
              placeholder="Type a skill and press Enter..."
            />
            <button className="btn btn-primary" onClick={addSkill}>
              <i className="fas fa-plus"></i>
            </button>
          </div>
          
          <div className="skills-list">
            {skills.map((skill, idx) => (
              <div key={idx} className="skill-chip">
                {skill}
                <button onClick={() => setSkills(skills.filter((_, i) => i !== idx))}>
                  <i className="fas fa-times"></i>
                </button>
              </div>
            ))}
          </div>
        </div>
      );
    };
    
    // Generic List Editor
    const ListEditor = ({ title, items, setItems, fields }) => {
      const addItem = () => {
        const newItem = { id: Date.now() };
        fields.forEach(f => newItem[f.key] = '');
        setItems([...items, newItem]);
      };
      
      const updateItem = (idx, key, value) => {
        const updated = [...items];
        updated[idx] = { ...updated[idx], [key]: value };
        setItems(updated);
      };
      
      const removeItem = (idx) => {
        setItems(items.filter((_, i) => i !== idx));
      };
      
      return (
        <div>
          {items.map((item, idx) => (
            <div key={item.id} className="glass exp-entry">
              <div className="exp-head">
                <div className="exp-badge">{idx + 1}</div>
                <button className="btn-icon" onClick={() => removeItem(idx)}>
                  <i className="fas fa-trash"></i>
                </button>
              </div>
              
              <div className="form-row">
                {fields.map(field => (
                  <div key={field.key} className={'form-field' + (field.textarea ? ' full-width' : '')}>
                    <label className="form-label">{field.label}</label>
                    {field.textarea ? (
                      <textarea
                        className="glass-input form-textarea"
                        value={item[field.key] || ''}
                        onChange={(e) => updateItem(idx, field.key, e.target.value)}
                        placeholder={field.placeholder}
                      />
                    ) : (
                      <input
                        className="glass-input"
                        value={item[field.key] || ''}
                        onChange={(e) => updateItem(idx, field.key, e.target.value)}
                        placeholder={field.placeholder}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
          
          <button className="btn-ghost" onClick={addItem}>
            <i className="fas fa-plus"></i> Add {title.replace(/s$/, '')}
          </button>
        </div>
      );
    };
    
    // Template Selector Component - Enhanced with Industry Categories
    const TemplateSelector = ({ selectedTemplate, setTemplate }) => {
      const [activeCategory, setActiveCategory] = useState('all');
      
      const filteredTemplates = activeCategory === 'all' 
        ? TEMPLATES 
        : TEMPLATES.filter(t => t.category === activeCategory);
      
      return (
        <div>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px', marginBottom: '20px' }}>
            Choose a template designed for your industry. Your data is preserved when switching.
          </p>
          
          {/* Category Filter */}
          <div style={{ display: 'flex', gap: '10px', marginBottom: '28px', flexWrap: 'wrap' }}>
            <button
              onClick={() => setActiveCategory('all')}
              style={{
                padding: '10px 18px',
                borderRadius: '100px',
                border: activeCategory === 'all' ? '2px solid var(--purple-main)' : '2px solid rgba(255,255,255,0.1)',
                background: activeCategory === 'all' ? 'rgba(139,92,246,0.2)' : 'rgba(255,255,255,0.03)',
                color: activeCategory === 'all' ? '#fff' : 'rgba(255,255,255,0.5)',
                fontSize: '13px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              <i className="fas fa-th" style={{ marginRight: '8px' }}></i>
              All Templates
            </button>
            {TEMPLATE_CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                style={{
                  padding: '10px 18px',
                  borderRadius: '100px',
                  border: activeCategory === cat.id ? '2px solid var(--purple-main)' : '2px solid rgba(255,255,255,0.1)',
                  background: activeCategory === cat.id ? 'rgba(139,92,246,0.2)' : 'rgba(255,255,255,0.03)',
                  color: activeCategory === cat.id ? '#fff' : 'rgba(255,255,255,0.5)',
                  fontSize: '13px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                <i className={'fas ' + cat.icon} style={{ marginRight: '8px' }}></i>
                {cat.name}
              </button>
            ))}
          </div>
          
          {/* Templates Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
            {filteredTemplates.map(template => (
              <div
                key={template.id}
                onClick={() => setTemplate(template.id)}
                style={{
                  padding: '24px',
                  borderRadius: '20px',
                  background: selectedTemplate === template.id 
                    ? 'linear-gradient(135deg, rgba(139,92,246,0.15), rgba(236,72,153,0.08))'
                    : 'rgba(255,255,255,0.03)',
                  border: selectedTemplate === template.id 
                    ? '2px solid ' + template.color
                    : '2px solid rgba(255,255,255,0.06)',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                {/* Gradient header bar */}
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '4px',
                  background: template.gradient
                }} />
                
                {/* Template Header */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '14px' }}>
                  <div style={{
                    width: '52px',
                    height: '52px',
                    borderRadius: '14px',
                    background: template.gradient,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '22px',
                    color: '#fff',
                    boxShadow: '0 8px 24px ' + template.color + '40'
                  }}>
                    <i className={'fas ' + template.icon}></i>
                  </div>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#fff', marginBottom: '4px' }}>
                      {template.name}
                    </h3>
                    <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.45)', lineHeight: '1.4' }}>
                      {template.desc}
                    </p>
                  </div>
                </div>
                
                {/* Industry Tags */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '14px' }}>
                  {template.industries.map((ind, i) => (
                    <span key={i} style={{
                      padding: '4px 10px',
                      borderRadius: '6px',
                      background: 'rgba(255,255,255,0.06)',
                      fontSize: '10px',
                      fontWeight: '500',
                      color: 'rgba(255,255,255,0.5)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.3px'
                    }}>
                      {ind}
                    </span>
                  ))}
                </div>
                
                {/* Mini Preview */}
                <div style={{
                  padding: '14px',
                  background: 'rgba(0,0,0,0.25)',
                  borderRadius: '12px',
                  border: '1px solid rgba(255,255,255,0.05)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                    <div style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '8px',
                      background: template.gradient
                    }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ width: '60%', height: '7px', background: 'rgba(255,255,255,0.25)', borderRadius: '4px', marginBottom: '4px' }} />
                      <div style={{ width: '40%', height: '5px', background: template.color + '50', borderRadius: '3px' }} />
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '6px', marginBottom: '8px' }}>
                    {[1,2,3].map(i => (
                      <div key={i} style={{ 
                        flex: 1, 
                        height: '20px', 
                        background: i === 1 ? template.color + '30' : 'rgba(255,255,255,0.08)', 
                        borderRadius: '4px' 
                      }} />
                    ))}
                  </div>
                  <div style={{ width: '100%', height: '5px', background: 'rgba(255,255,255,0.08)', borderRadius: '3px', marginBottom: '6px' }} />
                  <div style={{ width: '70%', height: '5px', background: 'rgba(255,255,255,0.08)', borderRadius: '3px' }} />
                </div>
                
                {/* Selected checkmark */}
                {selectedTemplate === template.id && (
                  <div style={{
                    position: 'absolute',
                    top: '14px',
                    right: '14px',
                    width: '26px',
                    height: '26px',
                    borderRadius: '50%',
                    background: template.gradient,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    fontSize: '11px',
                    boxShadow: '0 4px 12px ' + template.color + '50'
                  }}>
                    <i className="fas fa-check"></i>
                  </div>
                )}
              </div>
            ))}
          </div>
          
          {/* Template count */}
          <p style={{ textAlign: 'center', marginTop: '24px', fontSize: '12px', color: 'rgba(255,255,255,0.35)' }}>
            Showing {filteredTemplates.length} of {TEMPLATES.length} templates
          </p>
        </div>
      );
    };
    
    // Known company domain mappings for automatic logo lookup (for EmployerDetailPage)
    const KNOWN_COMPANY_DOMAINS_EMPLOYER = {
      'in the house productions': 'inthehouseproductions.com',
      'in the house production': 'inthehouseproductions.com',
      'in house productions': 'inthehouseproductions.com',
      'inthehouseproductions': 'inthehouseproductions.com',
      'in-the-house productions': 'inthehouseproductions.com',
      'the house productions': 'inthehouseproductions.com',
      'house productions': 'inthehouseproductions.com',
      'google': 'google.com',
      'stripe': 'stripe.com',
      'salesforce': 'salesforce.com',
      'amazon': 'amazon.com',
      'microsoft': 'microsoft.com',
      'apple': 'apple.com',
      'meta': 'meta.com',
      'facebook': 'facebook.com',
      'netflix': 'netflix.com',
      'walmart': 'walmart.com',
      'target': 'target.com',
      'starbucks': 'starbucks.com',
      'mcdonalds': 'mcdonalds.com',
      "mcdonald's": 'mcdonalds.com',
      'publix': 'publix.com',
      'cvs': 'cvs.com',
      'walgreens': 'walgreens.com',
      'bank of america': 'bankofamerica.com',
      'wells fargo': 'wellsfargo.com',
      'chase': 'chase.com',
      'jpmorgan': 'jpmorgan.com',
      'citibank': 'citibank.com',
    };
    
    // Local static logo mappings - for companies without good external logos
    const LOCAL_LOGOS_EMPLOYER = {
      'in the house productions': '/static/inthehouse-logo.png',
      'in the house production': '/static/inthehouse-logo.png',
      'in house productions': '/static/inthehouse-logo.png',
      'inthehouseproductions': '/static/inthehouse-logo.png',
      'in-the-house productions': '/static/inthehouse-logo.png',
      'the house productions': '/static/inthehouse-logo.png',
      'house productions': '/static/inthehouse-logo.png',
      'chapters health system': '/static/chapters-health-logo.png',
      'chapters health': '/static/chapters-health-logo.png',
      'chapters': '/static/chapters-health-logo.png',
    };
    
    const getLocalLogoForEmployer = (companyName) => {
      if (!companyName) return null;
      const lowerName = companyName.toLowerCase().trim();
      if (LOCAL_LOGOS_EMPLOYER[lowerName]) return LOCAL_LOGOS_EMPLOYER[lowerName];
      for (const [key, path] of Object.entries(LOCAL_LOGOS_EMPLOYER)) {
        if (lowerName.includes(key) || key.includes(lowerName)) return path;
      }
      return null;
    };
    
    // Helper to get domain from company name
    const getCompanyDomainForEmployer = (companyName, existingDomain) => {
      if (existingDomain) return existingDomain;
      if (!companyName) return null;
      const lowerName = companyName.toLowerCase().trim();
      // Check exact match first
      if (KNOWN_COMPANY_DOMAINS_EMPLOYER[lowerName]) return KNOWN_COMPANY_DOMAINS_EMPLOYER[lowerName];
      // Check partial matches
      for (const [key, domain] of Object.entries(KNOWN_COMPANY_DOMAINS_EMPLOYER)) {
        if (lowerName.includes(key) || key.includes(lowerName)) {
          return domain;
        }
      }
      return null;
    };
    
    // EMPLOYER DETAIL PAGE - Full immersive view for each employer experience
    const EmployerDetailPage = ({ experience, onClose, template, isEditing, onUpdate }) => {
      const [activeSection, setActiveSection] = useState('overview');
      const [expandedPhoto, setExpandedPhoto] = useState(null);
      const [expandedVideo, setExpandedVideo] = useState(null);
      const photoInputRef = useRef(null);
      const videoInputRef = useRef(null);
      
      const styles = {
        accent: template?.color || '#8B5CF6',
        gradient: template?.gradient || 'linear-gradient(135deg, #8B5CF6, #6D28D9)',
      };
      
      const exp = experience || {};
      // Use customLogo first, then logoUrl, then local static logo, then try logo.dev API with domain
      const expLocalLogo = getLocalLogoForEmployer(exp.company);
      const expDomain = getCompanyDomainForEmployer(exp.company, exp.companyInfo?.domain);
      const displayLogo = exp.customLogo || exp.logoUrl || expLocalLogo || (expDomain ? \`https://img.logo.dev/\${expDomain}?token=pk_X-1ZO13GSgeOoUrIuJ6GMQ\` : null);
      
      // Calculate tenure
      const calculateTenure = () => {
        if (!exp.startDate) return '';
        const start = new Date(exp.startDate);
        const end = exp.endDate && exp.endDate !== 'Present' ? new Date(exp.endDate) : new Date();
        const months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
        const years = Math.floor(months / 12);
        const remainingMonths = months % 12;
        if (years > 0 && remainingMonths > 0) return \`\${years} yr\${years > 1 ? 's' : ''} \${remainingMonths} mo\`;
        if (years > 0) return \`\${years} year\${years > 1 ? 's' : ''}\`;
        return \`\${remainingMonths} month\${remainingMonths > 1 ? 's' : ''}\`;
      };
      
      const sections = [
        { id: 'overview', icon: 'fa-eye', label: 'Overview' },
        { id: 'responsibilities', icon: 'fa-tasks', label: 'Responsibilities' },
        { id: 'projects', icon: 'fa-folder', label: 'Projects' },
        { id: 'achievements', icon: 'fa-trophy', label: 'Achievements' },
        { id: 'challenges', icon: 'fa-mountain', label: 'Challenges' },
        { id: 'media', icon: 'fa-photo-video', label: 'Media' },
        { id: 'reviews', icon: 'fa-star', label: 'Reviews' },
        { id: 'dayinlife', icon: 'fa-sun', label: 'Day in Life' },
      ];
      
      // Handle photo upload for this employer
      const handlePhotoUpload = async (e) => {
        const files = Array.from(e.target.files || []);
        const newPhotos = await Promise.all(files.map(file => {
          return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (ev) => {
              const img = new Image();
              img.onload = () => {
                const canvas = document.createElement('canvas');
                const maxSize = 1600;
                let { width, height } = img;
                if (width > maxSize || height > maxSize) {
                  if (width > height) { height = (height / width) * maxSize; width = maxSize; }
                  else { width = (width / height) * maxSize; height = maxSize; }
                }
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx.imageSmoothingEnabled = true;
                ctx.imageSmoothingQuality = 'high';
                ctx.drawImage(img, 0, 0, width, height);
                resolve({ id: Date.now() + Math.random(), url: canvas.toDataURL('image/png', 0.95), name: file.name });
              };
              img.src = ev.target.result;
            };
            reader.readAsDataURL(file);
          });
        }));
        const updatedPhotos = [...(exp.photos || []), ...newPhotos];
        onUpdate('photos', updatedPhotos);
      };
      
      // Handle video upload for this employer
      const handleVideoUpload = (e) => {
        const files = Array.from(e.target.files || []);
        const newVideos = files.map(file => ({
          id: Date.now() + Math.random(),
          url: URL.createObjectURL(file),
          name: file.name,
          type: file.type
        }));
        const updatedVideos = [...(exp.videos || []), ...newVideos];
        onUpdate('videos', updatedVideos);
      };
      
      // Add item helpers
      const addProject = () => {
        const projects = [...(exp.projects || []), { id: Date.now(), name: '', description: '', url: '', techStack: [], outcome: '' }];
        onUpdate('projects', projects);
      };
      
      const addChallenge = () => {
        const challenges = [...(exp.challenges || []), { id: Date.now(), title: '', situation: '', approach: '', outcome: '' }];
        onUpdate('challenges', challenges);
      };
      
      const addVictory = () => {
        const victories = [...(exp.victories || []), { id: Date.now(), title: '', description: '', impact: '' }];
        onUpdate('victories', victories);
      };
      
      const addReview = () => {
        const reviews = [...(exp.reviews || []), { id: Date.now(), quote: '', author: '', role: '', date: '' }];
        onUpdate('reviews', reviews);
      };
      
      return (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.95)',
          zIndex: 20000,
          overflow: 'auto'
        }}>
          {/* Photo Modal */}
          {expandedPhoto && (
            <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.95)', zIndex: 30000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }} onClick={() => setExpandedPhoto(null)}>
              <img src={expandedPhoto} style={{ maxWidth: '95%', maxHeight: '95%', borderRadius: '12px' }} />
              <button onClick={() => setExpandedPhoto(null)} style={{ position: 'absolute', top: '20px', right: '20px', background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '50%', width: '50px', height: '50px', color: '#fff', fontSize: '20px', cursor: 'pointer' }}>
                <i className="fas fa-times"></i>
              </button>
            </div>
          )}
          
          {/* Video Modal */}
          {expandedVideo && (
            <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.95)', zIndex: 30000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }} onClick={() => setExpandedVideo(null)}>
              <video src={expandedVideo} controls autoPlay style={{ maxWidth: '95%', maxHeight: '95%', borderRadius: '12px' }} onClick={e => e.stopPropagation()} />
              <button onClick={() => setExpandedVideo(null)} style={{ position: 'absolute', top: '20px', right: '20px', background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '50%', width: '50px', height: '50px', color: '#fff', fontSize: '20px', cursor: 'pointer' }}>
                <i className="fas fa-times"></i>
              </button>
            </div>
          )}
          
          {/* Header */}
          <div style={{
            position: 'sticky',
            top: 0,
            background: 'linear-gradient(135deg, #0a0a12 0%, #1a1a2e 100%)',
            borderBottom: '1px solid rgba(255,255,255,0.1)',
            padding: '20px 40px',
            display: 'flex',
            alignItems: 'center',
            gap: '24px',
            zIndex: 100
          }}>
            <button onClick={onClose} style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '12px',
              padding: '12px 20px',
              color: '#fff',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '14px'
            }}>
              <i className="fas fa-arrow-left"></i>
              Back to Timeline
            </button>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1 }}>
              {displayLogo ? (
                <div style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '14px',
                  background: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden'
                }}>
                  <img 
                    src={displayLogo} 
                    style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '8px' }} 
                    onError={(e) => {
                      const ddgUrl = expDomain ? \`https://icons.duckduckgo.com/ip3/\${expDomain}.ico\` : null;
                      if (ddgUrl && e.target.src !== ddgUrl) {
                        e.target.src = ddgUrl;
                      } else {
                        e.target.style.display = 'none';
                      }
                    }} 
                  />
                </div>
              ) : (
                <div style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '14px',
                  background: \`linear-gradient(135deg, \${styles.accent}, #6D28D9)\`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '24px',
                  fontWeight: '700'
                }}>
                  {(exp.company || 'C').charAt(0).toUpperCase()}
                </div>
              )}
              <div>
                <h1 style={{ fontSize: '26px', fontWeight: '800', color: '#fff', marginBottom: '4px', fontFamily: 'Space Grotesk, sans-serif' }}>
                  {exp.company || 'Company Name'}
                </h1>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                  <span style={{ color: styles.accent, fontSize: '16px', fontWeight: '600' }}>{exp.role || 'Your Role'}</span>
                  <span style={{ padding: '4px 12px', background: styles.accent + '20', borderRadius: '100px', fontSize: '12px', color: styles.accent }}>
                    {exp.startDate || 'Start'} — {exp.endDate || 'Present'}
                  </span>
                  {calculateTenure() && (
                    <span style={{ padding: '4px 12px', background: 'rgba(255,255,255,0.05)', borderRadius: '100px', fontSize: '12px', color: 'rgba(255,255,255,0.6)' }}>
                      <i className="fas fa-clock" style={{ marginRight: '6px' }}></i>{calculateTenure()}
                    </span>
                  )}
                </div>
              </div>
            </div>
            
            {/* Quick Stats */}
            <div style={{ display: 'flex', gap: '20px' }}>
              {exp.metrics?.filter(m => m.value).slice(0, 3).map((m, i) => (
                <div key={i} style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '22px', fontWeight: '800', color: styles.accent }}>{m.value}</div>
                  <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)' }}>{m.label}</div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Navigation Tabs */}
          <div style={{
            position: 'sticky',
            top: '100px',
            background: 'rgba(10,10,18,0.95)',
            backdropFilter: 'blur(10px)',
            borderBottom: '1px solid rgba(255,255,255,0.05)',
            padding: '0 40px',
            zIndex: 99,
            display: 'flex',
            gap: '8px',
            overflowX: 'auto'
          }}>
            {sections.map(sec => (
              <button
                key={sec.id}
                onClick={() => setActiveSection(sec.id)}
                style={{
                  padding: '16px 24px',
                  background: activeSection === sec.id ? styles.accent + '15' : 'transparent',
                  border: 'none',
                  borderBottom: activeSection === sec.id ? \`3px solid \${styles.accent}\` : '3px solid transparent',
                  color: activeSection === sec.id ? styles.accent : 'rgba(255,255,255,0.5)',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  whiteSpace: 'nowrap'
                }}
              >
                <i className={\`fas \${sec.icon}\`}></i>
                {sec.label}
              </button>
            ))}
          </div>
          
          {/* Content */}
          <div style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto' }}>
            
            {/* OVERVIEW SECTION */}
            {activeSection === 'overview' && (
              <div>
                {/* Company Info Card */}
                {exp.companyInfo && (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '32px' }}>
                    {exp.companyInfo.industry && (
                      <div style={{ padding: '20px', background: 'rgba(255,255,255,0.03)', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.06)' }}>
                        <i className="fas fa-industry" style={{ color: styles.accent, marginBottom: '8px', display: 'block' }}></i>
                        <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', marginBottom: '4px' }}>Industry</div>
                        <div style={{ fontSize: '15px', color: '#fff', fontWeight: '600' }}>{exp.companyInfo.industry}</div>
                      </div>
                    )}
                    {exp.companyInfo.location && (
                      <div style={{ padding: '20px', background: 'rgba(255,255,255,0.03)', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.06)' }}>
                        <i className="fas fa-map-marker-alt" style={{ color: styles.accent, marginBottom: '8px', display: 'block' }}></i>
                        <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', marginBottom: '4px' }}>Location</div>
                        <div style={{ fontSize: '15px', color: '#fff', fontWeight: '600' }}>{exp.companyInfo.location}</div>
                      </div>
                    )}
                    {exp.companyInfo.size && (
                      <div style={{ padding: '20px', background: 'rgba(255,255,255,0.03)', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.06)' }}>
                        <i className="fas fa-users" style={{ color: styles.accent, marginBottom: '8px', display: 'block' }}></i>
                        <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', marginBottom: '4px' }}>Company Size</div>
                        <div style={{ fontSize: '15px', color: '#fff', fontWeight: '600' }}>{exp.companyInfo.size}</div>
                      </div>
                    )}
                    {exp.companyInfo.website && (
                      <div style={{ padding: '20px', background: 'rgba(255,255,255,0.03)', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.06)' }}>
                        <i className="fas fa-globe" style={{ color: styles.accent, marginBottom: '8px', display: 'block' }}></i>
                        <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', marginBottom: '4px' }}>Website</div>
                        <a href={exp.companyInfo.website} target="_blank" style={{ fontSize: '15px', color: styles.accent, fontWeight: '600', textDecoration: 'none' }}>{exp.companyInfo.domain || 'Visit Site'}</a>
                      </div>
                    )}
                  </div>
                )}
                
                {/* Description */}
                <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '20px', padding: '32px', border: '1px solid rgba(255,255,255,0.06)', marginBottom: '32px' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#fff', marginBottom: '16px' }}>
                    <i className="fas fa-user-tie" style={{ marginRight: '12px', color: styles.accent }}></i>
                    Role Overview
                  </h3>
                  <p style={{ fontSize: '16px', lineHeight: '1.9', color: 'rgba(255,255,255,0.75)' }}>
                    {exp.description || 'Add a description of your role, responsibilities, and impact at this company.'}
                  </p>
                </div>
                
                {/* Impact Metrics */}
                {exp.metrics?.some(m => m.value) && (
                  <div style={{ marginBottom: '32px' }}>
                    <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#fff', marginBottom: '20px' }}>
                      <i className="fas fa-chart-line" style={{ marginRight: '12px', color: styles.accent }}></i>
                      Key Impact Metrics
                    </h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>
                      {exp.metrics.filter(m => m.value).map((metric, idx) => (
                        <div key={idx} style={{
                          background: \`linear-gradient(135deg, \${styles.accent}15, \${styles.accent}05)\`,
                          borderRadius: '16px',
                          padding: '24px',
                          border: \`1px solid \${styles.accent}25\`,
                          textAlign: 'center'
                        }}>
                          <div style={{ fontSize: '32px', fontWeight: '800', color: styles.accent, marginBottom: '8px' }}>{metric.value}</div>
                          <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)' }}>{metric.label}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Skills Used */}
                {exp.skills?.length > 0 && (
                  <div>
                    <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#fff', marginBottom: '16px' }}>
                      <i className="fas fa-tools" style={{ marginRight: '12px', color: styles.accent }}></i>
                      Skills Applied
                    </h3>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                      {exp.skills.map((skill, idx) => (
                        <span key={idx} style={{
                          padding: '10px 18px',
                          background: styles.accent + '15',
                          border: \`1px solid \${styles.accent}30\`,
                          borderRadius: '100px',
                          fontSize: '13px',
                          fontWeight: '500',
                          color: styles.accent
                        }}>{skill}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {/* RESPONSIBILITIES SECTION */}
            {activeSection === 'responsibilities' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                  <h3 style={{ fontSize: '22px', fontWeight: '700', color: '#fff' }}>
                    <i className="fas fa-tasks" style={{ marginRight: '12px', color: styles.accent }}></i>
                    Key Responsibilities
                  </h3>
                  {isEditing && (
                    <button onClick={() => {
                      const resp = [...(exp.responsibilities || []), ''];
                      onUpdate('responsibilities', resp);
                    }} style={{
                      padding: '10px 20px',
                      background: styles.gradient,
                      border: 'none',
                      borderRadius: '10px',
                      color: '#fff',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}>
                      <i className="fas fa-plus" style={{ marginRight: '8px' }}></i>Add Responsibility
                    </button>
                  )}
                </div>
                
                <div style={{ display: 'grid', gap: '12px' }}>
                  {(exp.responsibilities || []).map((resp, idx) => (
                    <div key={idx} style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '16px',
                      padding: '20px',
                      background: 'rgba(255,255,255,0.03)',
                      borderRadius: '14px',
                      border: '1px solid rgba(255,255,255,0.06)'
                    }}>
                      <div style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '10px',
                        background: styles.accent + '20',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: styles.accent,
                        fontWeight: '700',
                        fontSize: '14px',
                        flexShrink: 0
                      }}>{idx + 1}</div>
                      <p style={{ flex: 1, fontSize: '15px', lineHeight: '1.7', color: 'rgba(255,255,255,0.75)', margin: 0 }}>{resp}</p>
                    </div>
                  ))}
                  {(!exp.responsibilities || exp.responsibilities.length === 0) && (
                    <p style={{ color: 'rgba(255,255,255,0.4)', fontStyle: 'italic', padding: '40px', textAlign: 'center' }}>
                      No responsibilities added yet. {isEditing ? 'Click "Add Responsibility" to start.' : ''}
                    </p>
                  )}
                </div>
              </div>
            )}
            
            {/* PROJECTS SECTION */}
            {activeSection === 'projects' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                  <h3 style={{ fontSize: '22px', fontWeight: '700', color: '#fff' }}>
                    <i className="fas fa-folder" style={{ marginRight: '12px', color: styles.accent }}></i>
                    Projects at {exp.company || 'This Company'}
                  </h3>
                  {isEditing && (
                    <button onClick={addProject} style={{
                      padding: '10px 20px',
                      background: styles.gradient,
                      border: 'none',
                      borderRadius: '10px',
                      color: '#fff',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}>
                      <i className="fas fa-plus" style={{ marginRight: '8px' }}></i>Add Project
                    </button>
                  )}
                </div>
                
                <div style={{ display: 'grid', gap: '20px' }}>
                  {(exp.projects || []).map((project, idx) => (
                    <div key={project.id || idx} style={{
                      background: 'rgba(255,255,255,0.03)',
                      borderRadius: '18px',
                      padding: '28px',
                      border: '1px solid rgba(255,255,255,0.06)'
                    }}>
                      <h4 style={{ fontSize: '18px', fontWeight: '700', color: '#fff', marginBottom: '12px' }}>
                        <i className="fas fa-project-diagram" style={{ marginRight: '10px', color: styles.accent }}></i>
                        {project.name || 'Project Name'}
                      </h4>
                      <p style={{ fontSize: '15px', lineHeight: '1.8', color: 'rgba(255,255,255,0.7)', marginBottom: '16px' }}>
                        {project.description || 'Project description...'}
                      </p>
                      {project.techStack?.length > 0 && (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '16px' }}>
                          {project.techStack.map((tech, tidx) => (
                            <span key={tidx} style={{ padding: '6px 12px', background: 'rgba(255,255,255,0.05)', borderRadius: '6px', fontSize: '12px', color: 'rgba(255,255,255,0.6)' }}>{tech}</span>
                          ))}
                        </div>
                      )}
                      {project.outcome && (
                        <div style={{ padding: '16px', background: styles.accent + '10', borderRadius: '12px', borderLeft: \`4px solid \${styles.accent}\` }}>
                          <div style={{ fontSize: '12px', color: styles.accent, fontWeight: '600', marginBottom: '4px' }}>OUTCOME</div>
                          <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.8)', margin: 0 }}>{project.outcome}</p>
                        </div>
                      )}
                    </div>
                  ))}
                  {(!exp.projects || exp.projects.length === 0) && (
                    <p style={{ color: 'rgba(255,255,255,0.4)', fontStyle: 'italic', padding: '40px', textAlign: 'center' }}>
                      No projects added yet.
                    </p>
                  )}
                </div>
              </div>
            )}
            
            {/* ACHIEVEMENTS/VICTORIES SECTION */}
            {activeSection === 'achievements' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                  <h3 style={{ fontSize: '22px', fontWeight: '700', color: '#fff' }}>
                    <i className="fas fa-trophy" style={{ marginRight: '12px', color: '#F59E0B' }}></i>
                    Achievements & Victories
                  </h3>
                  {isEditing && (
                    <button onClick={addVictory} style={{
                      padding: '10px 20px',
                      background: 'linear-gradient(135deg, #F59E0B, #D97706)',
                      border: 'none',
                      borderRadius: '10px',
                      color: '#fff',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}>
                      <i className="fas fa-plus" style={{ marginRight: '8px' }}></i>Add Victory
                    </button>
                  )}
                </div>
                
                <div style={{ display: 'grid', gap: '20px' }}>
                  {(exp.victories || []).map((victory, idx) => (
                    <div key={victory.id || idx} style={{
                      background: 'linear-gradient(135deg, rgba(245,158,11,0.1), rgba(245,158,11,0.02))',
                      borderRadius: '18px',
                      padding: '28px',
                      border: '1px solid rgba(245,158,11,0.2)',
                      position: 'relative',
                      overflow: 'hidden'
                    }}>
                      <i className="fas fa-trophy" style={{ position: 'absolute', right: '20px', top: '20px', fontSize: '48px', color: 'rgba(245,158,11,0.1)' }}></i>
                      <h4 style={{ fontSize: '18px', fontWeight: '700', color: '#fff', marginBottom: '12px' }}>{victory.title || 'Victory Title'}</h4>
                      <p style={{ fontSize: '15px', lineHeight: '1.8', color: 'rgba(255,255,255,0.7)', marginBottom: '12px' }}>{victory.description}</p>
                      {victory.impact && (
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 16px', background: 'rgba(245,158,11,0.2)', borderRadius: '8px' }}>
                          <i className="fas fa-bolt" style={{ color: '#F59E0B' }}></i>
                          <span style={{ fontSize: '14px', color: '#F59E0B', fontWeight: '600' }}>{victory.impact}</span>
                        </div>
                      )}
                    </div>
                  ))}
                  
                  {/* Awards at this company */}
                  {(exp.awards || []).map((award, idx) => (
                    <div key={award.id || idx} style={{
                      background: 'linear-gradient(135deg, rgba(139,92,246,0.1), rgba(139,92,246,0.02))',
                      borderRadius: '18px',
                      padding: '28px',
                      border: '1px solid rgba(139,92,246,0.2)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '20px'
                    }}>
                      <div style={{ width: '60px', height: '60px', borderRadius: '16px', background: 'linear-gradient(135deg, #8B5CF6, #6D28D9)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <i className="fas fa-award" style={{ fontSize: '28px', color: '#fff' }}></i>
                      </div>
                      <div>
                        <h4 style={{ fontSize: '17px', fontWeight: '700', color: '#fff', marginBottom: '4px' }}>{award.title || 'Award Name'}</h4>
                        <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.5)' }}>{award.organization} • {award.year}</p>
                      </div>
                    </div>
                  ))}
                  
                  {(!exp.victories || exp.victories.length === 0) && (!exp.awards || exp.awards.length === 0) && (
                    <p style={{ color: 'rgba(255,255,255,0.4)', fontStyle: 'italic', padding: '40px', textAlign: 'center' }}>
                      No achievements or victories added yet.
                    </p>
                  )}
                </div>
              </div>
            )}
            
            {/* CHALLENGES SECTION */}
            {activeSection === 'challenges' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                  <h3 style={{ fontSize: '22px', fontWeight: '700', color: '#fff' }}>
                    <i className="fas fa-mountain" style={{ marginRight: '12px', color: '#EF4444' }}></i>
                    Challenges Overcome
                  </h3>
                  {isEditing && (
                    <button onClick={addChallenge} style={{
                      padding: '10px 20px',
                      background: 'linear-gradient(135deg, #EF4444, #DC2626)',
                      border: 'none',
                      borderRadius: '10px',
                      color: '#fff',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}>
                      <i className="fas fa-plus" style={{ marginRight: '8px' }}></i>Add Challenge
                    </button>
                  )}
                </div>
                
                <div style={{ display: 'grid', gap: '24px' }}>
                  {(exp.challenges || []).map((challenge, idx) => (
                    <div key={challenge.id || idx} style={{
                      background: 'rgba(255,255,255,0.03)',
                      borderRadius: '20px',
                      overflow: 'hidden',
                      border: '1px solid rgba(255,255,255,0.06)'
                    }}>
                      <div style={{ padding: '24px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                        <h4 style={{ fontSize: '18px', fontWeight: '700', color: '#fff' }}>
                          <i className="fas fa-flag" style={{ marginRight: '10px', color: '#EF4444' }}></i>
                          {challenge.title || 'Challenge Title'}
                        </h4>
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)' }}>
                        <div style={{ padding: '20px', borderRight: '1px solid rgba(255,255,255,0.06)' }}>
                          <div style={{ fontSize: '11px', color: '#EF4444', fontWeight: '700', marginBottom: '10px', letterSpacing: '1px' }}>SITUATION</div>
                          <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.7)', lineHeight: '1.7' }}>{challenge.situation || 'What was the situation?'}</p>
                        </div>
                        <div style={{ padding: '20px', borderRight: '1px solid rgba(255,255,255,0.06)' }}>
                          <div style={{ fontSize: '11px', color: '#F59E0B', fontWeight: '700', marginBottom: '10px', letterSpacing: '1px' }}>APPROACH</div>
                          <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.7)', lineHeight: '1.7' }}>{challenge.approach || 'How did you tackle it?'}</p>
                        </div>
                        <div style={{ padding: '20px' }}>
                          <div style={{ fontSize: '11px', color: '#10B981', fontWeight: '700', marginBottom: '10px', letterSpacing: '1px' }}>OUTCOME</div>
                          <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.7)', lineHeight: '1.7' }}>{challenge.outcome || 'What was the result?'}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                  {(!exp.challenges || exp.challenges.length === 0) && (
                    <p style={{ color: 'rgba(255,255,255,0.4)', fontStyle: 'italic', padding: '40px', textAlign: 'center' }}>
                      No challenges documented yet. Add challenges you overcame to showcase problem-solving skills.
                    </p>
                  )}
                </div>
              </div>
            )}
            
            {/* MEDIA SECTION */}
            {activeSection === 'media' && (
              <div>
                <h3 style={{ fontSize: '22px', fontWeight: '700', color: '#fff', marginBottom: '24px' }}>
                  <i className="fas fa-photo-video" style={{ marginRight: '12px', color: styles.accent }}></i>
                  Media Gallery from {exp.company || 'This Company'}
                </h3>
                
                {/* Photos */}
                <div style={{ marginBottom: '40px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <h4 style={{ fontSize: '16px', fontWeight: '600', color: 'rgba(255,255,255,0.8)' }}>
                      <i className="fas fa-images" style={{ marginRight: '10px' }}></i>
                      Photos ({(exp.photos || []).length})
                    </h4>
                    {isEditing && (
                      <>
                        <input type="file" ref={photoInputRef} onChange={handlePhotoUpload} multiple accept="image/*" hidden />
                        <button onClick={() => photoInputRef.current?.click()} style={{
                          padding: '8px 16px',
                          background: 'rgba(255,255,255,0.1)',
                          border: '1px solid rgba(255,255,255,0.2)',
                          borderRadius: '8px',
                          color: '#fff',
                          cursor: 'pointer',
                          fontSize: '13px'
                        }}>
                          <i className="fas fa-plus" style={{ marginRight: '6px' }}></i>Add Photos
                        </button>
                      </>
                    )}
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
                    {(exp.photos || []).map((photo, idx) => (
                      <div key={photo.id || idx} onClick={() => setExpandedPhoto(photo.url)} style={{
                        aspectRatio: '4/3',
                        borderRadius: '14px',
                        overflow: 'hidden',
                        cursor: 'pointer',
                        position: 'relative'
                      }}>
                        <img src={photo.url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.5), transparent)', opacity: 0, transition: 'opacity 0.2s' }} className="photo-overlay">
                          <i className="fas fa-expand" style={{ position: 'absolute', bottom: '12px', right: '12px', color: '#fff' }}></i>
                        </div>
                      </div>
                    ))}
                    {(exp.photos || []).length === 0 && (
                      <p style={{ color: 'rgba(255,255,255,0.4)', fontStyle: 'italic', padding: '40px', textAlign: 'center', gridColumn: '1 / -1' }}>
                        No photos added yet.
                      </p>
                    )}
                  </div>
                </div>
                
                {/* Videos */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <h4 style={{ fontSize: '16px', fontWeight: '600', color: 'rgba(255,255,255,0.8)' }}>
                      <i className="fas fa-video" style={{ marginRight: '10px' }}></i>
                      Videos ({(exp.videos || []).length})
                    </h4>
                    {isEditing && (
                      <>
                        <input type="file" ref={videoInputRef} onChange={handleVideoUpload} multiple accept="video/*" hidden />
                        <button onClick={() => videoInputRef.current?.click()} style={{
                          padding: '8px 16px',
                          background: 'rgba(255,255,255,0.1)',
                          border: '1px solid rgba(255,255,255,0.2)',
                          borderRadius: '8px',
                          color: '#fff',
                          cursor: 'pointer',
                          fontSize: '13px'
                        }}>
                          <i className="fas fa-plus" style={{ marginRight: '6px' }}></i>Add Videos
                        </button>
                      </>
                    )}
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
                    {(exp.videos || []).map((video, idx) => (
                      <div key={video.id || idx} style={{
                        aspectRatio: '16/9',
                        borderRadius: '14px',
                        overflow: 'hidden',
                        background: 'rgba(0,0,0,0.3)',
                        position: 'relative',
                        cursor: 'pointer'
                      }} onClick={() => setExpandedVideo(video.url)}>
                        <video src={video.url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        <div style={{
                          position: 'absolute',
                          inset: 0,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          background: 'rgba(0,0,0,0.4)'
                        }}>
                          <div style={{
                            width: '60px',
                            height: '60px',
                            borderRadius: '50%',
                            background: styles.gradient,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}>
                            <i className="fas fa-play" style={{ color: '#fff', fontSize: '20px', marginLeft: '4px' }}></i>
                          </div>
                        </div>
                      </div>
                    ))}
                    {(exp.videos || []).length === 0 && (
                      <p style={{ color: 'rgba(255,255,255,0.4)', fontStyle: 'italic', padding: '40px', textAlign: 'center', gridColumn: '1 / -1' }}>
                        No videos added yet.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
            
            {/* REVIEWS SECTION */}
            {activeSection === 'reviews' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                  <h3 style={{ fontSize: '22px', fontWeight: '700', color: '#fff' }}>
                    <i className="fas fa-star" style={{ marginRight: '12px', color: '#F59E0B' }}></i>
                    Reviews & Testimonials
                  </h3>
                  {isEditing && (
                    <button onClick={addReview} style={{
                      padding: '10px 20px',
                      background: 'linear-gradient(135deg, #F59E0B, #D97706)',
                      border: 'none',
                      borderRadius: '10px',
                      color: '#fff',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}>
                      <i className="fas fa-plus" style={{ marginRight: '8px' }}></i>Add Review
                    </button>
                  )}
                </div>
                
                <div style={{ display: 'grid', gap: '20px' }}>
                  {(exp.reviews || []).map((review, idx) => (
                    <div key={review.id || idx} style={{
                      background: 'rgba(255,255,255,0.03)',
                      borderRadius: '20px',
                      padding: '28px',
                      border: '1px solid rgba(255,255,255,0.06)',
                      position: 'relative'
                    }}>
                      <i className="fas fa-quote-left" style={{ position: 'absolute', top: '20px', left: '20px', fontSize: '24px', color: 'rgba(245,158,11,0.2)' }}></i>
                      <p style={{ fontSize: '17px', lineHeight: '1.9', color: 'rgba(255,255,255,0.8)', fontStyle: 'italic', marginBottom: '20px', paddingLeft: '40px' }}>
                        "{review.quote || 'Add a quote from your reviewer...'}"
                      </p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', paddingLeft: '40px' }}>
                        <div style={{
                          width: '44px',
                          height: '44px',
                          borderRadius: '12px',
                          background: styles.gradient,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#fff',
                          fontWeight: '700',
                          fontSize: '16px'
                        }}>
                          {(review.author || 'A')[0].toUpperCase()}
                        </div>
                        <div>
                          <div style={{ fontSize: '15px', fontWeight: '600', color: '#fff' }}>{review.author || 'Reviewer Name'}</div>
                          <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)' }}>{review.role || 'Role'}{review.date ? \` • \${review.date}\` : ''}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                  {(!exp.reviews || exp.reviews.length === 0) && (
                    <p style={{ color: 'rgba(255,255,255,0.4)', fontStyle: 'italic', padding: '40px', textAlign: 'center' }}>
                      No reviews or testimonials added yet. Add feedback from managers, colleagues, or clients.
                    </p>
                  )}
                </div>
              </div>
            )}
            
            {/* DAY IN LIFE SECTION */}
            {activeSection === 'dayinlife' && (
              <div>
                <h3 style={{ fontSize: '22px', fontWeight: '700', color: '#fff', marginBottom: '24px' }}>
                  <i className="fas fa-sun" style={{ marginRight: '12px', color: styles.accent }}></i>
                  A Day in This Role
                </h3>
                
                <div style={{
                  background: 'rgba(255,255,255,0.03)',
                  borderRadius: '20px',
                  padding: '32px',
                  border: '1px solid rgba(255,255,255,0.06)'
                }}>
                  <div style={{ position: 'relative' }}>
                    {/* Timeline line */}
                    <div style={{
                      position: 'absolute',
                      left: '50px',
                      top: '20px',
                      bottom: '20px',
                      width: '2px',
                      background: \`linear-gradient(to bottom, \${styles.accent}, \${styles.accent}30)\`
                    }}></div>
                    
                    {(exp.dayInLife || []).filter(d => d.activity).map((day, idx) => (
                      <div key={idx} style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '24px',
                        marginBottom: idx < (exp.dayInLife || []).length - 1 ? '28px' : 0,
                        position: 'relative'
                      }}>
                        <div style={{
                          width: '100px',
                          textAlign: 'right',
                          fontSize: '15px',
                          fontWeight: '700',
                          color: styles.accent,
                          paddingTop: '4px'
                        }}>{day.time}</div>
                        <div style={{
                          width: '16px',
                          height: '16px',
                          borderRadius: '50%',
                          background: styles.accent,
                          border: '4px solid #0a0a12',
                          flexShrink: 0,
                          marginTop: '6px'
                        }}></div>
                        <div style={{
                          flex: 1,
                          padding: '16px 20px',
                          background: styles.accent + '10',
                          borderRadius: '12px',
                          borderLeft: \`3px solid \${styles.accent}\`
                        }}>
                          <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.8)', margin: 0 }}>{day.activity}</p>
                        </div>
                      </div>
                    ))}
                    
                    {(!exp.dayInLife || !exp.dayInLife.some(d => d.activity)) && (
                      <p style={{ color: 'rgba(255,255,255,0.4)', fontStyle: 'italic', padding: '40px', textAlign: 'center' }}>
                        No daily activities documented yet.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      );
    };
    
    // Media Editor - ENHANCED with proper video playback and image quality
    const MediaEditor = ({ photos, videos, setPhotos, setVideos }) => {
      const photoInputRef = useRef(null);
      const videoInputRef = useRef(null);
      const [expandedVideo, setExpandedVideo] = useState(null);
      const [expandedPhoto, setExpandedPhoto] = useState(null);
      
      const handlePhotoUpload = async (e) => {
        const files = Array.from(e.target.files);
        const newPhotos = await Promise.all(files.map(async (file) => {
          return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (event) => {
              const img = new Image();
              img.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                const maxSize = 1200;
                let width = img.width;
                let height = img.height;
                
                if (width > height && width > maxSize) {
                  height = (height * maxSize) / width;
                  width = maxSize;
                } else if (height > maxSize) {
                  width = (width * maxSize) / height;
                  height = maxSize;
                }
                
                canvas.width = width;
                canvas.height = height;
                ctx.imageSmoothingEnabled = true;
                ctx.imageSmoothingQuality = 'high';
                ctx.drawImage(img, 0, 0, width, height);
                
                resolve({
                  id: Date.now() + Math.random(),
                  url: canvas.toDataURL('image/jpeg', 0.9),
                  name: file.name
                });
              };
              img.onerror = () => {
                resolve({
                  id: Date.now() + Math.random(),
                  url: URL.createObjectURL(file),
                  name: file.name
                });
              };
              img.src = event.target.result;
            };
            reader.readAsDataURL(file);
          });
        }));
        setPhotos([...photos, ...newPhotos]);
      };
      
      const handleVideoUpload = (e) => {
        const files = Array.from(e.target.files);
        const newVideos = files.map(f => ({
          id: Date.now() + Math.random(),
          url: URL.createObjectURL(f),
          name: f.name,
          type: f.type
        }));
        setVideos([...videos, ...newVideos]);
      };
      
      return (
        <div>
          {/* Expanded Photo Modal */}
          {expandedPhoto && (
            <div 
              onClick={() => setExpandedPhoto(null)}
              style={{
                position: 'fixed',
                inset: 0,
                background: 'rgba(0,0,0,0.9)',
                zIndex: 10000,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '40px',
                cursor: 'zoom-out'
              }}
            >
              <img 
                src={expandedPhoto.url} 
                style={{ maxWidth: '100%', maxHeight: '100%', borderRadius: '12px', boxShadow: '0 20px 60px rgba(0,0,0,0.5)' }} 
                alt="Expanded"
              />
              <button
                onClick={() => setExpandedPhoto(null)}
                style={{
                  position: 'absolute',
                  top: '20px',
                  right: '20px',
                  width: '44px',
                  height: '44px',
                  borderRadius: '50%',
                  background: 'rgba(255,255,255,0.1)',
                  border: 'none',
                  color: '#fff',
                  cursor: 'pointer',
                  fontSize: '20px'
                }}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
          )}
          
          {/* Expanded Video Modal */}
          {expandedVideo && (
            <div 
              onClick={(e) => e.target === e.currentTarget && setExpandedVideo(null)}
              style={{
                position: 'fixed',
                inset: 0,
                background: 'rgba(0,0,0,0.95)',
                zIndex: 10000,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '40px'
              }}
            >
              <video 
                src={expandedVideo.url} 
                controls 
                autoPlay
                playsInline
                style={{ 
                  maxWidth: '90vw', 
                  maxHeight: '85vh', 
                  borderRadius: '12px', 
                  boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
                  objectFit: 'contain',
                  background: '#000'
                }}
              />
              <button
                onClick={() => setExpandedVideo(null)}
                style={{
                  position: 'absolute',
                  top: '20px',
                  right: '20px',
                  width: '44px',
                  height: '44px',
                  borderRadius: '50%',
                  background: 'rgba(255,255,255,0.1)',
                  border: 'none',
                  color: '#fff',
                  cursor: 'pointer',
                  fontSize: '20px'
                }}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
          )}
        
          <h3 style={{ fontSize: '14px', color: 'var(--cyan-main)', marginBottom: '18px', fontWeight: '600' }}>
            <i className="fas fa-camera" style={{ marginRight: '10px' }}></i>
            Photos
            <span style={{ marginLeft: '10px', fontSize: '12px', color: 'rgba(255,255,255,0.4)', fontWeight: '400' }}>
              ({photos.length} uploaded)
            </span>
          </h3>
          
          <input
            type="file"
            ref={photoInputRef}
            onChange={handlePhotoUpload}
            accept="image/jpeg,image/png,image/webp,image/gif"
            multiple
            hidden
          />
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '14px', marginBottom: '36px' }}>
            {photos.map(photo => (
              <div 
                key={photo.id} 
                style={{
                  aspectRatio: '1',
                  borderRadius: '14px',
                  overflow: 'hidden',
                  position: 'relative',
                  border: '2px solid rgba(255,255,255,0.1)',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onClick={() => setExpandedPhoto(photo)}
              >
                <img 
                  src={photo.url} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover', imageRendering: 'high-quality' }} 
                  alt={photo.name || 'Photo'}
                />
                {/* Hover overlay with zoom icon */}
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(transparent 50%, rgba(0,0,0,0.7))',
                  display: 'flex',
                  alignItems: 'flex-end',
                  justifyContent: 'center',
                  padding: '10px',
                  opacity: 0,
                  transition: 'opacity 0.2s'
                }} className="media-hover">
                  <i className="fas fa-search-plus" style={{ color: '#fff', fontSize: '18px' }}></i>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); setPhotos(photos.filter(p => p.id !== photo.id)); }}
                  style={{
                    position: 'absolute',
                    top: '8px',
                    right: '8px',
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    background: 'rgba(239,68,68,0.9)',
                    border: 'none',
                    color: '#fff',
                    cursor: 'pointer',
                    fontSize: '12px',
                    opacity: 0,
                    transition: 'opacity 0.2s'
                  }}
                  className="delete-btn"
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>
            ))}
            
            <button
              onClick={() => photoInputRef.current?.click()}
              style={{
                aspectRatio: '1',
                borderRadius: '14px',
                border: '2px dashed rgba(6,182,212,0.4)',
                background: 'rgba(6,182,212,0.05)',
                cursor: 'pointer',
                color: 'var(--cyan-main)',
                fontSize: '18px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                transition: 'all 0.2s'
              }}
            >
              <i className="fas fa-plus"></i>
              <span style={{ fontSize: '11px', fontWeight: '600' }}>Add Photo</span>
            </button>
          </div>
          
          <h3 style={{ fontSize: '14px', color: 'var(--pink-main)', marginBottom: '18px', fontWeight: '600' }}>
            <i className="fas fa-video" style={{ marginRight: '10px' }}></i>
            Videos
            <span style={{ marginLeft: '10px', fontSize: '12px', color: 'rgba(255,255,255,0.4)', fontWeight: '400' }}>
              ({videos.length} uploaded)
            </span>
          </h3>
          
          <input
            type="file"
            ref={videoInputRef}
            onChange={handleVideoUpload}
            accept="video/mp4,video/webm,video/mov,video/quicktime"
            multiple
            hidden
          />
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '14px' }}>
            {videos.map(video => (
              <div 
                key={video.id} 
                style={{
                  borderRadius: '14px',
                  overflow: 'hidden',
                  position: 'relative',
                  border: '2px solid rgba(255,255,255,0.1)',
                  background: '#0a0a12'
                }}
              >
                {/* Video with controls - Fixed playback */}
                <video 
                  src={video.url} 
                  controls
                  preload="auto"
                  playsInline
                  style={{ 
                    width: '100%', 
                    minHeight: '180px',
                    maxHeight: '300px',
                    objectFit: 'contain',
                    background: '#000',
                    display: 'block'
                  }}
                  onClick={(e) => e.target.paused ? e.target.play() : e.target.pause()}
                />
                
                {/* Video info bar */}
                <div style={{
                  padding: '10px 14px',
                  background: 'rgba(0,0,0,0.5)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <i className="fas fa-film"></i>
                    {video.name || 'Video'}
                  </span>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => setExpandedVideo(video)}
                      style={{
                        width: '30px',
                        height: '30px',
                        borderRadius: '8px',
                        background: 'rgba(236,72,153,0.2)',
                        border: 'none',
                        color: 'var(--pink-main)',
                        cursor: 'pointer',
                        fontSize: '12px'
                      }}
                      title="Full screen"
                    >
                      <i className="fas fa-expand"></i>
                    </button>
                    <button
                      onClick={() => setVideos(videos.filter(v => v.id !== video.id))}
                      style={{
                        width: '30px',
                        height: '30px',
                        borderRadius: '8px',
                        background: 'rgba(239,68,68,0.2)',
                        border: 'none',
                        color: '#EF4444',
                        cursor: 'pointer',
                        fontSize: '12px'
                      }}
                      title="Delete"
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>
                </div>
              </div>
            ))}
            
            <button
              onClick={() => videoInputRef.current?.click()}
              style={{
                aspectRatio: '16/9',
                borderRadius: '14px',
                border: '2px dashed rgba(236,72,153,0.4)',
                background: 'rgba(236,72,153,0.05)',
                cursor: 'pointer',
                color: 'var(--pink-main)',
                fontSize: '18px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                transition: 'all 0.2s'
              }}
            >
              <i className="fas fa-plus"></i>
              <span style={{ fontSize: '12px', fontWeight: '600' }}>Add Video</span>
              <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)' }}>MP4, WebM, MOV</span>
            </button>
          </div>
          
          <style>{\`
            .media-hover:hover, div:hover > .media-hover { opacity: 1 !important; }
            div:hover > .delete-btn { opacity: 1 !important; }
          \`}</style>
        </div>
      );
    };
    
    // ============================================================
    // AI CHAT ASSISTANT WIDGET
    // ============================================================
    const ChatWidget = ({ user, profile, setProfile, view }) => {
      const [isOpen, setIsOpen] = useState(false);
      const [messages, setMessages] = useState([
        { role: 'assistant', content: "Hi! I'm your WebUME assistant. I can help you navigate the app, answer questions, or even edit your profile. What would you like to do?" }
      ]);
      const [input, setInput] = useState('');
      const [loading, setLoading] = useState(false);
      const messagesEndRef = React.useRef(null);
      
      const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      };
      
      React.useEffect(() => {
        scrollToBottom();
      }, [messages]);
      
      // Process action from AI response
      const processAction = (action) => {
        if (!action || !profile) return false;
        
        try {
          const { type, section, action: actionType, data } = action;
          
          if (type !== 'edit_profile') return false;
          
          let updatedProfile = { ...profile };
          
          switch (section) {
            case 'basics':
              updatedProfile.basics = { ...updatedProfile.basics, ...data };
              break;
              
            case 'skills':
              if (actionType === 'add' && data.name) {
                const newSkill = {
                  id: Date.now().toString(),
                  name: data.name,
                  category: data.category || 'Technical',
                  level: data.level || 'Intermediate'
                };
                updatedProfile.skills = [...(updatedProfile.skills || []), newSkill];
              } else if (actionType === 'delete' && data.name) {
                updatedProfile.skills = (updatedProfile.skills || []).filter(s => 
                  s.name.toLowerCase() !== data.name.toLowerCase()
                );
              }
              break;
              
            case 'achievements':
              if (actionType === 'add' && data.title) {
                const newAch = {
                  id: Date.now().toString(),
                  title: data.title,
                  description: data.description || ''
                };
                updatedProfile.achievements = [...(updatedProfile.achievements || []), newAch];
              }
              break;
              
            case 'education':
              if (actionType === 'add' && data.degree) {
                const newEdu = {
                  id: Date.now().toString(),
                  degree: data.degree,
                  school: data.school || '',
                  year: data.year || '',
                  details: data.details || ''
                };
                updatedProfile.education = [...(updatedProfile.education || []), newEdu];
              }
              break;
              
            case 'experience':
              if (actionType === 'add' && data.employer) {
                const newExp = {
                  id: Date.now().toString(),
                  employer: data.employer,
                  title: data.title || '',
                  startDate: data.startDate || '',
                  endDate: data.endDate || 'Present',
                  description: data.description || '',
                  responsibilities: data.responsibilities || [],
                  projects: [],
                  victories: [],
                  challenges: [],
                  dayInLife: [],
                  media: { photos: [], videos: [] }
                };
                updatedProfile.experience = [...(updatedProfile.experience || []), newExp];
              } else if (actionType === 'update' && data.experienceId) {
                updatedProfile.experience = (updatedProfile.experience || []).map(exp =>
                  exp.id === data.experienceId ? { ...exp, ...data } : exp
                );
              }
              break;
              
            default:
              return false;
          }
          
          setProfile(updatedProfile);
          return true;
        } catch (e) {
          console.error('Error processing action:', e);
          return false;
        }
      };
      
      const sendMessage = async () => {
        if (!input.trim() || loading) return;
        
        const userMessage = input.trim();
        setInput('');
        setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
        setLoading(true);
        
        try {
          // Include conversation history for context
          const currentMessages = [...messages, { role: 'user', content: userMessage }];
          
          const res = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              message: userMessage,
              context: { view },
              conversationHistory: currentMessages.slice(-6), // Last 6 messages for context
              profile: profile ? {
                basics: profile.basics,
                experience: profile.experience?.map(e => ({ id: e.id, employer: e.employer, title: e.title })),
                skills: profile.skills?.map(s => ({ name: s.name, category: s.category })),
                achievements: profile.achievements?.length,
                education: profile.education?.length
              } : null
            })
          });
          
          const data = await res.json();
          
          if (data.error) {
            setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' }]);
          } else {
            // Process any action first
            let actionMessage = '';
            if (data.action) {
              const success = processAction(data.action);
              if (success) {
                actionMessage = '\\n\\n✅ I\\'ve updated your profile!';
              }
            }
            
            setMessages(prev => [...prev, { 
              role: 'assistant', 
              content: data.response + actionMessage 
            }]);
          }
        } catch (e) {
          setMessages(prev => [...prev, { role: 'assistant', content: 'Connection error. Please check your internet and try again.' }]);
        }
        
        setLoading(false);
      };
      
      const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          sendMessage();
        }
      };
      
      // Quick action buttons
      const quickActions = [
        { label: '📝 How to edit?', message: 'How do I edit my profile sections?' },
        { label: '🎯 Improve ATS', message: 'How can I improve my ATS score?' },
        { label: '✨ Add skill', message: 'Help me add a new skill to my profile' },
        { label: '🚀 What\\'s next?', message: 'What should I do next to complete my profile?' }
      ];
      
      return (
        <>
          {/* Chat Toggle Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            style={{
              position: 'fixed',
              bottom: '24px',
              right: '24px',
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #8B5CF6, #EC4899)',
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 8px 32px rgba(139, 92, 246, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 9998,
              transition: 'transform 0.2s, box-shadow 0.2s'
            }}
            onMouseOver={(e) => { e.currentTarget.style.transform = 'scale(1.1)'; }}
            onMouseOut={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
          >
            <i className={isOpen ? 'fas fa-times' : 'fas fa-comment-dots'} style={{ fontSize: '24px', color: 'white' }}></i>
          </button>
          
          {/* Chat Window */}
          {isOpen && (
            <div style={{
              position: 'fixed',
              bottom: '100px',
              right: '24px',
              width: '380px',
              maxWidth: 'calc(100vw - 48px)',
              height: '500px',
              maxHeight: 'calc(100vh - 140px)',
              background: 'linear-gradient(180deg, #1a1a2e 0%, #0f0f1a 100%)',
              borderRadius: '20px',
              border: '1px solid rgba(139, 92, 246, 0.3)',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              zIndex: 9999
            }}>
              {/* Header */}
              <div style={{
                padding: '16px 20px',
                background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(236, 72, 153, 0.2))',
                borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #8B5CF6, #EC4899)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <i className="fas fa-robot" style={{ color: 'white', fontSize: '18px' }}></i>
                </div>
                <div>
                  <div style={{ fontWeight: '700', color: 'white', fontSize: '15px' }}>WebUME Assistant</div>
                  <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>Always here to help</div>
                </div>
              </div>
              
              {/* Messages */}
              <div style={{
                flex: 1,
                overflowY: 'auto',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px'
              }}>
                {messages.map((msg, idx) => (
                  <div key={idx} style={{
                    display: 'flex',
                    justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start'
                  }}>
                    <div style={{
                      maxWidth: '85%',
                      padding: '12px 16px',
                      borderRadius: msg.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                      background: msg.role === 'user' 
                        ? 'linear-gradient(135deg, #8B5CF6, #7C3AED)' 
                        : 'rgba(255, 255, 255, 0.08)',
                      color: 'white',
                      fontSize: '14px',
                      lineHeight: '1.5',
                      whiteSpace: 'pre-wrap'
                    }}>
                      {msg.content}
                    </div>
                  </div>
                ))}
                {loading && (
                  <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                    <div style={{
                      padding: '12px 16px',
                      borderRadius: '16px 16px 16px 4px',
                      background: 'rgba(255, 255, 255, 0.08)',
                      color: 'rgba(255,255,255,0.5)',
                      fontSize: '14px'
                    }}>
                      <i className="fas fa-circle-notch fa-spin" style={{ marginRight: '8px' }}></i>
                      Thinking...
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
              
              {/* Quick Actions */}
              {messages.length <= 2 && (
                <div style={{
                  padding: '8px 16px',
                  display: 'flex',
                  gap: '8px',
                  flexWrap: 'wrap',
                  borderTop: '1px solid rgba(255,255,255,0.05)'
                }}>
                  {quickActions.map((qa, idx) => (
                    <button
                      key={idx}
                      onClick={() => { setInput(qa.message); }}
                      style={{
                        padding: '6px 12px',
                        fontSize: '12px',
                        background: 'rgba(139, 92, 246, 0.15)',
                        border: '1px solid rgba(139, 92, 246, 0.3)',
                        borderRadius: '20px',
                        color: 'rgba(255,255,255,0.8)',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                      onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(139, 92, 246, 0.3)'; }}
                      onMouseOut={(e) => { e.currentTarget.style.background = 'rgba(139, 92, 246, 0.15)'; }}
                    >
                      {qa.label}
                    </button>
                  ))}
                </div>
              )}
              
              {/* Input */}
              <div style={{
                padding: '12px 16px',
                borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                display: 'flex',
                gap: '10px'
              }}>
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me anything..."
                  style={{
                    flex: 1,
                    padding: '12px 16px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '12px',
                    color: 'white',
                    fontSize: '14px',
                    outline: 'none'
                  }}
                />
                <button
                  onClick={sendMessage}
                  disabled={loading || !input.trim()}
                  style={{
                    padding: '12px 16px',
                    background: loading || !input.trim() ? 'rgba(139, 92, 246, 0.3)' : 'linear-gradient(135deg, #8B5CF6, #EC4899)',
                    border: 'none',
                    borderRadius: '12px',
                    color: 'white',
                    cursor: loading || !input.trim() ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  <i className="fas fa-paper-plane"></i>
                </button>
              </div>
            </div>
          )}
        </>
      );
    };
    
    // ============================================================
    // AI RESUME TAILOR VIEW - Premium Feature
    // ============================================================
    const TailorView = ({ profile, user, setView }) => {
      const [jobDescription, setJobDescription] = useState('');
      const [jobTitle, setJobTitle] = useState('');
      const [company, setCompany] = useState('');
      const [jobUrl, setJobUrl] = useState('');
      const [loading, setLoading] = useState(false);
      const [result, setResult] = useState(null);
      const [error, setError] = useState(null);
      const [savedResumes, setSavedResumes] = useState([]);
      const [showSaved, setShowSaved] = useState(false);
      const [saving, setSaving] = useState(false);
      
      const isPremium = user?.subscription?.planId === 'pro' || user?.subscription?.planId === 'enterprise';
      
      // Load saved resumes on mount
      useEffect(() => {
        if (isPremium) {
          fetch('/api/tailored-resumes')
            .then(res => res.json())
            .then(data => setSavedResumes(data.resumes || []))
            .catch(() => {});
        }
      }, [isPremium]);
      
      const handleTailor = async () => {
        if (!jobDescription.trim()) {
          setError('Please paste or enter a job description');
          return;
        }
        
        setLoading(true);
        setError(null);
        setResult(null);
        
        try {
          const res = await fetch('/api/tailor-resume', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ jobDescription, jobTitle, company, jobUrl })
          });
          
          const data = await res.json();
          
          if (!res.ok) {
            if (res.status === 403) {
              setError(data);
            } else {
              setError({ message: data.error || 'Failed to tailor resume' });
            }
            return;
          }
          
          setResult(data);
        } catch (err) {
          setError({ message: 'Network error. Please try again.' });
        } finally {
          setLoading(false);
        }
      };
      
      const handleSave = async () => {
        if (!result) return;
        
        setSaving(true);
        try {
          const res = await fetch('/api/tailored-resumes/save', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              tailoredResume: {
                jobTitle: result.metadata?.jobTitle || jobTitle || 'Untitled Position',
                company: result.metadata?.company || company || 'Unknown Company',
                jobUrl,
                matchScore: result.matchAnalysis?.overallScore,
                tailoredProfile: result.tailoredProfile,
                matchAnalysis: result.matchAnalysis,
                coverLetterHints: result.coverLetterHints,
                interviewTips: result.interviewTips
              }
            })
          });
          
          const data = await res.json();
          if (data.success) {
            setSavedResumes(prev => [...prev, data.resume]);
            alert('✅ Tailored resume saved successfully!');
          }
        } catch (err) {
          alert('Failed to save resume');
        } finally {
          setSaving(false);
        }
      };
      
      const handleDelete = async (id) => {
        if (!confirm('Delete this tailored resume?')) return;
        
        try {
          await fetch(\`/api/tailored-resumes/\${id}\`, { method: 'DELETE', credentials: 'include' });
          setSavedResumes(prev => prev.filter(r => r.id !== id));
        } catch (err) {
          alert('Failed to delete');
        }
      };
      
      // Premium upgrade prompt
      if (!isPremium) {
        return (
          <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto' }}>
            <div style={{
              background: 'linear-gradient(135deg, rgba(236,72,153,0.15), rgba(139,92,246,0.15))',
              border: '1px solid rgba(236,72,153,0.3)',
              borderRadius: '20px',
              padding: '50px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '60px', marginBottom: '20px' }}>🎯</div>
              <h2 style={{ fontSize: '28px', marginBottom: '15px', background: 'linear-gradient(135deg, #EC4899, #8B5CF6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                AI Resume Tailor
              </h2>
              <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.7)', marginBottom: '30px', maxWidth: '500px', margin: '0 auto 30px' }}>
                Create perfectly tailored resumes for every job application. Our AI analyzes job descriptions and customizes your resume to maximize your chances of landing interviews.
              </p>
              
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
                gap: '20px', 
                marginBottom: '40px',
                textAlign: 'left'
              }}>
                {[
                  { icon: '🔍', title: 'Keyword Optimization', desc: 'Match exact ATS keywords' },
                  { icon: '✨', title: 'Smart Reframing', desc: 'Highlight relevant experience' },
                  { icon: '📊', title: 'Match Score', desc: 'See how well you fit' },
                  { icon: '💡', title: 'Interview Tips', desc: 'Prep for tough questions' }
                ].map((f, i) => (
                  <div key={i} style={{ 
                    background: 'rgba(0,0,0,0.3)', 
                    padding: '20px', 
                    borderRadius: '12px',
                    border: '1px solid rgba(255,255,255,0.1)'
                  }}>
                    <div style={{ fontSize: '24px', marginBottom: '8px' }}>{f.icon}</div>
                    <div style={{ fontWeight: '600', marginBottom: '4px' }}>{f.title}</div>
                    <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)' }}>{f.desc}</div>
                  </div>
                ))}
              </div>
              
              <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
                <button
                  onClick={() => window.location.href = '/?upgrade=pro'}
                  style={{
                    padding: '15px 40px',
                    fontSize: '16px',
                    fontWeight: '600',
                    background: 'linear-gradient(135deg, #EC4899, #8B5CF6)',
                    border: 'none',
                    borderRadius: '12px',
                    color: 'white',
                    cursor: 'pointer'
                  }}
                >
                  Upgrade to Pro - $9.99/mo
                </button>
                <button
                  onClick={() => setView(VIEW.PREVIEW)}
                  style={{
                    padding: '15px 30px',
                    fontSize: '14px',
                    background: 'transparent',
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: '12px',
                    color: 'rgba(255,255,255,0.6)',
                    cursor: 'pointer'
                  }}
                >
                  Back to Preview
                </button>
              </div>
            </div>
          </div>
        );
      }
      
      return (
        <div style={{ padding: '30px', maxWidth: '1400px', margin: '0 auto' }}>
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
            <div>
              <h1 style={{ 
                fontSize: '28px', 
                fontWeight: '700',
                background: 'linear-gradient(135deg, #EC4899, #8B5CF6)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                marginBottom: '5px'
              }}>
                <i className="fas fa-magic" style={{ marginRight: '10px' }}></i>
                AI Resume Tailor
              </h1>
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px' }}>
                Paste a job description and get a perfectly tailored resume in seconds
              </p>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => setView(VIEW.PREVIEW)}
                style={{
                  padding: '10px 20px',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '10px',
                  color: 'white',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <i className="fas fa-arrow-left"></i>
                Back to Preview
              </button>
              <button
                onClick={() => setShowSaved(!showSaved)}
                style={{
                  padding: '10px 20px',
                  background: showSaved ? 'rgba(139,92,246,0.2)' : 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '10px',
                  color: 'white',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <i className="fas fa-folder-open"></i>
                Saved ({savedResumes.length})
              </button>
            </div>
          </div>
          
          {/* Saved Resumes Panel */}
          {showSaved && (
            <div style={{
              background: 'rgba(0,0,0,0.3)',
              borderRadius: '16px',
              padding: '20px',
              marginBottom: '30px',
              border: '1px solid rgba(255,255,255,0.1)'
            }}>
              <h3 style={{ marginBottom: '15px', fontSize: '16px' }}>
                <i className="fas fa-history" style={{ marginRight: '10px', color: '#8B5CF6' }}></i>
                Saved Tailored Resumes
              </h3>
              {savedResumes.length === 0 ? (
                <p style={{ color: 'rgba(255,255,255,0.4)', textAlign: 'center', padding: '30px' }}>
                  No saved resumes yet. Tailor your first resume below!
                </p>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '15px' }}>
                  {savedResumes.map(resume => (
                    <div key={resume.id} style={{
                      background: 'rgba(255,255,255,0.05)',
                      borderRadius: '12px',
                      padding: '15px',
                      border: '1px solid rgba(255,255,255,0.1)'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                        <div>
                          <div style={{ fontWeight: '600', marginBottom: '4px' }}>{resume.jobTitle}</div>
                          <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)' }}>{resume.company}</div>
                        </div>
                        <div style={{
                          background: resume.matchScore >= 80 ? 'rgba(16,185,129,0.2)' : resume.matchScore >= 60 ? 'rgba(245,158,11,0.2)' : 'rgba(239,68,68,0.2)',
                          color: resume.matchScore >= 80 ? '#10B981' : resume.matchScore >= 60 ? '#F59E0B' : '#EF4444',
                          padding: '4px 10px',
                          borderRadius: '20px',
                          fontSize: '12px',
                          fontWeight: '600'
                        }}>
                          {resume.matchScore}%
                        </div>
                      </div>
                      <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)', marginTop: '10px' }}>
                        {new Date(resume.createdAt).toLocaleDateString()}
                      </div>
                      <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                        <button
                          onClick={() => setResult({ tailoredProfile: resume.tailoredProfile, matchAnalysis: resume.matchAnalysis, coverLetterHints: resume.coverLetterHints, interviewTips: resume.interviewTips, metadata: { jobTitle: resume.jobTitle, company: resume.company } })}
                          style={{ flex: 1, padding: '8px', background: 'rgba(139,92,246,0.2)', border: 'none', borderRadius: '8px', color: '#A78BFA', cursor: 'pointer', fontSize: '12px' }}
                        >
                          <i className="fas fa-eye"></i> View
                        </button>
                        <button
                          onClick={() => handleDelete(resume.id)}
                          style={{ padding: '8px 12px', background: 'rgba(239,68,68,0.1)', border: 'none', borderRadius: '8px', color: '#EF4444', cursor: 'pointer', fontSize: '12px' }}
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          
          <div style={{ display: 'grid', gridTemplateColumns: result ? '1fr 1fr' : '1fr', gap: '30px' }}>
            {/* Input Section */}
            <div style={{
              background: 'rgba(0,0,0,0.3)',
              borderRadius: '16px',
              padding: '25px',
              border: '1px solid rgba(255,255,255,0.1)'
            }}>
              <h3 style={{ marginBottom: '20px', fontSize: '16px' }}>
                <i className="fas fa-paste" style={{ marginRight: '10px', color: '#EC4899' }}></i>
                Job Details
              </h3>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>
                    Job Title
                  </label>
                  <input
                    type="text"
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    placeholder="e.g., Senior Product Manager"
                    style={{
                      width: '100%',
                      padding: '12px',
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '10px',
                      color: 'white',
                      fontSize: '14px'
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>
                    Company
                  </label>
                  <input
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="e.g., Google, Stripe, etc."
                    style={{
                      width: '100%',
                      padding: '12px',
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '10px',
                      color: 'white',
                      fontSize: '14px'
                    }}
                  />
                </div>
              </div>
              
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>
                  Job Posting URL (optional)
                </label>
                <input
                  type="url"
                  value={jobUrl}
                  onChange={(e) => setJobUrl(e.target.value)}
                  placeholder="https://..."
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '10px',
                    color: 'white',
                    fontSize: '14px'
                  }}
                />
              </div>
              
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>
                  Job Description *
                </label>
                <textarea
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste the full job description here...

Include:
• Responsibilities
• Requirements
• Qualifications
• Nice-to-haves

The more detail, the better the tailored resume!"
                  style={{
                    width: '100%',
                    minHeight: '300px',
                    padding: '15px',
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '10px',
                    color: 'white',
                    fontSize: '14px',
                    resize: 'vertical',
                    lineHeight: '1.6'
                  }}
                />
              </div>
              
              {error && error.message && (
                <div style={{
                  background: 'rgba(239,68,68,0.1)',
                  border: '1px solid rgba(239,68,68,0.3)',
                  borderRadius: '10px',
                  padding: '15px',
                  marginBottom: '20px',
                  color: '#EF4444'
                }}>
                  <i className="fas fa-exclamation-circle" style={{ marginRight: '8px' }}></i>
                  {error.message}
                </div>
              )}
              
              <button
                onClick={handleTailor}
                disabled={loading || !jobDescription.trim()}
                style={{
                  width: '100%',
                  padding: '15px',
                  background: loading ? 'rgba(139,92,246,0.3)' : 'linear-gradient(135deg, #EC4899, #8B5CF6)',
                  border: 'none',
                  borderRadius: '12px',
                  color: 'white',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px'
                }}
              >
                {loading ? (
                  <>
                    <i className="fas fa-spinner fa-spin"></i>
                    Tailoring Your Resume...
                  </>
                ) : (
                  <>
                    <i className="fas fa-magic"></i>
                    Tailor My Resume
                  </>
                )}
              </button>
            </div>
            
            {/* Result Section */}
            {result && (
              <div style={{
                background: 'rgba(0,0,0,0.3)',
                borderRadius: '16px',
                padding: '25px',
                border: '1px solid rgba(16,185,129,0.3)',
                maxHeight: 'calc(100vh - 200px)',
                overflowY: 'auto'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <h3 style={{ fontSize: '16px' }}>
                    <i className="fas fa-check-circle" style={{ marginRight: '10px', color: '#10B981' }}></i>
                    Tailored Resume
                  </h3>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    style={{
                      padding: '8px 16px',
                      background: 'rgba(16,185,129,0.2)',
                      border: '1px solid rgba(16,185,129,0.3)',
                      borderRadius: '8px',
                      color: '#10B981',
                      cursor: 'pointer',
                      fontSize: '13px'
                    }}
                  >
                    {saving ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-save"></i>}
                    {' '}Save
                  </button>
                </div>
                
                {/* Match Score */}
                {result.matchAnalysis && (
                  <div style={{
                    background: 'linear-gradient(135deg, rgba(16,185,129,0.1), rgba(6,182,212,0.1))',
                    borderRadius: '12px',
                    padding: '20px',
                    marginBottom: '20px',
                    textAlign: 'center'
                  }}>
                    <div style={{ 
                      fontSize: '48px', 
                      fontWeight: '700',
                      color: result.matchAnalysis.overallScore >= 80 ? '#10B981' : result.matchAnalysis.overallScore >= 60 ? '#F59E0B' : '#EF4444'
                    }}>
                      {result.matchAnalysis.overallScore}%
                    </div>
                    <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px' }}>Match Score</div>
                    
                    {result.matchAnalysis.matchedKeywords?.length > 0 && (
                      <div style={{ marginTop: '15px' }}>
                        <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', marginBottom: '8px' }}>Matched Keywords</div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', justifyContent: 'center' }}>
                          {result.matchAnalysis.matchedKeywords.slice(0, 8).map((kw, i) => (
                            <span key={i} style={{
                              background: 'rgba(16,185,129,0.2)',
                              padding: '4px 10px',
                              borderRadius: '20px',
                              fontSize: '11px',
                              color: '#10B981'
                            }}>{kw}</span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
                
                {/* Tailored Summary */}
                {result.tailoredProfile?.basics && (
                  <div style={{ marginBottom: '20px' }}>
                    <h4 style={{ fontSize: '14px', marginBottom: '10px', color: 'rgba(255,255,255,0.6)' }}>
                      <i className="fas fa-user" style={{ marginRight: '8px' }}></i>
                      Tailored Summary
                    </h4>
                    <div style={{
                      background: 'rgba(255,255,255,0.05)',
                      borderRadius: '10px',
                      padding: '15px'
                    }}>
                      <div style={{ fontWeight: '600', marginBottom: '5px' }}>{result.tailoredProfile.basics.title}</div>
                      <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)', lineHeight: '1.6' }}>
                        {result.tailoredProfile.basics.summary}
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Cover Letter Hints */}
                {result.coverLetterHints?.length > 0 && (
                  <div style={{ marginBottom: '20px' }}>
                    <h4 style={{ fontSize: '14px', marginBottom: '10px', color: 'rgba(255,255,255,0.6)' }}>
                      <i className="fas fa-envelope" style={{ marginRight: '8px' }}></i>
                      Cover Letter Tips
                    </h4>
                    <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '10px', padding: '15px' }}>
                      {result.coverLetterHints.map((hint, i) => (
                        <div key={i} style={{ 
                          display: 'flex', 
                          gap: '10px', 
                          marginBottom: i < result.coverLetterHints.length - 1 ? '10px' : 0,
                          fontSize: '13px',
                          color: 'rgba(255,255,255,0.7)'
                        }}>
                          <span style={{ color: '#8B5CF6' }}>•</span>
                          {hint}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Interview Tips */}
                {result.interviewTips?.length > 0 && (
                  <div>
                    <h4 style={{ fontSize: '14px', marginBottom: '10px', color: 'rgba(255,255,255,0.6)' }}>
                      <i className="fas fa-comments" style={{ marginRight: '8px' }}></i>
                      Interview Prep
                    </h4>
                    <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '10px', padding: '15px' }}>
                      {result.interviewTips.map((tip, i) => (
                        <div key={i} style={{ 
                          display: 'flex', 
                          gap: '10px', 
                          marginBottom: i < result.interviewTips.length - 1 ? '10px' : 0,
                          fontSize: '13px',
                          color: 'rgba(255,255,255,0.7)'
                        }}>
                          <span style={{ color: '#EC4899' }}>•</span>
                          {tip}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      );
    };
    
    // Preview View with Template Support - ENHANCED for all 10 templates
    // Known company domain mappings for automatic logo lookup (for PreviewView)
    const KNOWN_COMPANY_DOMAINS_PREVIEW = {
      'in the house productions': 'inthehouseproductions.com',
      'in the house production': 'inthehouseproductions.com',
      'in house productions': 'inthehouseproductions.com',
      'inthehouseproductions': 'inthehouseproductions.com',
      'in-the-house productions': 'inthehouseproductions.com',
      'the house productions': 'inthehouseproductions.com',
      'house productions': 'inthehouseproductions.com',
      'google': 'google.com',
      'stripe': 'stripe.com',
      'salesforce': 'salesforce.com',
      'amazon': 'amazon.com',
      'microsoft': 'microsoft.com',
      'apple': 'apple.com',
      'meta': 'meta.com',
      'facebook': 'facebook.com',
      'netflix': 'netflix.com',
      'walmart': 'walmart.com',
      'target': 'target.com',
      'starbucks': 'starbucks.com',
      'mcdonalds': 'mcdonalds.com',
      "mcdonald's": 'mcdonalds.com',
      'publix': 'publix.com',
      'cvs': 'cvs.com',
      'walgreens': 'walgreens.com',
      'bank of america': 'bankofamerica.com',
      'wells fargo': 'wellsfargo.com',
      'chase': 'chase.com',
      'jpmorgan': 'jpmorgan.com',
      'citibank': 'citibank.com',
    };
    
    // Local static logo mappings - for companies without good external logos
    const LOCAL_LOGOS_PREVIEW = {
      'in the house productions': '/static/inthehouse-logo.png',
      'in the house production': '/static/inthehouse-logo.png',
      'in house productions': '/static/inthehouse-logo.png',
      'inthehouseproductions': '/static/inthehouse-logo.png',
      'in-the-house productions': '/static/inthehouse-logo.png',
      'the house productions': '/static/inthehouse-logo.png',
      'house productions': '/static/inthehouse-logo.png',
      'chapters health system': '/static/chapters-health-logo.png',
      'chapters health': '/static/chapters-health-logo.png',
      'chapters': '/static/chapters-health-logo.png',
    };
    
    const getLocalLogoForPreview = (companyName) => {
      if (!companyName) return null;
      const lowerName = companyName.toLowerCase().trim();
      if (LOCAL_LOGOS_PREVIEW[lowerName]) return LOCAL_LOGOS_PREVIEW[lowerName];
      for (const [key, path] of Object.entries(LOCAL_LOGOS_PREVIEW)) {
        if (lowerName.includes(key) || key.includes(lowerName)) return path;
      }
      return null;
    };
    
    // Helper to get domain from company name
    const getCompanyDomain = (companyName, existingDomain) => {
      if (existingDomain) return existingDomain;
      if (!companyName) return null;
      const lowerName = companyName.toLowerCase().trim();
      // Check exact match first
      if (KNOWN_COMPANY_DOMAINS_PREVIEW[lowerName]) return KNOWN_COMPANY_DOMAINS_PREVIEW[lowerName];
      // Check partial matches
      for (const [key, domain] of Object.entries(KNOWN_COMPANY_DOMAINS_PREVIEW)) {
        if (lowerName.includes(key) || key.includes(lowerName)) {
          return domain;
        }
      }
      return null;
    };
    
    const PreviewView = ({ profile, setView, profilePhoto, selectedTemplate, slug, isPublic, setIsPublic, profileViews, setProfile }) => {
      console.log('🎨 PreviewView rendering with:', { profile, selectedTemplate, slug, isPublic });
      
      // Safety check - ensure profile has required structure
      if (!profile || !profile.basics) {
        console.log('⚠️ PreviewView - profile or basics missing:', { profile, basics: profile?.basics });
        return (
          <div style={{ padding: '40px', textAlign: 'center' }}>
            <div style={{ fontSize: '60px', marginBottom: '20px' }}>⚠️</div>
            <h2 style={{ fontSize: '24px', marginBottom: '10px', color: '#fff' }}>Profile Not Ready</h2>
            <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '20px' }}>
              Your profile data is incomplete. Please go back and fill in your information.
            </p>
            <button 
              className="btn btn-primary" 
              onClick={() => setView(VIEW.BUILDER)}
              style={{ padding: '12px 24px' }}
            >
              <i className="fas fa-arrow-left" style={{ marginRight: '8px' }}></i>
              Back to Builder
            </button>
          </div>
        );
      }
      
      // Ensure experience array exists
      if (!profile.experience) {
        profile.experience = [];
      }
      
      const template = TEMPLATES.find(t => t.id === selectedTemplate) || TEMPLATES[0];
      const [showPublishModal, setShowPublishModal] = useState(false);
      const [publishing, setPublishing] = useState(false);
      const [qrCode, setQrCode] = useState(null);
      const [atsScore, setAtsScore] = useState(null);
      const [showAtsModal, setShowAtsModal] = useState(false);
      const [selectedEmployer, setSelectedEmployer] = useState(null); // For employer detail page
      const [hoveredExp, setHoveredExp] = useState(null); // For hover effect
      
      // Update experience data when editing in employer detail page
      const updateExperienceField = (expId, field, value) => {
        const updatedExperience = profile.experience.map(exp => 
          exp.id === expId ? { ...exp, [field]: value } : exp
        );
        setProfile({ ...profile, experience: updatedExperience });
      };
      
      const publicUrl = window.location.origin + '/p/' + slug;
      
      // Generate QR code when modal opens
      useEffect(() => {
        if (showPublishModal && window.QRCode && slug) {
          QRCode.toDataURL(publicUrl, { width: 200, margin: 2 })
            .then(url => setQrCode(url))
            .catch(() => {});
        }
      }, [showPublishModal, slug]);
      
      const handlePublish = async () => {
        setPublishing(true);
        try {
          const res = await fetch('/api/profile/publish', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ isPublic: !isPublic })
          });
          const data = await res.json();
          if (data.success) {
            setIsPublic(!isPublic);
          }
        } catch (e) {
          alert('Failed to update publish status');
        }
        setPublishing(false);
      };
      
      const copyLink = () => {
        navigator.clipboard.writeText(publicUrl);
        alert('Link copied to clipboard!');
      };
      
      const shareProfile = (platform) => {
        const text = encodeURIComponent(profile.basics?.name + ' - Professional Profile');
        const url = encodeURIComponent(publicUrl);
        const links = {
          linkedin: 'https://www.linkedin.com/sharing/share-offsite/?url=' + url,
          twitter: 'https://twitter.com/intent/tweet?text=' + text + '&url=' + url,
          email: 'mailto:?subject=' + text + '&body=Check out my professional profile: ' + publicUrl
        };
        window.open(links[platform], '_blank');
      };
      
      const checkAtsScore = async () => {
        setShowAtsModal(true);
        try {
          const res = await fetch('/api/ats-score', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ profile })
          });
          const data = await res.json();
          setAtsScore(data);
        } catch (e) {
          setAtsScore({ error: 'Failed to analyze profile' });
        }
      };
      
      // Use template's own gradient and color
      const styles = {
        accent: template.color,
        gradient: template.gradient,
        cardBg: template.color + '12',
        border: template.color + '30'
      };
      
      return (
        <div>
          {/* Publish Modal */}
          {showPublishModal && (
            <div style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0,0,0,0.85)',
              zIndex: 10000,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '20px'
            }} onClick={() => setShowPublishModal(false)}>
              <div onClick={e => e.stopPropagation()} style={{
                background: 'linear-gradient(135deg, #1a1a2e, #0f0f1a)',
                borderRadius: '24px',
                padding: '36px',
                maxWidth: '500px',
                width: '100%',
                border: '1px solid rgba(139,92,246,0.3)'
              }}>
                <h2 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '8px', color: '#fff' }}>
                  <i className="fas fa-share-alt" style={{ marginRight: '12px', color: 'var(--purple-main)' }}></i>
                  Share Your Profile
                </h2>
                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px', marginBottom: '28px' }}>
                  Make your profile public and share it with recruiters
                </p>
                
                {/* Public Toggle */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '20px',
                  background: isPublic ? 'rgba(16,185,129,0.1)' : 'rgba(255,255,255,0.03)',
                  borderRadius: '14px',
                  marginBottom: '24px',
                  border: '1px solid ' + (isPublic ? 'rgba(16,185,129,0.3)' : 'rgba(255,255,255,0.08)')
                }}>
                  <div>
                    <h4 style={{ fontSize: '15px', fontWeight: '600', color: '#fff', marginBottom: '4px' }}>
                      {isPublic ? '🌐 Profile is Public' : '🔒 Profile is Private'}
                    </h4>
                    <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>
                      {isPublic ? 'Anyone with the link can view' : 'Only you can see your profile'}
                    </p>
                  </div>
                  <button
                    onClick={handlePublish}
                    disabled={publishing}
                    style={{
                      padding: '10px 20px',
                      borderRadius: '10px',
                      border: 'none',
                      background: isPublic ? 'rgba(239,68,68,0.2)' : 'var(--green-main)',
                      color: isPublic ? '#EF4444' : '#fff',
                      fontWeight: '600',
                      fontSize: '13px',
                      cursor: 'pointer'
                    }}
                  >
                    {publishing ? '...' : isPublic ? 'Make Private' : 'Publish'}
                  </button>
                </div>
                
                {/* URL and QR */}
                {isPublic && (
                  <>
                    <div style={{ marginBottom: '24px' }}>
                      <label style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', marginBottom: '8px', display: 'block' }}>
                        Your Public URL
                      </label>
                      <div style={{ display: 'flex', gap: '10px' }}>
                        <input
                          value={publicUrl}
                          readOnly
                          style={{
                            flex: 1,
                            padding: '14px',
                            background: 'rgba(255,255,255,0.05)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: '10px',
                            color: '#fff',
                            fontSize: '13px'
                          }}
                        />
                        <button onClick={copyLink} style={{
                          padding: '14px 20px',
                          background: 'var(--purple-main)',
                          border: 'none',
                          borderRadius: '10px',
                          color: '#fff',
                          cursor: 'pointer'
                        }}>
                          <i className="fas fa-copy"></i>
                        </button>
                      </div>
                    </div>
                    
                    {/* QR Code */}
                    {qrCode && (
                      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                        <img src={qrCode} style={{ borderRadius: '12px', background: '#fff', padding: '10px' }} alt="QR Code" />
                        <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', marginTop: '8px' }}>Scan to view profile</p>
                      </div>
                    )}
                    
                    {/* Social Share */}
                    <div>
                      <label style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', marginBottom: '12px', display: 'block' }}>
                        Share on
                      </label>
                      <div style={{ display: 'flex', gap: '12px' }}>
                        <button onClick={() => shareProfile('linkedin')} style={{
                          flex: 1,
                          padding: '14px',
                          background: '#0A66C2',
                          border: 'none',
                          borderRadius: '10px',
                          color: '#fff',
                          fontWeight: '600',
                          cursor: 'pointer',
                          fontSize: '13px'
                        }}>
                          <i className="fab fa-linkedin" style={{ marginRight: '8px' }}></i>LinkedIn
                        </button>
                        <button onClick={() => shareProfile('twitter')} style={{
                          flex: 1,
                          padding: '14px',
                          background: '#1DA1F2',
                          border: 'none',
                          borderRadius: '10px',
                          color: '#fff',
                          fontWeight: '600',
                          cursor: 'pointer',
                          fontSize: '13px'
                        }}>
                          <i className="fab fa-twitter" style={{ marginRight: '8px' }}></i>Twitter
                        </button>
                        <button onClick={() => shareProfile('email')} style={{
                          flex: 1,
                          padding: '14px',
                          background: 'rgba(255,255,255,0.1)',
                          border: 'none',
                          borderRadius: '10px',
                          color: '#fff',
                          fontWeight: '600',
                          cursor: 'pointer',
                          fontSize: '13px'
                        }}>
                          <i className="fas fa-envelope" style={{ marginRight: '8px' }}></i>Email
                        </button>
                      </div>
                    </div>
                  </>
                )}
                
                {/* View Stats */}
                {isPublic && profileViews > 0 && (
                  <div style={{ marginTop: '20px', textAlign: 'center', padding: '14px', background: 'rgba(139,92,246,0.1)', borderRadius: '10px' }}>
                    <span style={{ fontSize: '24px', fontWeight: '800', color: 'var(--purple-main)' }}>{profileViews}</span>
                    <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', marginLeft: '8px' }}>profile views</span>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {/* ATS Score Modal */}
          {showAtsModal && (
            <div style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0,0,0,0.85)',
              zIndex: 10000,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '20px'
            }} onClick={() => setShowAtsModal(false)}>
              <div onClick={e => e.stopPropagation()} style={{
                background: 'linear-gradient(135deg, #1a1a2e, #0f0f1a)',
                borderRadius: '24px',
                padding: '36px',
                maxWidth: '500px',
                width: '100%',
                border: '1px solid rgba(6,182,212,0.3)'
              }}>
                <h2 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '8px', color: '#fff' }}>
                  <i className="fas fa-chart-line" style={{ marginRight: '12px', color: 'var(--cyan-main)' }}></i>
                  ATS Compatibility Score
                </h2>
                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px', marginBottom: '28px' }}>
                  See how well your profile matches ATS requirements
                </p>
                
                {!atsScore ? (
                  <div style={{ textAlign: 'center', padding: '40px' }}>
                    <i className="fas fa-spinner fa-spin" style={{ fontSize: '32px', color: 'var(--cyan-main)' }}></i>
                    <p style={{ marginTop: '16px', color: 'rgba(255,255,255,0.5)' }}>Analyzing your profile...</p>
                  </div>
                ) : atsScore.error ? (
                  <p style={{ color: '#EF4444' }}>{atsScore.error}</p>
                ) : (
                  <>
                    {/* Score Circle */}
                    <div style={{ textAlign: 'center', marginBottom: '28px' }}>
                      <div style={{
                        width: '120px',
                        height: '120px',
                        borderRadius: '50%',
                        background: 'conic-gradient(var(--cyan-main) ' + (atsScore.score * 3.6) + 'deg, rgba(255,255,255,0.1) 0deg)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto'
                      }}>
                        <div style={{
                          width: '100px',
                          height: '100px',
                          borderRadius: '50%',
                          background: '#1a1a2e',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexDirection: 'column'
                        }}>
                          <span style={{ fontSize: '32px', fontWeight: '800', color: 'var(--cyan-main)' }}>{atsScore.score}</span>
                          <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>/ 100</span>
                        </div>
                      </div>
                      <p style={{ marginTop: '12px', fontSize: '18px', fontWeight: '700', color: atsScore.score >= 80 ? 'var(--green-main)' : atsScore.score >= 60 ? '#F59E0B' : '#EF4444' }}>
                        Grade: {atsScore.grade}
                      </p>
                    </div>
                    
                    {/* Keywords Found */}
                    {atsScore.matches?.length > 0 && (
                      <div style={{ marginBottom: '20px' }}>
                        <h4 style={{ fontSize: '13px', color: 'var(--green-main)', marginBottom: '10px' }}>
                          <i className="fas fa-check-circle" style={{ marginRight: '8px' }}></i>Keywords Found
                        </h4>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                          {atsScore.matches.map((k, i) => (
                            <span key={i} style={{ padding: '6px 12px', background: 'rgba(16,185,129,0.15)', borderRadius: '6px', fontSize: '12px', color: 'var(--green-main)' }}>{k}</span>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* Suggestions */}
                    {atsScore.tips?.length > 0 && (
                      <div>
                        <h4 style={{ fontSize: '13px', color: '#F59E0B', marginBottom: '10px' }}>
                          <i className="fas fa-lightbulb" style={{ marginRight: '8px' }}></i>Suggestions
                        </h4>
                        <ul style={{ paddingLeft: '20px', color: 'rgba(255,255,255,0.7)', fontSize: '13px', lineHeight: '1.8' }}>
                          {atsScore.tips.map((tip, i) => <li key={i}>{tip}</li>)}
                        </ul>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          )}
          
          <div className="glass preview-header">
            <div>
              <h1 className="page-title">Live Preview</h1>
              <p className="page-desc">
                <span style={{ 
                  display: 'inline-flex', 
                  alignItems: 'center', 
                  gap: '8px',
                  padding: '4px 12px',
                  background: styles.accent + '20',
                  borderRadius: '100px',
                  fontSize: '12px',
                  color: styles.accent,
                  fontWeight: '600'
                }}>
                  <i className={'fas ' + template.icon}></i>
                  {template.name} Template
                </span>
                {isPublic && (
                  <span style={{ 
                    marginLeft: '10px',
                    padding: '4px 12px',
                    background: 'rgba(16,185,129,0.2)',
                    borderRadius: '100px',
                    fontSize: '12px',
                    color: 'var(--green-main)',
                    fontWeight: '600'
                  }}>
                    <i className="fas fa-globe" style={{ marginRight: '6px' }}></i>Public
                  </span>
                )}
              </p>
            </div>
            <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
              <button className="btn btn-secondary" onClick={checkAtsScore}>
                <i className="fas fa-chart-line"></i> ATS Score
              </button>
              <button className="btn btn-secondary" onClick={() => setView(VIEW.BUILDER)}>
                <i className="fas fa-edit"></i> Edit
              </button>
              <button className="btn btn-secondary" onClick={() => setView(VIEW.TAILOR)} style={{ 
                background: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)',
                border: 'none',
                color: '#fff'
              }}>
                <i className="fas fa-magic"></i> AI Tailor
              </button>
              <button className="btn btn-primary" style={{ background: styles.gradient }} onClick={() => setShowPublishModal(true)}>
                <i className="fas fa-share"></i> {isPublic ? 'Share' : 'Publish'}
              </button>
            </div>
          </div>
          
          {/* Profile Hero with Photo Support */}
          <div className="glass-card profile-hero" style={{ borderTop: '4px solid ' + styles.accent }}>
            {profilePhoto ? (
              <div style={{
                width: '130px',
                height: '130px',
                margin: '0 auto 24px',
                borderRadius: '32px',
                overflow: 'hidden',
                border: '4px solid ' + styles.accent,
                boxShadow: '0 20px 50px ' + styles.accent + '40'
              }}>
                <img src={profilePhoto} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            ) : (
              <div className="profile-avatar" style={{ background: styles.gradient }}>
                {profile.basics.name
                  ? profile.basics.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
                  : '?'}
              </div>
            )}
            <h1 className="profile-name">{profile.basics.name || 'Your Name'}</h1>
            <p className="profile-title" style={{ color: styles.accent }}>{profile.basics.title || 'Your Title'}</p>
            <p className="profile-tagline">{profile.basics.tagline || 'Your professional tagline'}</p>
            
            {profile.basics.summary && (
              <p style={{ 
                color: 'rgba(255,255,255,0.6)', 
                maxWidth: '600px', 
                margin: '18px auto 0', 
                fontSize: '14px',
                lineHeight: '1.8',
                fontStyle: 'italic'
              }}>
                "{profile.basics.summary}"
              </p>
            )}
            
            {/* Contact Info */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '18px', justifyContent: 'center', marginTop: '28px' }}>
              {profile.basics.email && (
                <a href={'mailto:' + profile.basics.email} style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'rgba(255,255,255,0.6)', fontSize: '13px', textDecoration: 'none' }}>
                  <i className="fas fa-envelope" style={{ color: styles.accent }}></i>
                  {profile.basics.email}
                </a>
              )}
              {profile.basics.phone && (
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'rgba(255,255,255,0.6)', fontSize: '13px' }}>
                  <i className="fas fa-phone" style={{ color: styles.accent }}></i>
                  {profile.basics.phone}
                </span>
              )}
              {profile.basics.location && (
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'rgba(255,255,255,0.6)', fontSize: '13px' }}>
                  <i className="fas fa-map-marker-alt" style={{ color: styles.accent }}></i>
                  {profile.basics.location}
                </span>
              )}
              {profile.basics.linkedin && (
                <a href={'https://' + profile.basics.linkedin.replace(/^https?:\\/\\//, '')} target="_blank" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'rgba(255,255,255,0.6)', fontSize: '13px', textDecoration: 'none' }}>
                  <i className="fab fa-linkedin" style={{ color: styles.accent }}></i>
                  LinkedIn
                </a>
              )}
            </div>
            
            {profile.skills.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center', marginTop: '28px' }}>
                {profile.skills.slice(0, 10).map((skill, idx) => (
                  <span key={idx} style={{
                    padding: '8px 16px',
                    background: styles.accent + '15',
                    border: '1px solid ' + styles.accent + '30',
                    borderRadius: '100px',
                    fontSize: '12px',
                    fontWeight: '500',
                    color: styles.accent
                  }}>{typeof skill === 'string' ? skill : skill.name || skill}</span>
                ))}
                {profile.skills.length > 10 && (
                  <span style={{
                    padding: '8px 16px',
                    background: 'rgba(255,255,255,0.05)',
                    borderRadius: '100px',
                    fontSize: '12px',
                    color: 'rgba(255,255,255,0.4)'
                  }}>+{profile.skills.length - 10} more</span>
                )}
              </div>
            )}
          </div>
          
          {/* Employer Detail Page Modal */}
          {selectedEmployer && (
            <EmployerDetailPage
              experience={selectedEmployer}
              onClose={() => setSelectedEmployer(null)}
              template={template}
              isEditing={true}
              onUpdate={(field, value) => updateExperienceField(selectedEmployer.id, field, value)}
            />
          )}
          
          {/* Career Timeline - INTERACTIVE */}
          {profile.experience.length > 0 && (
            <div className="glass-card" style={{ padding: '28px', marginTop: '24px' }}>
              <h2 style={{ fontSize: '22px', fontWeight: '700', marginBottom: '8px', color: '#fff', fontFamily: 'Space Grotesk, sans-serif' }}>
                <i className="fas fa-briefcase" style={{ marginRight: '14px', color: styles.accent }}></i>
                Career Timeline
              </h2>
              <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', marginBottom: '28px' }}>
                <i className="fas fa-hand-pointer" style={{ marginRight: '8px' }}></i>
                Click on any experience to explore the full story
              </p>
              
              <div className="timeline-wrap" style={{ '--timeline-color': styles.accent }}>
                {profile.experience.map((exp, idx) => {
                  // Use customLogo first, then logoUrl, then local static logo, then try logo.dev API with domain
                  const timelineLocalLogo = getLocalLogoForPreview(exp.company);
                  const timelineDomain = getCompanyDomain(exp.company, exp.companyInfo?.domain);
                  const displayLogo = exp.customLogo || exp.logoUrl || timelineLocalLogo || (timelineDomain ? \`https://img.logo.dev/\${timelineDomain}?token=pk_X-1ZO13GSgeOoUrIuJ6GMQ\` : null);
                  const isHovered = hoveredExp === exp.id;
                  const hasRichContent = (exp.projects?.length > 0) || (exp.victories?.length > 0) || 
                                         (exp.challenges?.length > 0) || (exp.photos?.length > 0) || 
                                         (exp.videos?.length > 0) || (exp.reviews?.length > 0);
                  return (
                  <div 
                    key={exp.id} 
                    className="glass timeline-item"
                    onClick={() => setSelectedEmployer(exp)}
                    onMouseEnter={() => setHoveredExp(exp.id)}
                    onMouseLeave={() => setHoveredExp(null)}
                    style={{
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      transform: isHovered ? 'translateX(8px) scale(1.01)' : 'none',
                      boxShadow: isHovered ? \`0 10px 40px \${styles.accent}30\` : 'none',
                      borderLeft: isHovered ? \`4px solid \${styles.accent}\` : '4px solid transparent'
                    }}
                  >
                    {/* Click Indicator */}
                    <div style={{
                      position: 'absolute',
                      top: '16px',
                      right: '16px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '6px 12px',
                      background: isHovered ? styles.accent : 'rgba(255,255,255,0.05)',
                      borderRadius: '100px',
                      fontSize: '11px',
                      fontWeight: '600',
                      color: isHovered ? '#fff' : 'rgba(255,255,255,0.4)',
                      transition: 'all 0.2s ease'
                    }}>
                      <i className="fas fa-expand-alt"></i>
                      {isHovered ? 'View Details' : 'Expand'}
                    </div>
                    
                    {/* Company Header with Logo */}
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', marginBottom: '16px' }}>
                      {displayLogo && (
                        <div style={{
                          width: '56px',
                          height: '56px',
                          borderRadius: '12px',
                          background: '#fff',
                          border: isHovered ? \`3px solid \${styles.accent}\` : '2px solid rgba(255,255,255,0.2)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          overflow: 'hidden',
                          flexShrink: 0,
                          transition: 'all 0.2s ease'
                        }}>
                          <img 
                            src={displayLogo} 
                            onError={(e) => {
                              // Try DuckDuckGo favicon as fallback
                              const ddgUrl = timelineDomain ? \`https://icons.duckduckgo.com/ip3/\${timelineDomain}.ico\` : null;
                              if (ddgUrl && e.target.src !== ddgUrl) {
                                e.target.src = ddgUrl;
                              } else {
                                e.target.style.display = 'none';
                              }
                            }}
                            style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '6px' }} 
                          />
                        </div>
                      )}
                      {!displayLogo && (
                        <div style={{
                          width: '56px',
                          height: '56px',
                          borderRadius: '12px',
                          background: \`linear-gradient(135deg, \${styles.accent}, #6D28D9)\`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                          color: 'white',
                          fontSize: '20px',
                          fontWeight: '700'
                        }}>
                          {(exp.company || 'C').charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div style={{ flex: 1 }}>
                        <h3 className="timeline-company" style={{ marginBottom: '4px' }}>{exp.company || 'Company'}</h3>
                        <p className="timeline-role" style={{ color: styles.accent, marginBottom: '8px' }}>{exp.role || 'Role'}</p>
                        <span className="timeline-dates" style={{ background: styles.accent + '15', borderColor: styles.accent + '30', color: styles.accent }}>
                          {exp.startDate || 'Start'} — {exp.endDate || 'End'}
                        </span>
                      </div>
                    </div>
                    
                    {/* Company Info Badge */}
                    {exp.companyInfo && (exp.companyInfo.industry || exp.companyInfo.location) && (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '14px' }}>
                        {exp.companyInfo.industry && (
                          <span style={{ padding: '4px 10px', background: 'rgba(255,255,255,0.05)', borderRadius: '6px', fontSize: '11px', color: 'rgba(255,255,255,0.5)' }}>
                            <i className="fas fa-industry" style={{ marginRight: '6px' }}></i>{exp.companyInfo.industry}
                          </span>
                        )}
                        {exp.companyInfo.location && (
                          <span style={{ padding: '4px 10px', background: 'rgba(255,255,255,0.05)', borderRadius: '6px', fontSize: '11px', color: 'rgba(255,255,255,0.5)' }}>
                            <i className="fas fa-map-marker-alt" style={{ marginRight: '6px' }}></i>{exp.companyInfo.location}
                          </span>
                        )}
                      </div>
                    )}
                    
                    {/* Brief Description */}
                    <p className="timeline-desc" style={{ 
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      marginBottom: '16px'
                    }}>
                      {exp.description || 'Click to add details about your role and achievements'}
                    </p>
                    
                    {/* Quick Metrics Preview */}
                    {exp.metrics?.some(m => m.value) && (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '16px' }}>
                        {exp.metrics.filter(m => m.value).slice(0, 3).map((metric, midx) => (
                          <div key={midx} style={{ 
                            padding: '8px 14px', 
                            background: styles.accent + '10', 
                            borderRadius: '8px',
                            border: \`1px solid \${styles.accent}20\`
                          }}>
                            <span style={{ fontSize: '16px', fontWeight: '700', color: styles.accent }}>{metric.value}</span>
                            <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', marginLeft: '6px' }}>{metric.label}</span>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {/* Content Indicators */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                      {exp.responsibilities?.length > 0 && (
                        <span style={{ padding: '4px 10px', background: 'rgba(255,255,255,0.05)', borderRadius: '6px', fontSize: '10px', color: 'rgba(255,255,255,0.4)' }}>
                          <i className="fas fa-tasks" style={{ marginRight: '4px' }}></i>{exp.responsibilities.length} Responsibilities
                        </span>
                      )}
                      {exp.projects?.length > 0 && (
                        <span style={{ padding: '4px 10px', background: 'rgba(139,92,246,0.1)', borderRadius: '6px', fontSize: '10px', color: '#A78BFA' }}>
                          <i className="fas fa-folder" style={{ marginRight: '4px' }}></i>{exp.projects.length} Projects
                        </span>
                      )}
                      {exp.victories?.length > 0 && (
                        <span style={{ padding: '4px 10px', background: 'rgba(245,158,11,0.1)', borderRadius: '6px', fontSize: '10px', color: '#F59E0B' }}>
                          <i className="fas fa-trophy" style={{ marginRight: '4px' }}></i>{exp.victories.length} Victories
                        </span>
                      )}
                      {exp.photos?.length > 0 && (
                        <span style={{ padding: '4px 10px', background: 'rgba(6,182,212,0.1)', borderRadius: '6px', fontSize: '10px', color: '#06B6D4' }}>
                          <i className="fas fa-images" style={{ marginRight: '4px' }}></i>{exp.photos.length} Photos
                        </span>
                      )}
                      {exp.videos?.length > 0 && (
                        <span style={{ padding: '4px 10px', background: 'rgba(236,72,153,0.1)', borderRadius: '6px', fontSize: '10px', color: '#EC4899' }}>
                          <i className="fas fa-video" style={{ marginRight: '4px' }}></i>{exp.videos.length} Videos
                        </span>
                      )}
                      {exp.reviews?.length > 0 && (
                        <span style={{ padding: '4px 10px', background: 'rgba(16,185,129,0.1)', borderRadius: '6px', fontSize: '10px', color: '#10B981' }}>
                          <i className="fas fa-star" style={{ marginRight: '4px' }}></i>{exp.reviews.length} Reviews
                        </span>
                      )}
                    </div>
                  </div>
                  );
                })}
              </div>
            </div>
          )}
          
          {/* Education Section */}
          {profile.education && profile.education.length > 0 && (
            <div className="glass-card" style={{ padding: '28px', marginTop: '24px' }}>
              <h2 style={{ fontSize: '22px', fontWeight: '700', marginBottom: '28px', color: '#fff', fontFamily: 'Space Grotesk, sans-serif' }}>
                <i className="fas fa-graduation-cap" style={{ marginRight: '14px', color: styles.accent }}></i>
                Education
              </h2>
              <div style={{ display: 'grid', gap: '18px' }}>
                {profile.education.map((edu, idx) => (
                  <div key={edu.id || idx} style={{ padding: '20px', background: 'rgba(0,0,0,0.2)', borderRadius: '14px', borderLeft: '4px solid ' + styles.accent }}>
                    <h3 style={{ fontSize: '17px', fontWeight: '700', color: '#fff', marginBottom: '6px' }}>{edu.degree || 'Degree'}</h3>
                    <p style={{ fontSize: '14px', color: styles.accent, marginBottom: '8px' }}>{edu.school || 'School'} • {edu.year || 'Year'}</p>
                    {edu.details && <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)' }}>{edu.details}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Achievements Section */}
          {profile.achievements && profile.achievements.length > 0 && (
            <div className="glass-card" style={{ padding: '28px', marginTop: '24px' }}>
              <h2 style={{ fontSize: '22px', fontWeight: '700', marginBottom: '28px', color: '#fff', fontFamily: 'Space Grotesk, sans-serif' }}>
                <i className="fas fa-trophy" style={{ marginRight: '14px', color: styles.accent }}></i>
                Achievements
              </h2>
              <div style={{ display: 'grid', gap: '18px' }}>
                {profile.achievements.map((ach, idx) => (
                  <div key={ach.id || idx} style={{ padding: '20px', background: 'rgba(0,0,0,0.2)', borderRadius: '14px' }}>
                    <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#fff', marginBottom: '8px' }}>
                      <i className="fas fa-star" style={{ marginRight: '10px', color: styles.accent, fontSize: '14px' }}></i>
                      {ach.title || 'Achievement'}
                    </h3>
                    <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.55)', lineHeight: '1.7' }}>{ach.description || 'Description'}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      );
    };
    
    ReactDOM.createRoot(document.getElementById('root')).render(<App />);
    
    // Register Service Worker for PWA
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/static/sw.js')
          .then(registration => {
            console.log('✅ ServiceWorker registered:', registration.scope);
          })
          .catch(error => {
            console.log('ServiceWorker registration failed:', error);
          });
      });
    }
  </script>
</body>
</html>`)
})

export default app
