"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { StepIndicator } from "@/components/interview/StepIndicator";
import { RoleSelection } from "@/components/interview/RoleSelection";
import { DifficultySelection } from "@/components/interview/DifficultySelection";
import { ResumeUpload } from "@/components/interview/ResumeUpload";
import { InterviewSummary } from "@/components/interview/InterviewSummary";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { JobRole, Difficulty } from "@/lib/types";

const steps = ["Role", "Difficulty", "Resume", "Summary"];

export default function InterviewSetupPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedRole, setSelectedRole] = useState<JobRole | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | null>(null);
  const [resumeFile, setResumeFile] = useState<File | null>(null);

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

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    } else {
      // Start interview - navigate to interview session
      const sessionId = `sess-${Date.now()}`;
      router.push(`/interview/${sessionId}`);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-6 py-8">
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
      </div>

      <StepIndicator
        currentStep={currentStep}
        totalSteps={steps.length}
        steps={steps}
      />

      <div className="mb-8">
        {currentStep === 1 && (
          <RoleSelection
            selectedRole={selectedRole}
            onSelect={setSelectedRole}
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
          disabled={!canProceed()}
        >
          {currentStep === steps.length ? (
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
