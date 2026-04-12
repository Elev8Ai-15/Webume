"use server";

import { generateText, Output } from "ai";
import { z } from "zod";
import type { ProfileData } from "@/lib/types/profile";

const tailoredProfileSchema = z.object({
  tailoredProfile: z.object({
    basics: z.object({
      name: z.string(),
      title: z.string(),
      tagline: z.string().default(""),
      summary: z.string(),
      email: z.string().default(""),
      phone: z.string().default(""),
      location: z.string().default(""),
    }),
    experience: z.array(
      z.object({
        company: z.string(),
        role: z.string(),
        startDate: z.string(),
        endDate: z.string(),
        description: z.string(),
        highlights: z.array(z.string()).default([]),
        relevanceScore: z.number().default(0),
      }),
    ),
    skills: z.array(z.string()),
    education: z.array(
      z.object({
        degree: z.string(),
        school: z.string(),
        year: z.string(),
        details: z.string().default(""),
      }),
    ),
    certifications: z.array(z.string()).default([]),
  }),
  matchAnalysis: z.object({
    overallScore: z.number(),
    matchedKeywords: z.array(z.string()),
    missingKeywords: z.array(z.string()).default([]),
    strengths: z.array(z.string()).default([]),
    suggestions: z.array(z.string()).default([]),
  }),
});

export type TailorResult = z.infer<typeof tailoredProfileSchema>;

function buildTailorPrompt(
  masterProfile: ProfileData,
  jobTitle: string,
  company: string,
  jobDescription: string,
): string {
  return `You are an elite executive resume writer, career strategist, and ATS optimization expert. Your task is to create a PERFECTLY TAILORED resume that maximizes this candidate's chances of getting an interview.

## THE TARGET JOB
Job Title: ${jobTitle}
Company: ${company}
Job Description:
${jobDescription}

## THE CANDIDATE'S MASTER PROFILE
${JSON.stringify(masterProfile, null, 2)}

## YOUR MISSION
Create a tailored version of this candidate's resume that:

1. **KEYWORD OPTIMIZATION** (Critical for ATS):
   - Extract ALL keywords, skills, and requirements from the job description
   - Naturally incorporate these keywords throughout the resume
   - Match the exact terminology used in the job posting

2. **EXPERIENCE REFRAMING**:
   - Reorder and prioritize experiences most relevant to this role
   - Rewrite bullet points to emphasize transferable skills
   - Quantify achievements where possible (%, $, numbers)

3. **SUMMARY CUSTOMIZATION**:
   - Write a new professional summary specifically targeting this role
   - Lead with the most relevant qualifications

4. **SKILLS PRIORITIZATION**:
   - Reorder skills to put most relevant ones first
   - Add any skills from job description that candidate has but didn't list

5. **MATCH ANALYSIS**:
   - Calculate a match score (0-100) based on keyword and requirement overlap
   - List top matching keywords/skills
   - Identify gaps`;
}

export async function tailorResumeWithAI(
  masterProfile: ProfileData,
  jobTitle: string,
  company: string,
  jobDescription: string,
): Promise<TailorResult> {
  const prompt = buildTailorPrompt(
    masterProfile,
    jobTitle,
    company,
    jobDescription,
  );

  const { output } = await generateText({
    model: "google/gemini-2.0-flash",
    output: Output.object({ schema: tailoredProfileSchema }),
    temperature: 0.2,
    maxOutputTokens: 8192,
    prompt,
  });

  if (!output) {
    throw new Error("AI failed to tailor resume");
  }

  return output;
}
