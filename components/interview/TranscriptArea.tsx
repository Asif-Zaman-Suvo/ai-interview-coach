import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Volume2 } from "lucide-react";

interface TranscriptAreaProps {
  transcript: string;
  isListening: boolean;
}

export function TranscriptArea({
  transcript,
  isListening,
}: TranscriptAreaProps) {
  return (
    <Card className="border border-border shadow-none">
      <div className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <Volume2 className="size-4 text-muted-foreground" />
          <h3 className="text-sm font-medium text-foreground">Transcript</h3>
          {isListening && (
            <span className="relative ml-auto flex size-6 shrink-0 items-center justify-center">
              <span
                className="absolute inset-0 m-auto inline-flex size-3 animate-ping rounded-full bg-primary opacity-75"
                aria-hidden
              />
              <span className="relative inline-flex size-2 shrink-0 rounded-full bg-primary" />
            </span>
          )}
        </div>

        <div className="min-h-[120px] max-h-[200px] overflow-y-auto">
          {isListening && !transcript ? (
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-4/5" />
              <Skeleton className="h-4 w-3/5" />
            </div>
          ) : transcript ? (
            <p className="text-sm text-foreground leading-relaxed">
              {transcript}
            </p>
          ) : (
            <p className="text-sm text-muted-foreground italic">
              Your answer will appear here as you speak...
            </p>
          )}
        </div>
      </div>
    </Card>
  );
}
