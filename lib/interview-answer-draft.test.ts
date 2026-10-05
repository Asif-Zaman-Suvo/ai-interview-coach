import { describe, expect, it } from "vitest";
import {
  emptyAnswerDraft,
  updateAnswerDraft,
  canSubmitAnswer,
  ANSWER_MAX_LENGTH,
} from "./interview-answer-draft";
describe("reviewed answer draft", () => {
  it("keeps interim speech separate and makes it reviewable on stop", () => {
    let draft = updateAnswerDraft(emptyAnswerDraft, { type: "start" });
    draft = updateAnswerDraft(draft, {
      type: "speech",
      recordingId: draft.recordingId,
      final: "Final words",
      interim: "provisional words",
    });
    expect(draft.text).toBe("Final words");
    expect(draft.interim).toBe("provisional words");
    expect(canSubmitAnswer(draft)).toBe(false);
    draft = updateAnswerDraft(draft, { type: "stop" });
    expect(draft.text).toBe("Final words provisional words");
    expect(draft.interim).toBe("");
    expect(canSubmitAnswer(draft)).toBe(true);
  });
  it("protects edits from stale speech and appends a new recording", () => {
    const recording = updateAnswerDraft(emptyAnswerDraft, { type: "start" });
    let draft = updateAnswerDraft(recording, { type: "stop" });
    draft = updateAnswerDraft(draft, {
      type: "edit",
      text: "Corrected answer.",
    });
    const late = {
      type: "speech" as const,
      recordingId: recording.recordingId,
      final: "wrong",
      interim: "",
    };
    expect(updateAnswerDraft(draft, late)).toEqual(draft);
    draft = updateAnswerDraft(draft, { type: "start" });
    expect(updateAnswerDraft(draft, late)).toEqual(draft);
    draft = updateAnswerDraft(draft, {
      type: "speech",
      recordingId: draft.recordingId,
      final: "New detail.",
      interim: "",
    });
    expect(draft.text).toBe("Corrected answer. New detail.");
  });
  it("rejects edits while listening and ignores events after reset", () => {
    const recording = updateAnswerDraft(emptyAnswerDraft, { type: "start" });
    expect(
      updateAnswerDraft(recording, { type: "edit", text: "overwrite" }),
    ).toEqual(recording);
    const reset = updateAnswerDraft(recording, { type: "reset" });
    expect(reset.text).toBe("");
    expect(reset.interim).toBe("");
    expect(
      updateAnswerDraft(reset, {
        type: "speech",
        recordingId: recording.recordingId,
        final: "old question",
        interim: "",
      }),
    ).toEqual(reset);
  });
  it("prevents blank and over-limit answers", () => {
    for (const text of ["", "   ", "x".repeat(ANSWER_MAX_LENGTH + 1)]) {
      expect(canSubmitAnswer({ ...emptyAnswerDraft, text })).toBe(false);
    }
    expect(canSubmitAnswer({ ...emptyAnswerDraft, text: "typed answer" })).toBe(
      true,
    );
    expect(
      canSubmitAnswer({
        ...emptyAnswerDraft,
        text: "x".repeat(ANSWER_MAX_LENGTH),
      }),
    ).toBe(true);
  });
});
