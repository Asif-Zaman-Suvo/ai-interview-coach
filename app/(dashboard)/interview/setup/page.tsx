"use client";

import { useState } from "react";
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

const steps = ["Role", "Difficulty", "Resume", "Summary"];

export default function InterviewSetupPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | null>(null);
  const [resumeFile, setResumeFile] = useState<File | null>(null);

  const { data: roles, isLoading: rolesLoading } = useRoles();
  const { mutate: startSession, isPending: isStarting } = useStartSession();
  const { data: quota } = useSessionQuota();

  const atLimit = Boolean(
    quota && !quota.adminUnlimited && !quota.canStartNewSession,
  );

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return selectedRole !== null;
      case 2:
        return selectedDifficulty !== null;
      case 3:
        return true; // Resume is optional
      case 4:
        return selectedRole !== null && selectedDifficulty !== null;
      default:
        return false;
    }
  };

  const handleNext = async () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    } else {
      // Start interview with API
      if (!selectedRole || !selectedDifficulty) return;

      // Read resume file if uploaded
      let resumeText = "";
      if (resumeFile) {
        resumeText = await readResumeFile(resumeFile);
      }

      startSession(
        {
          roleId: selectedRole.id,
          difficulty: selectedDifficulty,
          resumeText: resumeText || undefined,
        },
        {
          onSuccess: (data) => {
            router.push(`/interview/${data.sessionId}`);
          },
        }
      );
    }
  };

  const readResumeFile = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        resolve(text);
      };
      reader.onerror = () => {
        reject(new Error('Failed to read resume file'));
      };
      reader.readAsText(file);
    });
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 md:px-8">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => router.back()}
        className="mb-6"
      >
        <ChevronLeft className="size-4" />
        Back
      </Button>

      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-foreground">New Interview</h1>
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
            You&apos;ve used all {quota.sessionLimit} interviews in your current pack.{" "}
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

      <StepIndicator
        currentStep={currentStep}
        steps={steps}
      />

      <div className="mb-8">
        {currentStep === 1 && (
          <RoleSelection
            roles={roles}
            selectedRole={selectedRole}
            onSelect={setSelectedRole}
            isLoading={rolesLoading}
          />
        )}
        {currentStep === 2 && (
          <DifficultySelection
            selectedDifficulty={selectedDifficulty}
            onSelect={setSelectedDifficulty}
          />
        )}
        {currentStep === 3 && (
          <ResumeUpload onFileSelect={setResumeFile} />
        )}
        {currentStep === 4 && (
          <InterviewSummary
            role={selectedRole!}
            difficulty={selectedDifficulty!}
            resumeFile={resumeFile}
          />
        )}
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-border">
        <Button
          variant="ghost"
          onClick={handleBack}
          disabled={currentStep === 1}
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
            (currentStep === steps.length && atLimit)
          }
        >
          {isStarting ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Starting...
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
