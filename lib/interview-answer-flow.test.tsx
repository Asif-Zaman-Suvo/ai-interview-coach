// @vitest-environment jsdom
import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
} from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import LiveInterviewPage from "@/app/(dashboard)/interview/[sessionId]/page";
const mocks = vi.hoisted(() => ({
  submit: vi.fn(),
  complete: vi.fn(),
  push: vi.fn(),
  pending: false,
}));
vi.mock("next/navigation", () => ({
  useParams: () => ({ sessionId: "session" }),
  useRouter: () => ({ push: mocks.push, back: vi.fn() }),
}));
vi.mock("@/lib/hooks/useInterview", () => ({
  useSessionDetail: () => ({
    data: {
      id: "session",
      questions: [
        {
          id: "q1",
          text: "First question",
          category: "Technical",
          difficulty: "Easy",
        },
        {
          id: "q2",
          text: "Second question",
          category: "Technical",
          difficulty: "Easy",
        },
      ],
    },
    isLoading: false,
    isError: false,
  }),
  useSubmitAnswer: () => ({ mutate: mocks.submit, isPending: mocks.pending }),
  useCompleteSession: () => ({ mutate: mocks.complete, isPending: false }),
}));
class Recognition {
  static instances: Recognition[] = [];
  continuous = false;
  interimResults = false;
  lang = "";
  onresult:
    | ((event: {
        resultIndex: number;
        results: { isFinal: boolean; 0: { transcript: string } }[];
      }) => void)
    | null = null;
  onend: (() => void) | null = null;
  onerror: ((event: { error: string }) => void) | null = null;
  constructor() {
    Recognition.instances.push(this);
  }
  start() {}
  stop() {
    this.onend?.();
  }
  emit(final: string, interim = "") {
    this.onresult?.({
      resultIndex: 0,
      results: [
        { isFinal: true, 0: { transcript: final } },
        { isFinal: false, 0: { transcript: interim } },
      ],
    });
  }
}
const answer = () =>
  screen.getByRole("textbox", { name: "Your answer" }) as HTMLTextAreaElement;
const submit = () =>
  screen.getByRole("button", { name: "Submit Answer" }) as HTMLButtonElement;
async function startRecording() {
  await act(async () => {
    fireEvent.click(screen.getByRole("button", { name: "Start recording" }));
  });
  return Recognition.instances.at(-1)!;
}
describe("candidate transcript review", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.submit.mockReset();
    mocks.pending = false;
    Recognition.instances = [];
    Object.assign(window, {
      SpeechRecognition: Recognition,
      webkitSpeechRecognition: undefined,
    });
  });
  afterEach(cleanup);
  it("shows speech in the field, separates interim words, and requires explicit review/submit", async () => {
    render(<LiveInterviewPage />);
    const recognition = await startRecording();
    act(() => recognition.emit("var is scoped", "live words"));
    expect(answer().value).toBe("var is scoped");
    expect(answer().readOnly).toBe(true);
    expect(screen.getByText("live words")).toBeTruthy();
    expect(submit().disabled).toBe(true);
    fireEvent.click(screen.getByRole("button", { name: "Stop recording" }));
    expect(answer().value).toBe("var is scoped live words");
    expect(answer().readOnly).toBe(false);
    expect(mocks.submit).not.toHaveBeenCalled();
    expect(screen.getByText("Microphone stopped")).toBeTruthy();
    fireEvent.change(answer(), {
      target: { value: "var is function-scoped." },
    });
    act(() => recognition.emit("late incorrect words"));
    expect(answer().value).toBe("var is function-scoped.");
    fireEvent.click(submit());
    expect(mocks.submit.mock.calls[0][0]).toEqual({
      questionId: "q1",
      transcript: "var is function-scoped.",
    });
  });
  it("supports fully typed answers without speech recognition and rejects blank text", () => {
    Object.assign(window, { SpeechRecognition: undefined });
    render(<LiveInterviewPage />);
    expect(submit().disabled).toBe(true);
    fireEvent.change(answer(), { target: { value: "   " } });
    fireEvent.click(submit());
    expect(mocks.submit).not.toHaveBeenCalled();
    fireEvent.change(answer(), { target: { value: "A fully typed answer." } });
    fireEvent.click(submit());
    expect(mocks.submit.mock.calls[0][0].transcript).toBe(
      "A fully typed answer.",
    );
  });
  it("appends new speech to manual edits and ignores older recording events", async () => {
    render(<LiveInterviewPage />);
    const first = await startRecording();
    act(() => first.emit("incorrect words"));
    fireEvent.click(screen.getByRole("button", { name: "Stop recording" }));
    fireEvent.change(answer(), { target: { value: "Reviewed answer." } });
    const second = await startRecording();
    act(() => first.emit("stale overwrite"));
    expect(answer().value).toBe("Reviewed answer.");
    act(() => second.emit("Extra detail."));
    expect(answer().value).toBe("Reviewed answer. Extra detail.");
  });
  it("resets the answer for the next question and ignores previous speech", async () => {
    render(<LiveInterviewPage />);
    const first = await startRecording();
    act(() => first.emit("First answer"));
    fireEvent.click(screen.getByRole("button", { name: "Stop recording" }));
    mocks.submit.mockImplementation((_body, callbacks) =>
      callbacks.onSuccess({
        feedback: "Good",
        score: 80,
        strengths: [],
        improvements: [],
        nextQuestion: { id: "q2" },
      }),
    );
    fireEvent.click(submit());
    expect(answer().readOnly).toBe(true);
    fireEvent.click(screen.getByRole("button", { name: "Next Question" }));
    expect(answer().value).toBe("");
    expect(submit().disabled).toBe(true);
    act(() => first.emit("Late first answer"));
    expect(answer().value).toBe("");
    expect(screen.getByText("Second question")).toBeTruthy();
  });
  it("stopping naturally makes provisional speech editable without submitting", async () => {
    render(<LiveInterviewPage />);
    const recognition = await startRecording();
    act(() => recognition.emit("Final words", "last provisional words"));
    act(() => recognition.onend?.());
    expect(answer().value).toBe("Final words last provisional words");
    expect(answer().readOnly).toBe(false);
    expect(submit().disabled).toBe(false);
    expect(mocks.submit).not.toHaveBeenCalled();
  });
  it("locks the reviewed answer and preserves loading feedback during evaluation", () => {
    const { rerender } = render(<LiveInterviewPage />);
    fireEvent.change(answer(), { target: { value: "Reviewed answer" } });
    mocks.pending = true;
    rerender(<LiveInterviewPage />);
    expect(answer().value).toBe("Reviewed answer");
    expect(answer().readOnly).toBe(true);
    expect(
      (
        screen.getByRole("button", {
          name: "Submitting...",
        }) as HTMLButtonElement
      ).disabled,
    ).toBe(true);
    expect(
      (
        screen.getByRole("button", {
          name: "Start recording",
        }) as HTMLButtonElement
      ).disabled,
    ).toBe(true);
  });
  it("blocks speech answers longer than the backend limit until shortened", async () => {
    render(<LiveInterviewPage />);
    const recognition = await startRecording();
    act(() => recognition.emit("x".repeat(12001)));
    fireEvent.click(screen.getByRole("button", { name: "Stop recording" }));
    expect(answer().maxLength).toBe(12000);
    expect(submit().disabled).toBe(true);
    expect(screen.getByText(/shorten your answer/)).toBeTruthy();
    fireEvent.change(answer(), { target: { value: "Shortened answer" } });
    expect(submit().disabled).toBe(false);
  });
});
