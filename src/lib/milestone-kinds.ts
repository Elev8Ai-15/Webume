export const MILESTONE_KINDS = {
  promotion: "Promoted",
  win: "Key project win",
  launch: "Launch",
  event: "Event",
  award: "Award",
  certification: "Certified",
  review: "Performance review",
  custom: "Milestone",
} as const;
export type MilestoneKind = keyof typeof MILESTONE_KINDS;
