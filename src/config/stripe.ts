export const STRIPE_PRODUCTS: Record<string, {
  id: string
  name: string
  price: number
  priceId: string | null
  features: string[]
  limits: { tailoredResumes: number; profiles: number }
}> = {
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
    price: 999,
    priceId: 'price_pro_monthly',
    features: ['🎯 AI Resume Tailor (Unlimited)', 'Unlimited Profiles', 'All 10 Templates', 'Custom Domain', 'Priority Support', 'PDF Export', 'Analytics Dashboard', 'Remove Watermark'],
    limits: { tailoredResumes: -1, profiles: -1 }
  },
  ENTERPRISE: {
    id: 'enterprise',
    name: 'Enterprise',
    price: 2999,
    priceId: 'price_enterprise_monthly',
    features: ['🎯 AI Resume Tailor (Unlimited)', 'Everything in Pro', 'Team Management', 'API Access', 'White Label', 'Dedicated Support', 'Custom Integrations', 'SLA Guarantee'],
    limits: { tailoredResumes: -1, profiles: -1 }
  }
}
