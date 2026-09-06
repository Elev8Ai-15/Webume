import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { expect, it } from "vitest";
import { TemplateRenderer } from "./template-renderer";
import type { ProfileData } from "@/lib/types/profile";
const basics = {
  name: "Example Person",
  title: "Manager",
  tagline: "",
  summary: "",
  location: "",
  email: "",
  phone: "",
  linkedin: "",
  website: "",
};
const job = {
  company: "Example Company",
  companyInfo: {
    website: "",
    domain: "",
    industry: "",
    location: "",
    size: "",
    description: "",
  },
  role: "Manager",
  startDate: "",
  endDate: "",
  description: "",
  metrics: [{ value: "10", label: "Projects" }],
  responsibilities: ["Led the team"],
  dayInLife: [],
};
it("renders distinct section IDs and keyboard-native expandable chapters", () => {
  const profile: ProfileData = {
    basics,
    experience: [job, job],
    skills: ["Leadership"],
    education: [],
    certifications: [],
    achievements: [{ title: "Award", description: "Recognition" }],
  };
  const html = renderToStaticMarkup(
    React.createElement(TemplateRenderer, {
      profileData: profile,
      templateId: "minimal",
    }),
  );
  const ids = [...html.matchAll(/ id="([^"]+)"/g)].map((m) => m[1]);
  expect(new Set(ids).size).toBe(ids.length);
  expect(html).toContain('<details class="chapter-details mt-5" open="">');
  expect(html).toContain('href="#career"');
  expect(html).not.toContain('id="education"');
});
it("does not render empty skills or education cards", () => {
  const profile: ProfileData = {
    basics,
    experience: [],
    skills: [],
    education: [],
    certifications: [],
    achievements: [],
  };
  const html = renderToStaticMarkup(
    React.createElement(TemplateRenderer, {
      profileData: profile,
      templateId: "minimal",
    }),
  );
  expect(html).not.toContain('id="expertise"');
  expect(html).not.toContain('id="education"');
});
