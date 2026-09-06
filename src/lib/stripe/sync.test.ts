import { beforeEach, expect, it, vi } from "vitest";
import type Stripe from "stripe";
const mocks = vi.hoisted(() => ({
  retrieve: vi.fn(),
  linked: vi.fn(),
  existing: vi.fn(),
  upsert: vi.fn(),
  owners: vi.fn(),
}));
vi.mock("./client", () => ({
  getStripe: () => ({ subscriptions: { retrieve: mocks.retrieve } }),
}));
vi.mock("@/lib/db", () => ({
  db: {
    subscription: { findFirst: mocks.linked },
    $transaction: async (fn: (tx: unknown) => unknown) =>
      fn({
        $queryRaw: mocks.owners,
        subscription: { findUnique: mocks.existing, upsert: mocks.upsert },
      }),
  },
}));
import { subscriptionFields, syncStripeSubscription } from "./sync";
const sub = {
  id: "sub1",
  status: "active",
  customer: "cus1",
  metadata: { userId: "owner1" },
  items: { data: [{ price: { id: "price_pro" } }] },
  start_date: 100,
  created: 100,
  canceled_at: 200,
  cancel_at_period_end: true,
} as unknown as Stripe.Subscription;
beforeEach(() => {
  vi.resetAllMocks();
  vi.stubEnv("STRIPE_PRO_PRICE_ID", "price_pro");
  mocks.owners.mockResolvedValue([{ id: "owner1" }]);
  mocks.retrieve.mockResolvedValue(sub);
  mocks.existing.mockResolvedValue(null);
  mocks.linked.mockResolvedValue(null);
});
it("keeps active paid access during scheduled cancellation", () => {
  expect(subscriptionFields(sub)).toMatchObject({
    planId: "pro",
    status: "active",
    cancelledAt: new Date(200000),
  });
});
it("revokes the paid plan once cancellation actually ends it", () => {
  expect(subscriptionFields({ ...sub, status: "canceled" })).toMatchObject({
    planId: "free",
    status: "canceled",
  });
});
it("uses the fresh subscription retrieved after taking the owner lock", async () => {
  mocks.retrieve
    .mockResolvedValueOnce(sub)
    .mockResolvedValueOnce({ ...sub, status: "past_due" });
  await syncStripeSubscription("sub1");
  expect(mocks.retrieve).toHaveBeenCalledTimes(2);
  expect(mocks.upsert).toHaveBeenCalledWith(
    expect.objectContaining({
      update: expect.objectContaining({ status: "past_due" }),
    }),
  );
});
it("does not overwrite a different current subscription from a delayed event", async () => {
  mocks.existing.mockResolvedValue({
    stripeSubscriptionId: "sub2",
    status: "active",
  });
  await syncStripeSubscription("sub1");
  expect(mocks.upsert).not.toHaveBeenCalled();
});
it("rejects mismatched Stripe customers", async () => {
  mocks.existing.mockResolvedValue({
    stripeSubscriptionId: "sub1",
    stripeCustomerId: "other",
    status: "active",
  });
  await expect(syncStripeSubscription("sub1")).rejects.toThrow(
    "Customer mismatch",
  );
  expect(mocks.upsert).not.toHaveBeenCalled();
});
