import type { TemplateId } from "@/lib/types/profile";

export interface TemplateConfig {
  id: TemplateId;
  name: string;
  desc: string;
  category: string;
  color: string;
  accent2: string;
  gradient: string;
  industries: string[];
}

export const TEMPLATES: TemplateConfig[] = [
  {
    id: "executive",
    name: "Executive Suite",
    desc: "Refined and authoritative for senior leadership",
    category: "professional",
    color: "#1e3a5f",
    accent2: "#c9a96e",
    gradient: "linear-gradient(135deg, #1e3a5f 0%, #2d5a8e 100%)",
    industries: ["Finance", "Consulting", "Law", "C-Suite"],
  },
  {
    id: "corporate",
    name: "Corporate Edge",
    desc: "Polished and professional for corporate roles",
    category: "professional",
    color: "#1E3A5F",
    accent2: "#D4AF37",
    gradient: "linear-gradient(135deg, #1E3A5F 0%, #2C3E50 100%)",
    industries: ["Business", "Management", "Operations", "HR"],
  },
  {
    id: "nonprofit",
    name: "Community Impact",
    desc: "Warm and mission-driven for nonprofit work",
    category: "professional",
    color: "#2E7D32",
    accent2: "#FF8F00",
    gradient: "linear-gradient(135deg, #2E7D32 0%, #388E3C 100%)",
    industries: ["Nonprofit", "Education", "Social Work", "Government"],
  },
  {
    id: "healthcare",
    name: "Care Professional",
    desc: "Clean and trustworthy for healthcare roles",
    category: "professional",
    color: "#0277BD",
    accent2: "#00838F",
    gradient: "linear-gradient(135deg, #0277BD 0%, #0288D1 100%)",
    industries: ["Healthcare", "Medical", "Nursing", "Pharma"],
  },
  {
    id: "restaurant",
    name: "Culinary Arts",
    desc: "Rich and inviting for food service careers",
    category: "service",
    color: "#BF360C",
    accent2: "#FF6F00",
    gradient: "linear-gradient(135deg, #BF360C 0%, #D84315 100%)",
    industries: ["Restaurant", "Hospitality", "Food Service", "Catering"],
  },
  {
    id: "trades",
    name: "Skilled Trades",
    desc: "Bold and practical for trades professionals",
    category: "service",
    color: "#E65100",
    accent2: "#FFB300",
    gradient: "linear-gradient(135deg, #E65100 0%, #F57C00 100%)",
    industries: ["Construction", "Electrical", "Plumbing", "HVAC"],
  },
  {
    id: "beauty",
    name: "Beauty & Style",
    desc: "Elegant and creative for beauty professionals",
    category: "creative",
    color: "#AD1457",
    accent2: "#E91E63",
    gradient: "linear-gradient(135deg, #AD1457 0%, #C2185B 100%)",
    industries: ["Beauty", "Fashion", "Cosmetics", "Salon"],
  },
  {
    id: "creative",
    name: "Creative Portfolio",
    desc: "Vibrant and expressive for creative professionals",
    category: "creative",
    color: "#6A1B9A",
    accent2: "#E040FB",
    gradient: "linear-gradient(135deg, #6A1B9A 0%, #7B1FA2 100%)",
    industries: ["Design", "Art", "Marketing", "Media"],
  },
  {
    id: "tech",
    name: "Tech Pioneer",
    desc: "Modern and dynamic for technology roles",
    category: "technical",
    color: "#06B6D4",
    accent2: "#8B5CF6",
    gradient: "linear-gradient(135deg, #06B6D4 0%, #0891B2 100%)",
    industries: ["Software", "IT", "Data Science", "Engineering"],
  },
  {
    id: "minimal",
    name: "Clean Minimal",
    desc: "Simple and versatile for any profession",
    category: "professional",
    color: "#10B981",
    accent2: "#6EE7B7",
    gradient: "linear-gradient(135deg, #10B981 0%, #059669 100%)",
    industries: ["Any"],
  },
];

export function getTemplate(id: TemplateId): TemplateConfig {
  return TEMPLATES.find((t) => t.id === id) ?? TEMPLATES[9]; // fallback to minimal
}
