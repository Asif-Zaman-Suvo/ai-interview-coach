import { Button } from "@/components/ui/button";
import { Mic, MicOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";

interface MicButtonProps {
  isRecording: boolean;
  onToggle: () => void;
  disabled?: boolean;
}

export function MicButton({
  isRecording,
  onToggle,
  disabled = false,
}: MicButtonProps) {
  const [showWaveform, setShowWaveform] = useState(false);

  useEffect(() => {
    if (isRecording) {
      setShowWaveform(true);
    } else {
      const timer = setTimeout(() => setShowWaveform(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isRecording]);

  return (
    <div className="flex flex-col items-center gap-4">
      <Button
        size="lg"
        onClick={onToggle}
        disabled={disabled}
        aria-label={isRecording ? "Stop recording" : "Start recording"}
        className={cn(
          "size-20 rounded-full transition-all duration-300",
          isRecording
            ? "bg-destructive hover:bg-destructive/90 scale-105"
            : "bg-primary hover:bg-primary/90",
        )}
      >
        {isRecording ? (
          <MicOff className="size-8 text-white" />
        ) : (
          <Mic className="size-8 text-primary-foreground" />
        )}
      </Button>

      {showWaveform && (
        <div className="flex items-center gap-1 h-8" aria-hidden="true">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className={cn(
                "w-1 bg-primary rounded-full transition-all duration-300",
                isRecording ? "animate-pulse" : "",
              )}
              style={{
                height: isRecording ? `${16 + Math.random() * 16}px` : "4px",
                animationDelay: `${i * 100}ms`,
              }}
            />
          ))}
        </div>
      )}

      <p className="text-sm text-muted-foreground">
        {isRecording ? "Listening..." : "Tap to speak"}
      </p>
    </div>
  );
}
