import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, FileText, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useRef } from "react";

interface ResumeUploadProps {
  onFileSelect: (file: File | null) => void;
}

export function ResumeUpload({ onFileSelect }: ResumeUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);

  const acceptedTypes = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];
  const maxSize = 5 * 1024 * 1024; // 5MB

  const validateFile = (file: File): boolean => {
    if (!acceptedTypes.includes(file.type)) {
      setError("Please upload a PDF or Word document");
      return false;
    }
    if (file.size > maxSize) {
      setError("File size must be less than 5MB");
      return false;
    }
    setError("");
    return true;
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (validateFile(droppedFile)) {
        setFile(droppedFile);
        onFileSelect(droppedFile);
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target;
    const selectedFile = input.files?.[0];
    if (!selectedFile) return;
    if (validateFile(selectedFile)) {
      setFile(selectedFile);
      onFileSelect(selectedFile);
    } else {
      input.value = "";
    }
  };

  const openFileDialog = () => {
    inputRef.current?.click();
  };

  const handleRemove = () => {
    setFile(null);
    onFileSelect(null);
    setError("");
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  return (
    <div>
      <h2 className="text-base font-semibold text-foreground mb-4">
        Upload your resume (optional)
      </h2>

      {file ? (
        <Card className="border border-border shadow-none">
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-md bg-muted">
                <FileText className="size-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">{file.name}</p>
                <p className="text-xs text-muted-foreground">
                  {(file.size / 1024).toFixed(1)} KB
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRemove}
              aria-label="Remove file"
            >
              <X className="size-4" />
            </Button>
          </div>
        </Card>
      ) : (
        <Card
          className={cn(
            "border shadow-none transition-colors",
            dragActive ? "border-primary bg-primary/5" : "border-border"
          )}
        >
          <div
            className="p-8"
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <div className="flex flex-col items-center justify-center text-center">
              <label
                htmlFor="resume-upload"
                className="cursor-pointer flex flex-col items-center"
              >
                <div className="flex size-12 items-center justify-center rounded-full bg-muted mb-3">
                  <Upload className="size-6 text-muted-foreground" />
                </div>
                <p className="text-sm font-medium text-foreground mb-1">
                  {dragActive ? "Drop your resume here" : "Upload your resume"}
                </p>
                <p className="text-xs text-muted-foreground mb-3">
                  PDF or Word, up to 5MB
                </p>
              </label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.preventDefault();
                  openFileDialog();
                }}
              >
                Browse files
              </Button>
              <input
                ref={inputRef}
                id="resume-upload"
                type="file"
                className="sr-only"
                accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                onChange={handleChange}
              />
            </div>
          </div>
        </Card>
      )}

      {error && (
        <p className="text-sm text-destructive mt-2" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
