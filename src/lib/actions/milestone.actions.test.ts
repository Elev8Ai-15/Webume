import { beforeEach, expect, it, vi } from "vitest";
const mocks = vi.hoisted(() => ({
  auth: vi.fn(),
  findUser: vi.fn(),
  findJob: vi.fn(),
  create: vi.fn(),
  deleteMany: vi.fn(),
  revalidate: vi.fn(),
}));
vi.mock("@clerk/nextjs/server", () => ({ auth: mocks.auth }));
vi.mock("next/cache", () => ({ revalidatePath: mocks.revalidate }));
vi.mock("@/lib/db", () => ({
  db: {
    user: { findUnique: mocks.findUser },
    experience: { findFirst: mocks.findJob },
    careerActivity: { create: mocks.create, deleteMany: mocks.deleteMany },
  },
}));
import { addMilestone, deleteMilestone } from "./milestone.actions";

beforeEach(() => {
  vi.resetAllMocks();
  mocks.auth.mockResolvedValue({ userId: "c1" });
  mocks.findUser.mockResolvedValue({ id: "u1", slug: "brad" });
});

it("rejects a milestone attached to someone else's job", async () => {
  mocks.findJob.mockResolvedValue(null);
  const r = await addMilestone("promotion", "Promoted", null, "2024-03-01", "job-x");
  expect(r.success).toBe(false);
  expect(mocks.create).not.toHaveBeenCalled();
});

it("rejects unknown kinds and accepts the new ones", async () => {
  expect((await addMilestone("selfie", "x", null, "2024-03-01", null)).success).toBe(false);
  mocks.findJob.mockResolvedValue({ id: "job-1" });
  const r = await addMilestone("launch", "Opened Brandon store", "40 hires", "2024-03-01", "job-1");
  expect(r.success).toBe(true);
  expect(mocks.create).toHaveBeenCalledWith(
    expect.objectContaining({
      data: expect.objectContaining({ userId: "u1", experienceId: "job-1", kind: "launch" }),
    }),
  );
  expect(mocks.revalidate).toHaveBeenCalledWith("/p/brad", "layout");
});

it("only deletes the owner's own milestone", async () => {
  mocks.deleteMany.mockResolvedValue({ count: 0 });
  expect((await deleteMilestone("m9")).success).toBe(false);
  expect(mocks.deleteMany).toHaveBeenCalledWith({ where: { id: "m9", userId: "u1" } });
});
