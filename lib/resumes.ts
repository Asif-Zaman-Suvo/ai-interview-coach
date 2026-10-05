import { api } from "@/lib/api";
import { apiUrl } from "@/lib/api-url";
import type { Difficulty } from "@/lib/types";
export interface ResumeProfile {
  suggestedRole: string;
  experienceLevel: "Junior" | "Mid" | "Senior" | "Lead";
  estimatedYearsOfExperience: number | null;
  coreSkills: string[];
  additionalSkills: string[];
  workExperience: {
    title: string;
    company: string | null;
    duration: string | null;
  }[];
  projects: {
    name: string | null;
    description: string;
    technologies: string[];
  }[];
}
export interface ResumeRecord {
  id: string;
  status: string;
  format: string;
  profile: ResumeProfile | null;
  targetRoleId: string | null;
  difficulty: Difficulty | null;
}
export async function uploadResume(file: File): Promise<ResumeRecord> {
  const form = new FormData();
  form.append("file", file);
  const response = await fetch(apiUrl("/resumes"), {
    method: "POST",
    credentials: "include",
    body: form,
  });
  const body: unknown = await response.json();
  if (!response.ok) {
    const message =
      body &&
      typeof body === "object" &&
      "message" in body &&
      typeof body.message === "string"
        ? body.message
        : "Resume upload failed. Please try again.";
    throw new Error(message);
  }
  return body as ResumeRecord;
}
export const analyzeResume = (id: string) =>
  api.post<ResumeRecord>(`/resumes/${id}/analyze`, {});
export const confirmResume = (
  id: string,
  profile: ResumeProfile,
  targetRoleId: string,
  difficulty: Difficulty,
) =>
  api.patch<ResumeRecord>(`/resumes/${id}/confirm`, {
    profile,
    targetRoleId,
    difficulty,
  });
