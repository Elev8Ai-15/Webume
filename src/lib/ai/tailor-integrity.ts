import type { ProfileData } from "@/lib/types/profile";
import type { TailorResult } from "./tailor-resume";
const norm = (value: string) => value.trim().toLowerCase().replace(/\s+/g, " ");
const numbers = (value: string) => value.match(/\d[\d,.]*(?:%|x)?/g) ?? [];
/** Blocks detectable factual changes. Semantic claims still require owner review. */
export function validateTailoredFacts(
  source: ProfileData,
  result: TailorResult,
): void {
  const draft = result.tailoredProfile;
  if (norm(draft.basics.name) !== norm(source.basics.name))
    throw new Error("The draft changed your identity. Please retry.");
  const used = new Set<number>();
  for (const job of draft.experience) {
    const index = source.experience.findIndex(
      (e) =>
        [e.company, e.role, e.startDate, e.endDate].map(norm).join("|") ===
        [job.company, job.role, job.startDate, job.endDate].map(norm).join("|"),
    );
    if (index < 0 || used.has(index))
      throw new Error(
        "The draft changed or duplicated an employment fact. Please retry.",
      );
    used.add(index);
    const original = source.experience[index];
    const known = new Set(
      numbers(
        [
          original.description,
          ...original.responsibilities,
          ...original.metrics.map((m) => `${m.value} ${m.label}`),
        ].join(" "),
      ),
    );
    if (
      numbers([job.description, ...job.highlights].join(" ")).some(
        (n) => !known.has(n),
      )
    )
      throw new Error(
        "The draft introduced an unsupported number. Please retry.",
      );
  }
  const skills = new Set(source.skills.map(norm));
  if (draft.skills.some((s) => !skills.has(norm(s))))
    throw new Error("The draft added an unlisted skill. Please retry.");
  const certs = new Set(source.certifications.map(norm));
  if (draft.certifications.some((c) => !certs.has(norm(c))))
    throw new Error("The draft added a credential. Please retry.");
  if (
    draft.education.some(
      (e) =>
        !source.education.some(
          (o) =>
            [o.degree, o.school, o.year, o.details].map(norm).join("|") ===
            [e.degree, e.school, e.year, e.details].map(norm).join("|"),
        ),
    )
  )
    throw new Error("The draft changed an education fact. Please retry.");
  // Contact information and the candidate's actual title always come from the source.
  draft.basics = {
    ...draft.basics,
    name: source.basics.name,
    title: source.basics.title,
    email: source.basics.email,
    phone: source.basics.phone,
    location: source.basics.location,
  };
  const knownSummaryNumbers = new Set(numbers(JSON.stringify(source)));
  if (numbers(draft.basics.summary).some((n) => !knownSummaryNumbers.has(n)))
    throw new Error(
      "The summary introduced an unsupported number. Please retry.",
    );
}
