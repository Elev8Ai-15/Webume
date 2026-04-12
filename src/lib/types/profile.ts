export interface ProfileBasics {
  name: string;
  title: string;
  tagline: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  website: string;
  summary: string;
}

export interface CompanyInfo {
  website: string;
  domain: string;
  industry: string;
  location: string;
  size: string;
  description: string;
}

export interface DayInLifeEntry {
  time: string;
  activity: string;
}

export interface Metric {
  value: string;
  label: string;
}

export interface Experience {
  company: string;
  companyInfo: CompanyInfo;
  role: string;
  startDate: string;
  endDate: string;
  description: string;
  responsibilities: string[];
  dayInLife: DayInLifeEntry[];
  metrics: Metric[];
}

export interface Achievement {
  title: string;
  description: string;
}

export interface Education {
  degree: string;
  school: string;
  year: string;
  details: string;
}

export interface ProfileData {
  basics: ProfileBasics;
  experience: Experience[];
  skills: string[];
  achievements: Achievement[];
  education: Education[];
  certifications: string[];
}

export type TemplateId =
  | "executive"
  | "corporate"
  | "nonprofit"
  | "healthcare"
  | "restaurant"
  | "trades"
  | "beauty"
  | "creative"
  | "tech"
  | "minimal";

export const VALID_TEMPLATES: TemplateId[] = [
  "executive",
  "corporate",
  "nonprofit",
  "healthcare",
  "restaurant",
  "trades",
  "beauty",
  "creative",
  "tech",
  "minimal",
];
