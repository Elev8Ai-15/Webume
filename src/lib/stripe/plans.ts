export interface Plan {
  id: string;
  name: string;
  price: number;
  priceId: string | null;
  features: string[];
  limits: { tailoredResumes: number; profiles: number };
}

export const PLANS: Record<string, Plan> = {
  free: {
    id: "free",
    name: "Free",
    price: 0,
    priceId: null,
    features: [
      "Your living profile, forever",
      "Public link to share anywhere",
      "Resume import (PDF) or build by hand",
      "You own your data: export or delete anytime",
    ],
    limits: { tailoredResumes: 0, profiles: 1 },
  },
  pro: {
    id: "pro",
    name: "Pro",
    price: 999,
    priceId: process.env.STRIPE_PRO_PRICE_ID ?? "price_pro_monthly",
    features: [
      "Everything in Free",
      "AI Resume Tailor: rewrite your profile for any job posting",
      "ATS-ready resume download (PDF)",
      "Profile view counts",
    ],
    limits: { tailoredResumes: -1, profiles: -1 },
  },
  enterprise: {
    id: "enterprise",
    name: "Enterprise",
    price: 2999,
    priceId:
      process.env.STRIPE_ENTERPRISE_PRICE_ID ?? "price_enterprise_monthly",
    features: [
      "Everything in Pro",
      "Team Management",
      "API Access",
      "White Label",
      "Dedicated Support",
    ],
    limits: { tailoredResumes: -1, profiles: -1 },
  },
};

export function isPremiumUser(planId: string): boolean {
  const plan = planId?.toLowerCase();
  return plan === "pro" || plan === "enterprise";
}
