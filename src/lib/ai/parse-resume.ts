"use server";

import { generateText, Output } from "ai";
import { anthropic } from "@ai-sdk/anthropic";
import { profileDataSchema } from "@/lib/schemas/profile.schema";
import type { ProfileData } from "@/lib/types/profile";

const PARSE_PROMPT = `You are an expert resume parser. Analyze the resume/CV and extract structured information.

IMPORTANT INSTRUCTIONS:
- Extract ONLY what the resume states. Never invent or estimate employers, titles, dates, metrics, or achievements. A missing fact stays empty.
- For each work experience, list the responsibilities the resume supports (rephrase for clarity; do not add new ones)
- Metrics only when the resume gives a number; otherwise leave metrics empty
- Company info only as stated in the resume (location, industry); leave the rest empty
- Write a one-line professional tagline that summarizes the stated experience
- List the skills the resume supports
- If information is not available, use empty strings or empty arrays, not null
- Ensure all dates are in "Mon YYYY" format (e.g., "Jan 2020")
- For current positions, use "Present" as the end date`;

/** Either plain text (TXT upload) or the raw PDF bytes. Claude reads PDFs natively,
 *  so no server-side PDF text extraction is needed (pdfjs needed DOM globals on Vercel). */
export type ResumeSource = { text: string } | { pdf: Uint8Array };

export async function parseResumeWithAI(source: ResumeSource): Promise<ProfileData> {
  const content =
    "pdf" in source
      ? [
          { type: "file" as const, data: source.pdf, mediaType: "application/pdf" },
          { type: "text" as const, text: PARSE_PROMPT },
        ]
      : [{ type: "text" as const, text: `${PARSE_PROMPT}\n\nResume text to parse:\n${source.text}` }];

  const { output } = await generateText({
    // Anthropic direct (ANTHROPIC_API_KEY). Opus 5 rejects temperature; omit it.
    model: anthropic("claude-opus-5"),
    output: Output.object({ schema: profileDataSchema }),
    maxOutputTokens: 16000,
    messages: [{ role: "user", content }],
  });

  if (!output) {
    throw new Error("AI failed to parse resume — no structured output returned");
  }

  return output as ProfileData;
}
