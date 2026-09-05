"use server";

import { generateText, Output } from "ai";
import { anthropic } from "@ai-sdk/anthropic";
import { profileDataSchema } from "@/lib/schemas/profile.schema";
import type { ProfileData } from "@/lib/types/profile";

const PARSE_PROMPT = `You are an expert resume parser. Analyze the following resume/CV text and extract structured information.

IMPORTANT INSTRUCTIONS:
- Extract ONLY what the text states. Never invent or estimate employers, titles, dates, metrics, or achievements. A missing fact stays empty.
- For each work experience, list the responsibilities the text supports (rephrase for clarity; do not add new ones)
- Metrics only when the text gives a number; otherwise leave metrics empty
- Company info only as stated in the text (location, industry); leave the rest empty
- Write a one-line professional tagline that summarizes the stated experience
- List the skills the text supports
- If information is not available, use empty strings or empty arrays, not null
- Ensure all dates are in "Mon YYYY" format (e.g., "Jan 2020")
- For current positions, use "Present" as the end date

Resume text to parse:
`;

export async function parseResumeWithAI(
  rawText: string,
): Promise<ProfileData> {
  const { output } = await generateText({
    // Anthropic direct (ANTHROPIC_API_KEY). Opus 5 rejects temperature; omit it.
    model: anthropic("claude-opus-5"),
    output: Output.object({ schema: profileDataSchema }),
    maxOutputTokens: 16000,
    prompt: PARSE_PROMPT + rawText,
  });

  if (!output) {
    throw new Error("AI failed to parse resume — no structured output returned");
  }

  return output as ProfileData;
}
