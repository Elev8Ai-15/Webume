import { beforeEach, expect, it, vi } from "vitest";
const mocks = vi.hoisted(() => ({
  auth: vi.fn(),
  user: vi.fn(),
  experience: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
  revalidate: vi.fn(),
}));
vi.mock("@clerk/nextjs/server", () => ({ auth: mocks.auth }));
vi.mock("next/cache", () => ({ revalidatePath: mocks.revalidate }));
vi.mock("@/lib/db", () => ({
  db: {
    user: { findUnique: mocks.user },
    experience: { findFirst: mocks.experience },
    testimonial: { create: mocks.create, updateMany: mocks.update },
  },
}));
import {
  createTestimonialRequest,
  submitTestimonial,
  reviewTestimonial,
} from "./testimonial.actions";
const token = "a".repeat(64);
const response = {
  issuerName: "Example Contributor",
  issuerEmail: "example@example.test",
  relationship: "Coworker" as const,
  sharedCompany: "Example Company",
  body: "We worked together on a carefully documented project.",
};
beforeEach(() => {
  vi.resetAllMocks();
  mocks.auth.mockResolvedValue({ userId: "c1" });
  mocks.user.mockResolvedValue({ id: "u1", slug: "example" });
  mocks.update.mockResolvedValue({ count: 1 });
});
it("does not invite against another owner’s career chapter", async () => {
  mocks.experience.mockResolvedValue(null);
  expect((await createTestimonialRequest("not-owned")).success).toBe(false);
  expect(mocks.create).not.toHaveBeenCalled();
});
it("creates an unguessable invitation with no publishable body", async () => {
  const result = await createTestimonialRequest();
  expect(result.success).toBe(true);
  if (result.success) expect(result.data.token).toMatch(/^[a-f0-9]{64}$/);
  expect(mocks.create).toHaveBeenCalledWith(
    expect.objectContaining({
      data: expect.objectContaining({
        status: "invited",
        body: "",
        recipientId: "u1",
      }),
    }),
  );
});
it("requires a live unused invite and submits privately", async () => {
  expect((await submitTestimonial(token, response)).success).toBe(true);
  expect(mocks.update).toHaveBeenCalledWith(
    expect.objectContaining({
      where: expect.objectContaining({
        id: token,
        status: "invited",
        createdAt: { gte: expect.any(Date) },
      }),
      data: expect.objectContaining({
        status: "pending",
        verificationLevel: 1,
      }),
    }),
  );
});
it("rejects replay or expiration", async () => {
  mocks.update.mockResolvedValue({ count: 0 });
  expect((await submitTestimonial(token, response)).success).toBe(false);
});
it("requires owner authentication for approval", async () => {
  mocks.auth.mockResolvedValue({ userId: null });
  expect((await reviewTestimonial(token, "approved")).success).toBe(false);
  expect(mocks.update).not.toHaveBeenCalled();
});
it("scopes moderation to the owner and excludes empty invitations", async () => {
  expect((await reviewTestimonial(token, "approved")).success).toBe(true);
  expect(mocks.update).toHaveBeenCalledWith(
    expect.objectContaining({
      where: expect.objectContaining({
        recipientId: "u1",
        body: { not: "" },
        status: { in: ["pending", "rejected"] },
      }),
    }),
  );
  expect(mocks.revalidate).toHaveBeenCalledWith("/p/example", "layout");
});
