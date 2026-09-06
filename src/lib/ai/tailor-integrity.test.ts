import { expect, it } from "vitest";
import { validateTailoredFacts } from "./tailor-integrity";
import type { ProfileData } from "@/lib/types/profile";
import type { TailorResult } from "./tailor-resume";
const source = {
  basics: {
    name: "Example",
    title: "Manager",
    email: "a@example.test",
    phone: "",
    location: "",
    summary: "Managed 10 projects",
  },
  skills: ["Leadership"],
  certifications: ["Example certification"],
  education: [],
  experience: [
    {
      company: "Acme",
      role: "Manager",
      startDate: "2020",
      endDate: "2024",
      description: "Managed 10 projects",
      responsibilities: [],
      metrics: [],
    },
  ],
} as unknown as ProfileData;
function draft() {
  return {
    tailoredProfile: {
      basics: { ...source.basics },
      experience: [
        {
          ...source.experience[0],
          highlights: ["Managed 10 projects"],
          relevanceScore: 80,
        },
      ],
      skills: ["Leadership"],
      education: [],
      certifications: ["Example certification"],
    },
    matchAnalysis: {
      overallScore: 80,
      matchedKeywords: [],
      missingKeywords: [],
      strengths: [],
      suggestions: [],
    },
  } as TailorResult;
}
it("accepts supported facts and restores source contact fields", () => {
  const d = draft();
  d.tailoredProfile.basics.email = "wrong@example.test";
  validateTailoredFacts(source, d);
  expect(d.tailoredProfile.basics.email).toBe(source.basics.email);
});
it("blocks fabricated employers", () => {
  const d = draft();
  d.tailoredProfile.experience[0].company = "Invented";
  expect(() => validateTailoredFacts(source, d)).toThrow("employment fact");
});
it("blocks unsupported metrics", () => {
  const d = draft();
  d.tailoredProfile.experience[0].highlights = ["Managed 500 projects"];
  expect(() => validateTailoredFacts(source, d)).toThrow("unsupported number");
});
it("blocks added skills and credentials", () => {
  const d = draft();
  d.tailoredProfile.skills.push("Unlisted skill");
  expect(() => validateTailoredFacts(source, d)).toThrow("unlisted skill");
  const e = draft();
  e.tailoredProfile.certifications.push("Invented license");
  expect(() => validateTailoredFacts(source, e)).toThrow("credential");
});
