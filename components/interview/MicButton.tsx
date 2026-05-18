import { Button } from "@/components/ui/button";
import { Mic, Square } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

const WAVE_BAR_HEIGHTS_PX = [18, 24, 20, 26, 22] as const;

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
  const [linger, setLinger] = useState(false);

  useEffect(() => {
    if (isRecording) {
      queueMicrotask(() => setLinger(true));
      return;
    }
    const timer = setTimeout(() => setLinger(false), 300);
    return () => clearTimeout(timer);
  }, [isRecording]);

  const showWaveform = isRecording || linger;

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
            ? "bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-700 scale-105"
            : "bg-primary hover:bg-primary/90",
        )}
      >
        {isRecording ? (
          <Square className="size-7 fill-white text-white" aria-hidden />
        ) : (
          <Mic className="size-8 text-primary-foreground" />
        )}
      </Button>

      {showWaveform && (
        <div className="flex items-center gap-1 h-8" aria-hidden="true">
          {Array.from({ length: WAVE_BAR_HEIGHTS_PX.length }).map((_, i) => (
            <div
              key={i}
              className={cn(
                "w-1 rounded-full transition-all duration-300",
                isRecording ? "bg-emerald-500 animate-pulse" : "bg-primary",
              )}
              style={{
                height: isRecording ? `${WAVE_BAR_HEIGHTS_PX[i]}px` : "4px",
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
