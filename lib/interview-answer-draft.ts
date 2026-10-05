export const ANSWER_MAX_LENGTH = 12000;
export interface AnswerDraft {
  text: string;
  interim: string;
  base: string;
  listening: boolean;
  recordingId: number;
}
export type DraftAction =
  | { type: "start" }
  | { type: "speech"; recordingId: number; final: string; interim: string }
  | { type: "stop"; recordingId?: number }
  | { type: "edit"; text: string }
  | { type: "reset" };
export const emptyAnswerDraft: AnswerDraft = {
  text: "",
  interim: "",
  base: "",
  listening: false,
  recordingId: 0,
};
const join = (...parts: string[]) =>
  parts
    .map((p) => p.trim())
    .filter(Boolean)
    .join(" ");
export function updateAnswerDraft(
  state: AnswerDraft,
  action: DraftAction,
): AnswerDraft {
  switch (action.type) {
    case "start":
      return {
        ...state,
        base: state.text,
        interim: "",
        listening: true,
        recordingId: state.recordingId + 1,
      };
    case "speech":
      if (!state.listening || action.recordingId !== state.recordingId)
        return state;
      return {
        ...state,
        text: join(state.base, action.final),
        interim: action.interim.trim(),
      };
    case "stop":
      if (
        !state.listening ||
        (action.recordingId !== undefined &&
          action.recordingId !== state.recordingId)
      )
        return state;
      // Preserve the latest provisional words for the candidate to review.
      return {
        ...state,
        text: join(state.text, state.interim),
        interim: "",
        listening: false,
      };
    case "edit":
      return state.listening ? state : { ...state, text: action.text };
    case "reset":
      return { ...emptyAnswerDraft, recordingId: state.recordingId + 1 };
  }
}
export function canSubmitAnswer(state: AnswerDraft): boolean {
  return (
    !state.listening &&
    state.text.trim().length > 0 &&
    state.text.length <= ANSWER_MAX_LENGTH
  );
}
