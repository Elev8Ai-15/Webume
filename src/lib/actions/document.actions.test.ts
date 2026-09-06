import { beforeEach, expect, it, vi } from "vitest";
const mocks = vi.hoisted(() => ({
  auth: vi.fn(),
  user: vi.fn(),
  experience: vi.fn(),
  create: vi.fn(),
  remove: vi.fn(),
}));
vi.mock("@clerk/nextjs/server", () => ({ auth: mocks.auth }));
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));
vi.mock("@/lib/db", () => ({
  db: {
    user: { findUnique: mocks.user },
    experience: { findFirst: mocks.experience },
    document: { create: mocks.create, deleteMany: mocks.remove },
  },
}));
import { addDocument, removeDocument } from "./document.actions";
const input = {
  experienceId: "job1",
  title: "Project evidence",
  url: "https://example.test/evidence",
  kind: "project" as const,
  year: "2026",
};
beforeEach(() => {
  vi.resetAllMocks();
  mocks.auth.mockResolvedValue({ userId: "clerk1" });
  mocks.user.mockResolvedValue({ id: "owner1", slug: "example" });
  mocks.experience.mockResolvedValue({ id: "job1" });
  mocks.remove.mockResolvedValue({ count: 1 });
});
it("rejects executable document links before any write", async () => {
  expect(
    (await addDocument({ ...input, url: "javascript:alert(1)" })).success,
  ).toBe(false);
  expect(mocks.create).not.toHaveBeenCalled();
});
it("rejects attaching evidence to another owner's chapter", async () => {
  mocks.experience.mockResolvedValue(null);
  expect((await addDocument(input)).success).toBe(false);
  expect(mocks.experience).toHaveBeenCalledWith({
    where: { id: "job1", userId: "owner1" },
  });
  expect(mocks.create).not.toHaveBeenCalled();
});
it("scopes deletion to the signed-in owner", async () => {
  await removeDocument("doc1");
  expect(mocks.remove).toHaveBeenCalledWith({
    where: { id: "doc1", userId: "owner1" },
  });
});
it("requires authentication before accepting evidence", async () => {
  mocks.auth.mockResolvedValue({ userId: null });
  expect((await addDocument(input)).success).toBe(false);
  expect(mocks.create).not.toHaveBeenCalled();
});
