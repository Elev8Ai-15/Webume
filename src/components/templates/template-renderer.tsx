"use client";

import type { ProfileData, TemplateId } from "@/lib/types/profile";
import { getTemplate } from "@/lib/templates/template-registry";
import { ProfileHero } from "./shared/profile-hero";
import { ExperienceTimeline } from "./shared/experience-timeline";
import { SkillsSection } from "./shared/skills-section";
import { EducationSection } from "./shared/education-section";

interface Props {
  profileData: ProfileData;
  templateId: TemplateId;
  profilePhoto?: string | null;
}

export function TemplateRenderer({
  profileData,
  templateId,
  profilePhoto,
}: Props) {
  const template = getTemplate(templateId);
  const accent = template.color;

  return (
    <div
      className="mx-auto max-w-3xl space-y-8 rounded-xl border bg-card p-8"
      data-template={templateId}
      style={
        {
          "--template-primary": template.color,
          "--template-accent": template.accent2,
        } as React.CSSProperties
      }
    >
      <ProfileHero
        basics={profileData.basics}
        profilePhoto={profilePhoto}
        accentColor={accent}
      />

      <ExperienceTimeline
        experiences={profileData.experience}
        accentColor={accent}
      />

      <SkillsSection skills={profileData.skills} accentColor={accent} />

      <EducationSection
        education={profileData.education}
        certifications={profileData.certifications}
        accentColor={accent}
      />

      {profileData.achievements.length > 0 && (
        <div className="space-y-3">
          <h2
            className="text-lg font-semibold uppercase tracking-wider"
            style={{ color: accent }}
          >
            Achievements
          </h2>
          <div className="space-y-2">
            {profileData.achievements.map((a, i) => (
              <div key={i}>
                <p className="font-semibold">{a.title}</p>
                <p className="text-sm text-muted-foreground">
                  {a.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
