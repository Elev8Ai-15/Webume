import type { ProfileData } from "@/lib/types/profile";

interface ATSResult {
  score: number;
  grade: string;
  matches: string[];
  suggestions: string[];
  tips: string[];
}

const COMMON_KEYWORDS = [
  "leadership",
  "management",
  "strategy",
  "analytics",
  "communication",
  "project management",
  "team",
  "budget",
  "revenue",
  "growth",
  "development",
  "implementation",
  "optimization",
  "collaboration",
  "stakeholder",
  "presentation",
  "reporting",
  "analysis",
  "planning",
];

export function calculateATSScore(profile: ProfileData): ATSResult {
  const profileText = [
    profile.basics.summary,
    profile.basics.title,
    ...profile.skills,
    ...profile.experience.flatMap((e) => [
      e.role,
      e.description,
      ...e.responsibilities,
    ]),
    ...profile.achievements.flatMap((a) => [a.title, a.description]),
  ]
    .join(" ")
    .toLowerCase();
  const skills = profile.skills ?? [];

  let score = 0;
  const matches: string[] = [];
  const missing: string[] = [];

  for (const keyword of COMMON_KEYWORDS) {
    if (profileText.includes(keyword.toLowerCase())) {
      score += 5;
      matches.push(keyword);
    } else {
      missing.push(keyword);
    }
  }

  // Completeness bonuses
  if (profile.basics?.name) score += 5;
  if (profile.basics?.email) score += 5;
  if (profile.basics?.phone) score += 3;
  if (profile.basics?.summary && profile.basics.summary.length > 100)
    score += 10;
  if (profile.experience?.length > 0) score += 15;
  if (profile.experience?.length > 2) score += 5;
  if (skills.length >= 5) score += 10;
  if (skills.length >= 10) score += 5;
  if (profile.education?.length > 0) score += 5;
  if (profile.achievements?.length > 0) score += 5;

  score = Math.min(100, score);

  const grade =
    score >= 90
      ? "A+"
      : score >= 80
        ? "A"
        : score >= 70
          ? "B"
          : score >= 60
            ? "C"
            : "D";

  const tips = [
    score < 70 ? "Add more quantifiable achievements with numbers" : null,
    skills.length < 10 ? "Add more relevant skills to improve matching" : null,
    !profile.basics?.summary ? "Add a professional summary" : null,
    profile.experience?.length < 2 ? "Add more work experience details" : null,
  ].filter((t): t is string => t !== null);

  return {
    score,
    grade,
    matches: matches.slice(0, 10),
    suggestions: missing
      .slice(0, 5)
      .map(
        (k) => `If supported by your experience, describe your work in "${k}"`,
      ),
    tips,
  };
}
