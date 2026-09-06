import { beforeEach, expect, it, vi } from "vitest";
const mocks = vi.hoisted(() => ({
  auth: vi.fn(),
  findUser: vi.fn(),
  parse: vi.fn(),
  save: vi.fn(),
  put: vi.fn(),
  revalidate: vi.fn(),
}));
vi.mock("@clerk/nextjs/server", () => ({ auth: mocks.auth }));
vi.mock("next/cache", () => ({ revalidatePath: mocks.revalidate }));
vi.mock("@/lib/db", () => ({ db: { user: { findUnique: mocks.findUser } } }));
vi.mock("@/lib/ai/parse-resume", () => ({ parseResumeWithAI: mocks.parse }));
vi.mock("@/lib/profile/profile.service", () => ({
  saveParsedProfile: mocks.save,
}));
vi.mock("@vercel/blob", () => ({ put: mocks.put }));
import { uploadAndParseResume } from "./resume.actions";
const user = { id: "u1", slug: "example", profileData: null };
beforeEach(() => {
  vi.resetAllMocks();
  mocks.auth.mockResolvedValue({ userId: "c1" });
  mocks.findUser.mockResolvedValue(user);
  mocks.parse.mockResolvedValue({
    basics: { name: "Example" },
    experience: [],
  });
});
function input() {
  const data = new FormData();
  data.set(
    "resume",
    new File(
      ["Career experience and skills supplied by the owner. ".repeat(3)],
      "resume.txt",
      { type: "text/plain" },
    ),
  );
  return data;
}
it("does not publish the original source file during successful import", async () => {
  const result = await uploadAndParseResume(input());
  expect(result.success).toBe(true);
  expect(mocks.save).toHaveBeenCalled();
  expect(mocks.put).not.toHaveBeenCalled();
  expect(mocks.revalidate).toHaveBeenCalledWith("/p/example");
});
it("requires explicit confirmation before replacing existing career data", async () => {
  mocks.findUser.mockResolvedValue({ ...user, profileData: { basics: {} } });
  expect((await uploadAndParseResume(input())).success).toBe(false);
  expect(mocks.parse).not.toHaveBeenCalled();
  expect(mocks.save).not.toHaveBeenCalled();
});
it("rejects non-file payloads without invoking AI", async () => {
  const data = new FormData();
  data.set("resume", "pretend-file");
  expect((await uploadAndParseResume(data)).success).toBe(false);
  expect(mocks.parse).not.toHaveBeenCalled();
});
it("rejects oversized files before AI or database writes", async () => {
  const data = new FormData();
  data.set(
    "resume",
    new File([new Uint8Array(4 * 1024 * 1024 + 1)], "large.pdf", {
      type: "application/pdf",
    }),
  );
  expect((await uploadAndParseResume(data)).success).toBe(false);
  expect(mocks.parse).not.toHaveBeenCalled();
  expect(mocks.save).not.toHaveBeenCalled();
});
