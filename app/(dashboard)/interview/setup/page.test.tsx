// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import Page from "./page";
const mocks = vi.hoisted(() => ({
  upload: vi.fn(),
  analyze: vi.fn(),
  confirm: vi.fn(),
  start: vi.fn(),
  push: vi.fn(),
}));
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: mocks.push, back: vi.fn() }),
}));
vi.mock("@/lib/hooks/useInterview", () => ({
  useRoles: () => ({
    data: [
      { id: "front", name: "Frontend Engineer", icon: "code" },
      { id: "full", name: "Full Stack Engineer", icon: "code" },
    ],
    isLoading: false,
  }),
  useStartSession: () => ({ mutate: mocks.start, isPending: false }),
}));
vi.mock("@/lib/hooks/useDashboard", () => ({
  useSessionQuota: () => ({ data: null }),
}));
vi.mock("@/lib/resumes", () => ({
  uploadResume: mocks.upload,
  analyzeResume: mocks.analyze,
  confirmResume: mocks.confirm,
}));
const profile = {
  suggestedRole: "Frontend Engineer",
  experienceLevel: "Mid",
  estimatedYearsOfExperience: 3,
  coreSkills: ["React"],
  additionalSkills: ["Node.js"],
  workExperience: [
    { title: "Engineer", company: "Example", duration: "3 years" },
  ],
  projects: [
    {
      name: "Dashboard",
      description: "Reporting tool",
      technologies: ["React"],
    },
  ],
};
const record = {
  id: "resume1",
  status: "analyzed",
  format: "pdf",
  profile,
  targetRoleId: null,
  difficulty: null,
};
const next = () =>
  fireEvent.click(screen.getByRole("button", { name: /^Continue/ }));
