import { useState } from "react";
import type { ResumeProfile } from "@/lib/resumes";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface Props {
  profile: ResumeProfile;
  onChange: (profile: ResumeProfile) => void;
}
const inputStyle =
  "w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm";
function SkillInput({
  values,
  onChange,
}: {
  values: string[];
  onChange: (value: string[]) => void;
}) {
  const [text, setText] = useState(values.join(", "));
  return (
    <Input
      value={text}
      maxLength={1600}
      onChange={(e) => {
        setText(e.target.value);
        onChange(
          e.target.value
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean),
        );
      }}
    />
  );
}
export function ResumeProfileReview({ profile, onChange }: Props) {
  const update = <K extends keyof ResumeProfile>(
    key: K,
    value: ResumeProfile[K],
  ) => onChange({ ...profile, [key]: value });
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-base font-semibold">Resume analyzed</h2>
        <p className="text-sm text-muted-foreground">
          Review and correct your detected professional profile. Choose your
          target interview separately in the next step.
        </p>
      </div>
      <Card className="p-6 space-y-4 shadow-none">
        <h3 className="font-medium">Suggested profile</h3>
        <label className="space-y-1 block text-sm">
          Detected role
          <Input
            value={profile.suggestedRole}
            maxLength={120}
            onChange={(e) => update("suggestedRole", e.target.value)}
          />
        </label>
        <label className="space-y-1 block text-sm">
          Experience level
          <select
            className={inputStyle}
            value={profile.experienceLevel}
            onChange={(e) =>
              update(
                "experienceLevel",
                e.target.value as ResumeProfile["experienceLevel"],
              )
            }
          >
            {["Junior", "Mid", "Senior", "Lead"].map((level) => (
              <option key={level}>{level}</option>
            ))}
          </select>
        </label>
        <label className="space-y-1 block text-sm">
          Estimated years of experience
          <Input
            type="number"
            min={0}
            max={60}
            step={0.5}
            value={profile.estimatedYearsOfExperience ?? ""}
            onChange={(e) =>
              update(
                "estimatedYearsOfExperience",
                e.target.value === "" ? null : Number(e.target.value),
              )
            }
          />
        </label>
        <label className="space-y-1 block text-sm">
          Core skills (comma separated)
          <SkillInput
            values={profile.coreSkills}
            onChange={(value) => update("coreSkills", value)}
          />
        </label>
        <label className="space-y-1 block text-sm">
          Additional skills (comma separated)
          <SkillInput
            values={profile.additionalSkills}
            onChange={(value) => update("additionalSkills", value)}
          />
        </label>
        <p className="text-xs text-muted-foreground">
          Keep up to 20 skills per list. Include professional information only.
        </p>
      </Card>
      {profile.workExperience.length > 0 && (
        <Card className="p-6 space-y-4 shadow-none">
          <h3 className="font-medium">Work experience</h3>
          {profile.workExperience.map((job, i) => (
            <div key={i} className="grid gap-2 md:grid-cols-3">
              {(["title", "company", "duration"] as const).map((key) => (
                <label key={key} className="text-sm">
                  {key === "title"
                    ? "Job title"
                    : key === "company"
                      ? "Company"
                      : "Duration"}
                  <Input
                    maxLength={120}
                    value={job[key] ?? ""}
                    onChange={(e) =>
                      update(
                        "workExperience",
                        profile.workExperience.map((j, index) =>
                          index === i
                            ? {
                                ...j,
                                [key]:
                                  e.target.value ||
                                  (key === "title" ? "" : null),
                              }
                            : j,
                        ),
                      )
                    }
                  />
                </label>
              ))}
            </div>
          ))}
        </Card>
      )}
      {profile.projects.length > 0 && (
        <Card className="p-6 space-y-4 shadow-none">
          <h3 className="font-medium">Projects</h3>
          {profile.projects.map((project, i) => (
            <div key={i} className="space-y-2">
              <label className="block text-sm">
                Project name
                <Input
                  maxLength={120}
                  value={project.name ?? ""}
                  onChange={(e) =>
                    update(
                      "projects",
                      profile.projects.map((p, index) =>
                        index === i
                          ? { ...p, name: e.target.value || null }
                          : p,
                      ),
                    )
                  }
                />
              </label>
              <label className="block text-sm">
                Project description
                <textarea
                  className={inputStyle}
                  maxLength={500}
                  value={project.description}
                  onChange={(e) =>
                    update(
                      "projects",
                      profile.projects.map((p, index) =>
                        index === i ? { ...p, description: e.target.value } : p,
                      ),
                    )
                  }
                />
              </label>
              <label className="block text-sm">
                Technologies (comma separated)
                <SkillInput
                  values={project.technologies}
                  onChange={(value) =>
                    update(
                      "projects",
                      profile.projects.map((p, index) =>
                        index === i ? { ...p, technologies: value } : p,
                      ),
                    )
                  }
                />
              </label>
            </div>
          ))}
        </Card>
      )}
    </div>
  );
}
