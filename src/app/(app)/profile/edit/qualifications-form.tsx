"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  updateQualifications,
  type QualificationsInput,
} from "@/lib/actions/qualifications.actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
export function QualificationsForm({
  initial,
}: {
  initial: QualificationsInput;
}) {
  const [data, setData] = useState(initial);
  const [certifications, setCertifications] = useState(
    initial.certifications.join("\n"),
  );
  const [message, setMessage] = useState("");
  const [pending, startTransition] = useTransition();
  const router = useRouter();
  return (
    <Card>
      <CardHeader>
        <CardTitle>Education & recognition</CardTitle>
      </CardHeader>
      <CardContent>
        <form
          className="space-y-8"
          onSubmit={(event) => {
            event.preventDefault();
            setMessage("");
            startTransition(async () => {
              const result = await updateQualifications({
                ...data,
                certifications: certifications
                  .split("\n")
                  .map((s) => s.trim())
                  .filter(Boolean),
              });
              setMessage(
                result.success ? "Qualifications saved." : result.error,
              );
              if (result.success) router.refresh();
            });
          }}
        >
          <fieldset disabled={pending} className="space-y-5">
            <legend className="mb-4 text-base font-medium">Education</legend>
            {data.education.map((item, index) => (
              <div
                key={index}
                className="space-y-4 rounded-xl border border-white/10 p-5"
              >
                <div className="grid gap-4 sm:grid-cols-2">
                  {(
                    [
                      ["degree", "Degree or program"],
                      ["school", "School or institution"],
                      ["year", "Year"],
                    ] as const
                  ).map(([key, label]) => (
                    <div key={key} className="space-y-2">
                      <Label htmlFor={`education-${index}-${key}`}>
                        {label}
                      </Label>
                      <Input
                        id={`education-${index}-${key}`}
                        value={item[key]}
                        required={key !== "year"}
                        maxLength={key === "year" ? 50 : 200}
                        onChange={(e) =>
                          setData((d) => ({
                            ...d,
                            education: d.education.map((row, i) =>
                              i === index
                                ? { ...row, [key]: e.target.value }
                                : row,
                            ),
                          }))
                        }
                      />
                    </div>
                  ))}
                </div>
                <Label htmlFor={`education-details-${index}`}>Details</Label>
                <Textarea
                  id={`education-details-${index}`}
                  maxLength={1000}
                  value={item.details}
                  onChange={(e) =>
                    setData((d) => ({
                      ...d,
                      education: d.education.map((row, i) =>
                        i === index ? { ...row, details: e.target.value } : row,
                      ),
                    }))
                  }
                />
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() =>
                    setData((d) => ({
                      ...d,
                      education: d.education.filter((_, i) => i !== index),
                    }))
                  }
                >
                  Remove education entry
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              disabled={data.education.length >= 30}
              onClick={() =>
                setData((d) => ({
                  ...d,
                  education: [
                    ...d.education,
                    { degree: "", school: "", year: "", details: "" },
                  ],
                }))
              }
            >
              Add education
            </Button>
          </fieldset>
          <div className="space-y-2">
            <Label htmlFor="certifications">Certifications</Label>
            <Textarea
              id="certifications"
              value={certifications}
              disabled={pending}
              onChange={(e) => setCertifications(e.target.value)}
              rows={4}
            />
            <p className="text-xs text-muted-foreground">
              One certification per line. Include only credentials you hold.
            </p>
          </div>
          <fieldset disabled={pending} className="space-y-5">
            <legend className="mb-4 text-base font-medium">Achievements</legend>
            {data.achievements.map((item, index) => (
              <div
                key={index}
                className="space-y-3 rounded-xl border border-white/10 p-5"
              >
                <Label htmlFor={`achievement-title-${index}`}>Title</Label>
                <Input
                  id={`achievement-title-${index}`}
                  required
                  maxLength={200}
                  value={item.title}
                  onChange={(e) =>
                    setData((d) => ({
                      ...d,
                      achievements: d.achievements.map((row, i) =>
                        i === index ? { ...row, title: e.target.value } : row,
                      ),
                    }))
                  }
                />
                <Label htmlFor={`achievement-description-${index}`}>
                  Description
                </Label>
                <Textarea
                  id={`achievement-description-${index}`}
                  maxLength={2000}
                  value={item.description}
                  onChange={(e) =>
                    setData((d) => ({
                      ...d,
                      achievements: d.achievements.map((row, i) =>
                        i === index
                          ? { ...row, description: e.target.value }
                          : row,
                      ),
                    }))
                  }
                />
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() =>
                    setData((d) => ({
                      ...d,
                      achievements: d.achievements.filter(
                        (_, i) => i !== index,
                      ),
                    }))
                  }
                >
                  Remove achievement
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              disabled={data.achievements.length >= 50}
              onClick={() =>
                setData((d) => ({
                  ...d,
                  achievements: [
                    ...d.achievements,
                    { title: "", description: "" },
                  ],
                }))
              }
            >
              Add achievement
            </Button>
          </fieldset>
          <Button type="submit" disabled={pending}>
            {pending ? "Saving…" : "Save qualifications"}
          </Button>
          <p role="status" className="text-sm text-muted-foreground">
            {message}
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
