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
      "Manual editing of your career details",
    ],
    limits: { tailoredResumes: 0, profiles: 1 },
  },
  pro: {
    id: "pro",
    name: "Pro",
    price: 999,
    priceId: process.env.STRIPE_PRO_PRICE_ID ?? null,
    features: [
      "Everything in Free",
      "AI Resume Tailor: rewrite your profile for any job posting",
      "ATS-ready resume download (PDF)",
      "Profile view counts",
    ],
    limits: { tailoredResumes: -1, profiles: -1 },
  },
};

export function isPremiumUser(
  subscription: { planId: string; status: string } | null | undefined,
): boolean {
  return (
    !!subscription &&
    ["pro", "enterprise"].includes(subscription.planId.toLowerCase()) &&
    ["active", "trialing"].includes(subscription.status)
  );
}

export function planForStripePrice(priceId: string): string {
  if (
    process.env.STRIPE_PRO_PRICE_ID &&
    priceId === process.env.STRIPE_PRO_PRICE_ID
  )
    return "pro";
  // Preserve existing enterprise subscribers, without selling unimplemented features.
  if (
    process.env.STRIPE_ENTERPRISE_PRICE_ID &&
    priceId === process.env.STRIPE_ENTERPRISE_PRICE_ID
  )
    return "enterprise";
  return "free";
}
