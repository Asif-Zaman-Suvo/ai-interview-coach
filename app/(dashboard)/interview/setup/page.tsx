"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { StepIndicator } from "@/components/interview/StepIndicator";
import { RoleSelection } from "@/components/interview/RoleSelection";
import { DifficultySelection } from "@/components/interview/DifficultySelection";
import { ResumeUpload } from "@/components/interview/ResumeUpload";
import { InterviewSummary } from "@/components/interview/InterviewSummary";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { Difficulty, Role } from "@/lib/types";
import { useRoles, useStartSession } from "@/lib/hooks/useInterview";
import { useSessionQuota } from "@/lib/hooks/useDashboard";
import { PLAN_LABEL } from "@/lib/types";
import { quotaUpgradeHref } from "@/lib/pricing-packs";

const steps = ["Resume", "Profile", "Target Interview", "Summary"];

import { ResumeProfileReview } from "@/components/interview/ResumeProfileReview";
import {
  uploadResume,
  analyzeResume,
  confirmResume,
  type ResumeProfile,
  type ResumeRecord,
} from "@/lib/resumes";

export default function InterviewSetupPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] =
    useState<Difficulty | null>(null);
  const [resumeFile, setResumeFile] = useState<File | null>(null);

  const [resume, setResume] = useState<ResumeRecord | null>(null);
  const [profile, setProfile] = useState<ResumeProfile | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [resumeError, setResumeError] = useState("");
  const processing = useRef(false);

  const { data: roles, isLoading: rolesLoading } = useRoles();
  const { mutate: startSession, isPending: isStarting } = useStartSession();
  const { data: quota } = useSessionQuota();

  const atLimit = Boolean(
    quota && !quota.adminUnlimited && !quota.canStartNewSession,
  );

  const canProceed = () =>
    currentStep === 1 ||
    (currentStep === 2 && Boolean(profile?.suggestedRole.trim())) ||
    (currentStep >= 3 && selectedRole !== null && selectedDifficulty !== null);

  const handleNext = async () => {
    if (processing.current || isStarting) return;
    processing.current = true;
    setIsProcessing(true);
    setResumeError("");
    try {
      if (currentStep === 1) {
        if (!resumeFile) {
          setCurrentStep(3);
          return;
        }
        if (profile && resume) {
          setCurrentStep(2);
          return;
        }
        const uploaded = resume ?? (await uploadResume(resumeFile));
        setResume(uploaded);
        const analyzed = await analyzeResume(uploaded.id);
        setResume(analyzed);
        setProfile(analyzed.profile);
        if (analyzed.profile) {
          const match = roles?.find(
            (role) =>
              role.name.toLowerCase() ===
              analyzed.profile!.suggestedRole.toLowerCase(),
          );
          if (!selectedRole && match) setSelectedRole(match);
          if (!selectedDifficulty)
            setSelectedDifficulty(
              analyzed.profile.experienceLevel === "Junior"
                ? "Easy"
                : analyzed.profile.experienceLevel === "Mid"
                  ? "Medium"
                  : "Hard",
            );
        }
        setCurrentStep(2);
      } else if (currentStep === 2) {
        setCurrentStep(3);
      } else if (currentStep === 3) {
        if (resume && profile && selectedRole && selectedDifficulty) {
          const confirmed = await confirmResume(
            resume.id,
            profile,
            selectedRole.id,
            selectedDifficulty,
          );
          setResume(confirmed);
        }
        setCurrentStep(4);
      } else if (selectedRole && selectedDifficulty) {
        startSession(
          {
            roleId: selectedRole.id,
            difficulty: selectedDifficulty,
            ...(resume ? { resumeId: resume.id } : {}),
          },
          { onSuccess: (data) => router.push(`/interview/${data.sessionId}`) },
        );
      }
    } catch (error) {
      setResumeError(
        error instanceof Error
          ? error.message
          : "Resume processing failed. Please retry.",
      );
    } finally {
      processing.current = false;
      setIsProcessing(false);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep === 3 && !profile ? 1 : currentStep - 1);
    }
  };

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 md:px-8">
      <Button
        variant="ghost"
        size="sm"
        disabled={isProcessing || isStarting}
        onClick={() => router.back()}
        className="mb-6"
      >
        <ChevronLeft className="size-4" />
        Back
      </Button>

      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-foreground">
          New Interview
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Set up your personalized interview session
        </p>
        {quota ? (
          quota.adminUnlimited ? (
            <p className="mt-2 text-xs text-muted-foreground">
              <span className="font-medium text-foreground">Administrator</span>
              {" — unlimited interviews"}
              {quota.sessionsUsed > 0 ? (
                <span className="tabular-nums">
                  {" "}
                  · {quota.sessionsUsed} completed
                </span>
              ) : null}
            </p>
          ) : (
            <p className="mt-2 text-xs text-muted-foreground">
              Active plan:{" "}
              <span className="font-medium text-foreground">
                {PLAN_LABEL[quota.plan]}
              </span>
              <span className="tabular-nums">
                {" "}
                · {quota.sessionsUsed}/{quota.sessionLimit} used
              </span>
            </p>
          )
        ) : null}
      </div>

      {atLimit && quota ? (
        <div
          className="mb-6 rounded-lg border border-amber-500/35 bg-amber-500/10 px-4 py-3 text-sm text-foreground"
          role="status"
        >
          <p className="font-medium">Interview limit reached</p>
          <p className="mt-1 text-muted-foreground">
            You&apos;ve used all {quota.sessionLimit} interviews in your current
            pack.{" "}
            <Link
              href={quotaUpgradeHref(quota.plan)}
              className="font-medium text-primary underline-offset-4 hover:underline"
            >
              {quota.plan === "pack_30" ? "View packs" : "Get a larger pack"}
            </Link>{" "}
            to continue.
          </p>
        </div>
      ) : null}

      <StepIndicator currentStep={currentStep} steps={steps} />

      <div className="mb-8">
        {currentStep === 1 && (
          <div className="space-y-3">
            <ResumeUpload
              disabled={isProcessing}
              selectedFile={resumeFile}
              onFileSelect={(file) => {
                if (processing.current) return;
                setResumeFile(file);
                setResume(null);
                setProfile(null);
                setResumeError("");
              }}
            />
            <p className="text-xs text-muted-foreground">
              Resume text is sent to our AI provider to detect professional
              experience and skills. Review the result before continuing. The
              uploaded file is not stored.
            </p>
            {isProcessing && (
              <p role="status" className="text-sm text-muted-foreground">
                Extracting and analyzing your resume…
              </p>
            )}
            {resumeError && resume && (
              <p className="text-sm text-muted-foreground">
                Your extracted resume is saved. Continue to retry without
                re-uploading.
              </p>
            )}
          </div>
        )}
        {currentStep === 2 && profile && (
          <ResumeProfileReview profile={profile} onChange={setProfile} />
        )}
        {currentStep === 3 && (
          <div className="space-y-6">
            <p className="text-sm text-muted-foreground">
              Choose the role you want to practice. It can differ from your
              detected profile. Questions currently come from the existing
              question bank.
            </p>
            <RoleSelection
              roles={roles}
              selectedRole={selectedRole}
              onSelect={(role) => {
                if (!processing.current) setSelectedRole(role);
              }}
              isLoading={rolesLoading}
            />
            <DifficultySelection
              selectedDifficulty={selectedDifficulty}
              onSelect={(difficulty) => {
                if (!processing.current) setSelectedDifficulty(difficulty);
              }}
            />
            {profile && (
              <Button
                variant="outline"
                disabled={isProcessing}
                onClick={() => setCurrentStep(2)}
              >
                Edit detected profile
              </Button>
            )}
          </div>
        )}
        {currentStep === 4 && (
          <InterviewSummary
            role={selectedRole!}
            difficulty={selectedDifficulty!}
            resumeFile={resumeFile}
          />
        )}
      </div>

      {resumeError && (
        <p role="alert" className="mb-4 text-sm text-destructive">
          {resumeError}
        </p>
      )}
      <div className="flex items-center justify-between pt-4 border-t border-border">
        <Button
          variant="ghost"
          onClick={handleBack}
          disabled={currentStep === 1 || isProcessing || isStarting}
        >
          <ChevronLeft className="size-4" />
          Back
        </Button>

        <Button
          variant="default"
          size="sm"
          onClick={handleNext}
          disabled={
            !canProceed() ||
            isStarting ||
            isProcessing ||
            (currentStep === steps.length && atLimit)
          }
        >
          {isStarting || isProcessing ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              {isStarting ? "Starting..." : "Processing..."}
            </>
          ) : currentStep === steps.length ? (
            "Start Interview"
          ) : (
            <>
              Continue
              <ChevronRight className="size-4" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
