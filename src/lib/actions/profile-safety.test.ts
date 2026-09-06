import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  auth: vi.fn(),
  revalidate: vi.fn(),
  findUser: vi.fn(),
  updateUser: vi.fn(),
  findExperiences: vi.fn(),
  transaction: vi.fn(),
  updateExperience: vi.fn(),
}));
vi.mock("@clerk/nextjs/server", () => ({ auth: mocks.auth }));
vi.mock("next/cache", () => ({ revalidatePath: mocks.revalidate }));
vi.mock("@/lib/db", () => ({
  db: {
    user: { findUnique: mocks.findUser, update: mocks.updateUser },
    experience: {
      findMany: mocks.findExperiences,
      update: mocks.updateExperience,
    },
    $transaction: mocks.transaction,
  },
}));
import { togglePublic, updateProfileData } from "./profile.actions";
import { reorderExperiences } from "./experience.actions";
import { updateSlug } from "./settings.actions";

const header = {
  basics: {
    name: "Example Person",
    title: "Manager",
    summary: "Career summary",
  },
  skills: [],
  achievements: [],
  education: [],
  certifications: [],
};
const user = {
  id: "u1",
  clerkId: "c1",
  slug: "example-person",
  profileData: header,
  isPublic: true,
};
beforeEach(() => {
  vi.resetAllMocks();
  mocks.auth.mockResolvedValue({ userId: "c1" });
  mocks.findUser.mockResolvedValue(user);
  mocks.updateUser.mockResolvedValue(user);
});
describe("publishing and profile safety", () => {
  it("requires authentication without writing", async () => {
    mocks.auth.mockResolvedValue({ userId: null });
    expect((await togglePublic(true)).success).toBe(false);
    expect(mocks.updateUser).not.toHaveBeenCalled();
  });
  it("rejects an empty profile", async () => {
    mocks.findUser.mockResolvedValue({ ...user, profileData: null });
    expect((await togglePublic(true)).success).toBe(false);
    expect(mocks.updateUser).not.toHaveBeenCalled();
  });
  it("rejects a blank name", async () => {
    mocks.findUser.mockResolvedValue({
      ...user,
      profileData: { ...header, basics: { ...header.basics, name: " " } },
    });
    expect((await togglePublic(true)).success).toBe(false);
  });
  it("allows making an incomplete existing profile private and invalidates its public path", async () => {
    mocks.findUser.mockResolvedValue({ ...user, profileData: null });
    expect((await togglePublic(false)).success).toBe(true);
    expect(mocks.revalidate).toHaveBeenCalledWith("/p/example-person");
  });
  it("publishes a named profile and invalidates the public path", async () => {
    expect((await togglePublic(true)).success).toBe(true);
    expect(mocks.updateUser).toHaveBeenCalledWith({
      where: { id: "u1" },
      data: { isPublic: true },
    });
    expect(mocks.revalidate).toHaveBeenCalledWith("/p/example-person");
  });
  it("rejects malformed header patches", async () => {
    expect((await updateProfileData({ skills: 42 } as never)).success).toBe(
      false,
    );
    expect(mocks.updateUser).not.toHaveBeenCalled();
  });
  it("rejects duplicate experience IDs even when array length matches", async () => {
    mocks.findExperiences.mockResolvedValue([{ id: "e1" }, { id: "e2" }]);
    expect((await reorderExperiences(["e1", "e1"])).success).toBe(false);
    expect(mocks.transaction).not.toHaveBeenCalled();
  });
  it("rejects another user's experience ID", async () => {
    mocks.findExperiences.mockResolvedValue([{ id: "e1" }]);
    expect((await reorderExperiences(["someone-elses-job"])).success).toBe(
      false,
    );
    expect(mocks.transaction).not.toHaveBeenCalled();
  });
  it("handles concurrent public URL collisions", async () => {
    mocks.findUser.mockResolvedValueOnce(user).mockResolvedValueOnce(null);
    mocks.updateUser.mockRejectedValue({ code: "P2002" });
    const result = await updateSlug("new-name");
    expect(result.success).toBe(false);
    expect(result).toHaveProperty(
      "error",
      expect.stringContaining("just taken"),
    );
  });
});
