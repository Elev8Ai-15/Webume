import { z } from "zod";

export const companyInfoSchema = z.object({
  website: z.string().default(""),
  domain: z.string().default(""),
  industry: z.string().default(""),
  location: z.string().default(""),
  size: z.string().default(""),
  description: z.string().default(""),
});

export const dayInLifeEntrySchema = z.object({
  time: z.string(),
  activity: z.string(),
});

export const metricSchema = z.object({
  value: z.string(),
  label: z.string(),
});

export const experienceSchema = z.object({
  company: z.string(),
  companyInfo: companyInfoSchema,
  role: z.string(),
  startDate: z.string(),
  endDate: z.string(),
  description: z.string(),
  responsibilities: z.array(z.string()),
  dayInLife: z.array(dayInLifeEntrySchema).default([]),
  metrics: z.array(metricSchema).default([]),
});

export const achievementSchema = z.object({
  title: z.string(),
  description: z.string(),
});

export const educationSchema = z.object({
  degree: z.string(),
  school: z.string(),
  year: z.string(),
  details: z.string().default(""),
});

export const profileBasicsSchema = z.object({
  name: z.string(),
  title: z.string(),
  tagline: z.string().default(""),
  email: z.string().default(""),
  phone: z.string().default(""),
  location: z.string().default(""),
  linkedin: z.string().default(""),
  website: z.string().default(""),
  summary: z.string(),
});

export const profileDataSchema = z.object({
  basics: profileBasicsSchema,
  experience: z.array(experienceSchema),
  skills: z.array(z.string()),
  achievements: z.array(achievementSchema).default([]),
  education: z.array(educationSchema).default([]),
  certifications: z.array(z.string()).default([]),
});
