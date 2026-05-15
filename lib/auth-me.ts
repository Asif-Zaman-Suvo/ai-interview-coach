import { api } from "@/lib/api";

export type AuthMeResponse = { user?: { role?: string } };

export async function fetchAuthMe(): Promise<AuthMeResponse> {
  return api.get("/auth/me");
}
