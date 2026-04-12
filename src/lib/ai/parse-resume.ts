"use server";

import { generateText, Output } from "ai";
import { profileDataSchema } from "@/lib/schemas/profile.schema";
import type { ProfileData } from "@/lib/types/profile";

const PARSE_PROMPT = `You are an expert resume parser. Analyze the following resume/CV text and extract structured information.

IMPORTANT INSTRUCTIONS:
- Extract ALL information accurately from the text
- For each work experience, provide detailed responsibilities (5-8 bullet points)
- Generate a "day in the life" narrative (3-5 entries) showing what a typical workday looks like in that role
- Extract or estimate performance metrics where possible
- For company info, include what you know about the company (industry, size, location)
- Generate a professional tagline based on the person's experience
- Extract 15-25 relevant skills
- If information is not available, use empty strings, not null
- Ensure all dates are in "Mon YYYY" format (e.g., "Jan 2020")
- For current positions, use "Present" as the end date

Resume text to parse:
`;

export async function parseResumeWithAI(
  rawText: string,
): Promise<ProfileData> {
  const { output } = await generateText({
    model: "google/gemini-2.0-flash",
    output: Output.object({ schema: profileDataSchema }),
    temperature: 0.1,
    maxOutputTokens: 8192,
    prompt: PARSE_PROMPT + rawText,
  });

  if (!output) {
    throw new Error("AI failed to parse resume — no structured output returned");
  }

  return output as ProfileData;
}
