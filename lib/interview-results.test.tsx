// @vitest-environment jsdom
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import InterviewResultPage from "@/app/(dashboard)/interview/result/[sessionId]/page";
const state = vi.hoisted(() => ({
  session: {
    id: "s",
    role: "Backend Developer",
    difficulty: "Medium",
    startedAt: "2026-10-05T00:00:00Z",
    score: 80,
    duration: 60,
    status: "completed",
    questions: [],
    feedback: [],
    summary: "Clear caching examples, but trade-offs need deeper explanation.",
    topImprovements: [
      "Compare two invalidation strategies.",
      "Quantify the impact of your examples.",
    ],
    summarySource: "llm",
    provider: "private-provider",
  },
}));
vi.mock("next/navigation", () => ({ useParams: () => ({ sessionId: "s" }) }));
vi.mock("@/lib/hooks/useHistory", () => ({
  useSessionById: () => ({
    data: state.session,
    isLoading: false,
    isError: false,
  }),
}));
afterEach(cleanup);
describe("persisted interview summary", () => {
  it("renders summary and prioritized improvements even without per-answer highlights", () => {
    render(<InterviewResultPage />);
    expect(
      screen.getByRole("heading", { name: "Overall Interview Summary" }),
    ).toBeTruthy();
    expect(screen.getByText(state.session.summary)).toBeTruthy();
    for (const improvement of state.session.topImprovements)
      expect(screen.getByText(improvement)).toBeTruthy();
    expect(screen.queryByText("private-provider")).toBeNull();
    expect(screen.queryByText("llm")).toBeNull();
  });
  it("renders old results without persisted summary fields", () => {
    const previous = state.session;
    state.session = { ...previous, summary: "", topImprovements: [] };
    try {
      render(<InterviewResultPage />);
      expect(screen.getByText("Interview Results")).toBeTruthy();
      expect(
        screen.queryByRole("heading", { name: "Overall Interview Summary" }),
      ).toBeNull();
    } finally {
      state.session = previous;
    }
  });
});
