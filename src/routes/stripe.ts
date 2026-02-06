import { Hono } from 'hono'
import type { AppEnv } from '../types'
import { STRIPE_PRODUCTS } from '../config/stripe'
import { getCurrentUser } from '../lib/auth'
import { auditLog } from '../lib/security'

const stripe = new Hono<AppEnv>()

// Get pricing plans
stripe.get('/plans', (c) => {
  return c.json({
    plans: Object.values(STRIPE_PRODUCTS).map(p => ({
      id: p.id,
      name: p.name,
      price: p.price,
      priceFormatted: p.price === 0 ? 'Free' : `$${(p.price / 100).toFixed(2)}/mo`,
      features: p.features
    }))
  })
})

// Create checkout session
stripe.post('/create-checkout', async (c) => {
  const user = await getCurrentUser(c)
  if (!user) {
    return c.json({ error: 'Authentication required' }, 401)
  }

  const { planId } = await c.req.json()
  const plan = Object.values(STRIPE_PRODUCTS).find(p => p.id === planId)

  if (!plan || plan.price === 0) {
    return c.json({ error: 'Invalid plan selected' }, 400)
  }

  const stripeKey = c.env.STRIPE_SECRET_KEY
  if (!stripeKey) {
    return c.json({ error: 'Stripe not configured. Please add STRIPE_SECRET_KEY to environment.' }, 500)
  }

  try {
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
    })

    const session: any = await response.json()

    if (session.error) {
      return c.json({ error: session.error.message }, 400)
    }

    await auditLog(c, 'CHECKOUT_CREATED', user.email, { planId: plan.id, sessionId: session.id })

    return c.json({
      sessionId: session.id,
      url: session.url
    })
  } catch (_error: any) {
    return c.json({ error: 'Failed to create checkout session' }, 500)
  }
})

// Stripe webhook handler
stripe.post('/webhook', async (c) => {
  const stripeKey = c.env.STRIPE_SECRET_KEY
  const webhookSecret = c.env.STRIPE_WEBHOOK_SECRET

  if (!stripeKey || !webhookSecret) {
    return c.json({ error: 'Stripe not configured' }, 500)
  }

  try {
    const body = await c.req.text()
    const event = JSON.parse(body)

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object
        const userEmail = session.customer_email || session.metadata?.userId
        const planId = session.metadata?.planId

        if (userEmail && planId) {
          const user: any = await c.env.USERS_KV.get(`user:${userEmail.toLowerCase()}`, 'json')
          if (user) {
            user.subscription = {
              planId,
              status: 'active',
              customerId: session.customer,
              subscriptionId: session.subscription,
              startedAt: new Date().toISOString()
            }
            await c.env.USERS_KV.put(`user:${userEmail.toLowerCase()}`, JSON.stringify(user))
            await auditLog(c, 'SUBSCRIPTION_ACTIVATED', userEmail, { planId })
          }
        }
        break
      }

      case 'customer.subscription.deleted': {
        break
      }

      case 'invoice.payment_failed': {
        break
      }
    }

    return c.json({ received: true })
  } catch (_error) {
    return c.json({ error: 'Webhook processing failed' }, 400)
  }
})

// Get user subscription status
stripe.get('/subscription', async (c) => {
  const user = await getCurrentUser(c)
  if (!user) {
    return c.json({ error: 'Authentication required' }, 401)
  }

  return c.json({
    subscription: user.subscription || { planId: 'free', status: 'active' },
    plan: STRIPE_PRODUCTS[(user.subscription?.planId?.toUpperCase() || 'FREE') as keyof typeof STRIPE_PRODUCTS]
  })
})

// Cancel subscription
stripe.post('/cancel-subscription', async (c) => {
  const user = await getCurrentUser(c)
  if (!user) {
    return c.json({ error: 'Authentication required' }, 401)
  }

  if (!user.subscription?.subscriptionId) {
    return c.json({ error: 'No active subscription' }, 400)
  }

  const stripeKey = c.env.STRIPE_SECRET_KEY
  if (!stripeKey) {
    return c.json({ error: 'Stripe not configured' }, 500)
  }

  try {
    const response = await fetch(`https://api.stripe.com/v1/subscriptions/${user.subscription.subscriptionId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${stripeKey}`,
      }
    })

    const result: any = await response.json()

    if (result.error) {
      return c.json({ error: result.error.message }, 400)
    }

    user.subscription = { planId: 'free', status: 'active', cancelledAt: new Date().toISOString() }
    await c.env.USERS_KV.put(`user:${user.email.toLowerCase()}`, JSON.stringify(user))

    await auditLog(c, 'SUBSCRIPTION_CANCELLED', user.email, {})

    return c.json({ success: true, message: 'Subscription cancelled' })
  } catch (_error) {
    return c.json({ error: 'Failed to cancel subscription' }, 500)
  }
})

export default stripe
