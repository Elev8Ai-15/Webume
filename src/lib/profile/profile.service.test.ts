import { describe, expect, it } from "vitest";
import { assembleProfileData, type UserWithExperiences } from "./profile.service";

const baseUser = {
  id: "u1",
  clerkId: "c1",
  email: "a@b.c",
  name: "Test",
  slug: "test",
  profilePhoto: null,
  resumeUrl: null,
  selectedTemplate: "minimal",
  rawText: null,
  isPublic: false,
  profileViews: 0,
  lastViewedAt: null,
  createdAt: new Date(),
  updatedAt: new Date(),
};

const header = {
  basics: {
    name: "Test",
    title: "Manager",
    tagline: "",
    email: "",
    phone: "",
    location: "",
    linkedin: "",
    website: "",
    summary: "Summary",
  },
  skills: ["leadership"],
  achievements: [],
  education: [],
  certifications: [],
};

function makeUser(overrides: Partial<UserWithExperiences>): UserWithExperiences {
  return { ...baseUser, profileData: null, experiences: [], ...overrides } as UserWithExperiences;
}

describe("assembleProfileData", () => {
  it("returns null when the user has no header", () => {
    expect(assembleProfileData(makeUser({ profileData: null }))).toBeNull();
  });

  it("assembles experiences from rows in order, with metrics and defaults", () => {
    const user = makeUser({
      profileData: header,
      experiences: [
        {
          id: "e1",
          userId: "u1",
          company: "Acme",
          role: "GM",
          startDate: "Jan 2020",
          endDate: "Present",
          description: "Ran the store",
          responsibilities: ["Hired staff"],
          companyInfo: null,
          dayInLife: null,
          displayOrder: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
          metrics: [
            {
              id: "m1",
              experienceId: "e1",
              value: "$1.2M",
              label: "revenue managed",
            },
          ],
        },
      ],
    });

    const profile = assembleProfileData(user);
    expect(profile).not.toBeNull();
    expect(profile!.experience).toHaveLength(1);
    const exp = profile!.experience[0];
    expect(exp.company).toBe("Acme");
    expect(exp.metrics).toEqual([{ value: "$1.2M", label: "revenue managed" }]);
    // Null JSON columns fall back to safe empties
    expect(exp.companyInfo.industry).toBe("");
    expect(exp.dayInLife).toEqual([]);
    expect(profile!.skills).toEqual(["leadership"]);
  });
});