const selectFile = (extension = "pdf") =>
  fireEvent.change(screen.getByLabelText("Upload your resume"), {
    target: {
      files: [
        new File(["synthetic"], `resume.${extension}`, {
          type:
            extension === "pdf"
              ? "application/pdf"
              : "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        }),
      ],
    },
  });
afterEach(cleanup);
beforeEach(() => {
  vi.clearAllMocks();
  mocks.upload.mockResolvedValue({
    ...record,
    status: "extracted",
    profile: null,
  });
  mocks.analyze.mockResolvedValue(record);
  mocks.confirm.mockResolvedValue({ ...record, status: "confirmed" });
});
describe("resume setup and review", () => {
  it("renders analysis, saves corrections, allows a different target/difficulty, and starts with a resume reference", async () => {
    render(<Page />);
    selectFile();
    next();
    await screen.findByText("Resume analyzed");
    expect(
      (screen.getByLabelText("Detected role") as HTMLInputElement).value,
    ).toBe("Frontend Engineer");
    fireEvent.change(screen.getByLabelText("Detected role"), {
      target: { value: "Senior Frontend Engineer" },
    });
    fireEvent.change(screen.getByLabelText("Core skills (comma separated)"), {
      target: { value: "Angular, TypeScript" },
    });
    next();
    fireEvent.click(
      await screen.findByRole("button", { name: "Full Stack Engineer" }),
    );
    fireEvent.click(screen.getByRole("button", { name: /Hard/ }));
    next();
    await screen.findByText("Ready to start your interview");
    expect(mocks.confirm).toHaveBeenCalledWith(
      "resume1",
      expect.objectContaining({
        suggestedRole: "Senior Frontend Engineer",
        coreSkills: ["Angular", "TypeScript"],
      }),
      "full",
      "Hard",
    );
    fireEvent.click(screen.getByRole("button", { name: "Start Interview" }));
    expect(mocks.start).toHaveBeenCalledWith(
      { roleId: "full", difficulty: "Hard", resumeId: "resume1" },
      expect.any(Object),
    );
    expect(mocks.start.mock.calls[0][0]).not.toHaveProperty("resumeText");
  });
  it("allows correcting experience and detected professional details", async () => {
    render(<Page />);
    selectFile();
    next();
    await screen.findByText("Resume analyzed");
    expect(
      (
        screen.getByLabelText(
          "Core skills (comma separated)",
        ) as HTMLInputElement
      ).value,
    ).toBe("React");
    fireEvent.change(screen.getByLabelText("Experience level"), {
      target: { value: "Senior" },
    });
    fireEvent.change(screen.getByLabelText("Estimated years of experience"), {
      target: { value: "5" },
    });
    fireEvent.change(screen.getByLabelText("Job title"), {
      target: { value: "Senior Engineer" },
    });
    fireEvent.change(screen.getByLabelText("Project description"), {
      target: { value: "Reviewed project description" },
    });
    next();
    await screen.findByText("Select your target role");
    next();
    await screen.findByText("Ready to start your interview");
    expect(mocks.confirm).toHaveBeenCalledWith(
      "resume1",
      expect.objectContaining({
        experienceLevel: "Senior",
        estimatedYearsOfExperience: 5,
        workExperience: [
          { title: "Senior Engineer", company: "Example", duration: "3 years" },
        ],
        projects: [
          {
            name: "Dashboard",
            description: "Reviewed project description",
            technologies: ["React"],
          },
        ],
      }),
      "front",
      "Medium",
    );
  });
  it("accepts DOCX and retries analysis without re-upload", async () => {
    mocks.analyze.mockRejectedValueOnce(
      new Error("Resume analysis timed out. Retry without uploading again."),
    );
    render(<Page />);
    selectFile("docx");
    next();
    await screen.findByRole("alert");
    next();
    await screen.findByText("Resume analyzed");
    expect(mocks.upload).toHaveBeenCalledTimes(1);
    expect(mocks.analyze).toHaveBeenCalledTimes(2);
  });
  it("preserves corrections when returning through upload step", async () => {
    render(<Page />);
    selectFile();
    next();
    await screen.findByText("Resume analyzed");
    fireEvent.change(screen.getByLabelText("Detected role"), {
      target: { value: "Reviewed role" },
    });
    fireEvent.click(screen.getAllByRole("button", { name: "Back" })[1]);
    next();
    await waitFor(() =>
      expect(
        (screen.getByLabelText("Detected role") as HTMLInputElement).value,
      ).toBe("Reviewed role"),
    );
    expect(mocks.analyze).toHaveBeenCalledTimes(1);
  });
  it("supports skipping CV and requires a target role and difficulty", async () => {
    render(<Page />);
    next();
    await screen.findByText("Select your target role");
    expect(
      (screen.getByRole("button", { name: /^Continue/ }) as HTMLButtonElement)
        .disabled,
    ).toBe(true);
    fireEvent.click(
      screen.getByRole("button", { name: "Full Stack Engineer" }),
    );
    fireEvent.click(screen.getByRole("button", { name: /Easy/ }));
    next();
    await screen.findByText("Ready to start your interview");
    fireEvent.click(screen.getByRole("button", { name: "Start Interview" }));
    expect(mocks.start).toHaveBeenCalledWith(
      { roleId: "full", difficulty: "Easy" },
      expect.any(Object),
    );
    expect(mocks.upload).not.toHaveBeenCalled();
  });
  it("rejects legacy DOC and oversized files before upload", () => {
    render(<Page />);
    fireEvent.change(screen.getByLabelText("Upload your resume"), {
      target: {
        files: [new File(["x"], "resume.doc", { type: "application/msword" })],
      },
    });
    expect(screen.getByRole("alert").textContent).toMatch(/PDF or DOCX/);
    const huge = new File(["x"], "resume.pdf", { type: "application/pdf" });
    Object.defineProperty(huge, "size", { value: 5 * 1024 * 1024 + 1 });
    fireEvent.change(screen.getByLabelText("Upload your resume"), {
      target: { files: [huge] },
    });
    expect(screen.getByRole("alert").textContent).toMatch(/5MB/);
    expect(mocks.upload).not.toHaveBeenCalled();
  });
});
