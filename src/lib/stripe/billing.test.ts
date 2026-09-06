import { beforeEach, expect, it, vi } from "vitest";
import { isPremiumUser, planForStripePrice } from "./plans";
const mocks = vi.hoisted(() => ({ construct: vi.fn(), sync: vi.fn() }));
vi.mock("./client", () => ({
  getStripe: () => ({ webhooks: { constructEvent: mocks.construct } }),
}));
vi.mock("./sync", () => ({
  stripeId: (v: string | { id: string } | null) =>
    typeof v === "string" ? v : v?.id,
  syncStripeSubscription: mocks.sync,
}));
import { POST } from "@/app/api/stripe/webhook/route";
beforeEach(() => {
  vi.clearAllMocks();
  vi.stubEnv("STRIPE_SECRET_KEY", "test-only");
  vi.stubEnv("STRIPE_WEBHOOK_SECRET", "test-only");
  vi.stubEnv("STRIPE_PRO_PRICE_ID", "price_test_pro");
});
it("denies inactive paid plans but allows active and trialing subscriptions", () => {
  for (const status of [
    "past_due",
    "unpaid",
    "canceled",
    "cancelled",
    "paused",
    "incomplete",
    "incomplete_expired",
  ])
    expect(isPremiumUser({ planId: "pro", status })).toBe(false);
  expect(isPremiumUser({ planId: "pro", status: "active" })).toBe(true);
  expect(isPremiumUser({ planId: "pro", status: "trialing" })).toBe(true);
  expect(isPremiumUser({ planId: "free", status: "active" })).toBe(false);
  expect(isPremiumUser(null)).toBe(false);
});
it("grants no plan for an unknown Stripe price", () => {
  expect(planForStripePrice("price_unknown")).toBe("free");
  expect(planForStripePrice("price_test_pro")).toBe("pro");
});
it("rejects unsigned deliveries without syncing", async () => {
  expect(
    (
      await POST(
        new Request("https://example.test/api/stripe/webhook", {
          method: "POST",
          body: "{}",
        }),
      )
    ).status,
  ).toBe(400);
  expect(mocks.sync).not.toHaveBeenCalled();
});
it("rejects invalid signatures without syncing", async () => {
  mocks.construct.mockImplementation(() => {
    throw new Error("invalid");
  });
  expect(
    (
      await POST(
        new Request("https://example.test/api/stripe/webhook", {
          method: "POST",
          headers: { "stripe-signature": "invalid" },
          body: "{}",
        }),
      )
    ).status,
  ).toBe(400);
  expect(mocks.sync).not.toHaveBeenCalled();
});
it("uses the exact signed body and syncs restored invoice payments", async () => {
  const body = '{ "id": "evt-test" }';
  mocks.construct.mockReturnValue({
    id: "evt-test",
    type: "invoice.paid",
    data: {
      object: {
        parent: { subscription_details: { subscription: "sub-test" } },
      },
    },
  });
  expect(
    (
      await POST(
        new Request("https://example.test/api/stripe/webhook", {
          method: "POST",
          headers: { "stripe-signature": "sig" },
          body,
        }),
      )
    ).status,
  ).toBe(200);
  expect(mocks.construct).toHaveBeenCalledWith(body, "sig", "test-only");
  expect(mocks.sync).toHaveBeenCalledWith("sub-test", undefined);
});
it("returns retryable failure if subscription sync fails", async () => {
  const log = vi.spyOn(console, "error").mockImplementation(() => {});
  mocks.construct.mockReturnValue({
    id: "evt-test",
    type: "customer.subscription.updated",
    data: { object: { id: "sub-test" } },
  });
  mocks.sync.mockRejectedValueOnce(new Error("db offline"));
  expect(
    (
      await POST(
        new Request("https://example.test/api/stripe/webhook", {
          method: "POST",
          headers: { "stripe-signature": "sig" },
          body: "{}",
        }),
      )
    ).status,
  ).toBe(500);
  log.mockRestore();
});
