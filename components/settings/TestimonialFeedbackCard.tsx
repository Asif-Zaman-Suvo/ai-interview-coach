"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTestimonialFeedback } from "@/lib/hooks/useTestimonialFeedback";

const RATINGS = [5, 4, 3, 2, 1] as const;

export function TestimonialFeedbackCard() {
  const { data, isLoading, submit, isSubmitting } = useTestimonialFeedback();
  const existing = data?.testimonial ?? null;

  const [rating, setRating] = useState<string>("5");
  const [quote, setQuote] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [authorRole, setAuthorRole] = useState("");

  useEffect(() => {
    if (!existing) return;
    setRating(String(existing.rating));
    setQuote(existing.quote);
    setAuthorName(existing.name);
    setAuthorRole(existing.role);
  }, [existing]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const r = Number(rating);
    await submit({
      rating: r,
      quote,
      authorName,
      authorRole,
    });
  };

  return (
    <Card className="border border-border shadow-none">
      <CardHeader>
        <CardTitle>Homepage testimonial</CardTitle>
        <CardDescription>
          Share a short quote for the “Trusted by job seekers” section. You can
          update it anytime; one submission per account.
        </CardDescription>
      </CardHeader>
      <form
        className="flex min-w-0 flex-col"
        onSubmit={handleSubmit}
      >
        <CardContent className="space-y-4 pb-2">
          {isLoading ? (
            <div className="h-24 rounded-lg bg-muted/60 animate-pulse" />
          ) : null}
          <div className="space-y-2">
            <Label id="rating-label">Rating</Label>
            <Select
              value={rating}
              onValueChange={(v) => {
                if (v) setRating(v);
              }}
            >
              <SelectTrigger className="w-full max-w-xs" aria-labelledby="rating-label">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {RATINGS.map((n) => (
                  <SelectItem key={n} value={String(n)}>
                    {n} {n === 1 ? "star" : "stars"}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="testimonial-quote">Your quote</Label>
            <Textarea
              id="testimonial-quote"
              value={quote}
              onChange={(e) => setQuote(e.target.value)}
              placeholder="What helped you practice or land your role? (20–600 characters)"
              minLength={20}
              maxLength={600}
              rows={4}
              required
              className="min-h-[100px]"
            />
            <p className="text-xs text-muted-foreground">{quote.length}/600</p>
          </div>
          <div className="grid w-full min-w-0 grid-cols-1 gap-x-6 gap-y-4 md:grid-cols-2 md:items-start">
            <div className="min-w-0 space-y-2">
              <Label htmlFor="testimonial-name" className="block w-full">
                Name (shown publicly)
              </Label>
              <Input
                id="testimonial-name"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                placeholder="e.g. Sarah K."
                minLength={2}
                maxLength={80}
                required
                autoComplete="name"
                className="w-full max-w-full"
              />
            </div>
            <div className="min-w-0 space-y-2">
              <Label htmlFor="testimonial-role" className="block w-full">
                Title &amp; company
              </Label>
              <Input
                id="testimonial-role"
                value={authorRole}
                onChange={(e) => setAuthorRole(e.target.value)}
                placeholder="e.g. Frontend Developer at Stripe"
                minLength={2}
                maxLength={120}
                required
                className="w-full max-w-full"
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="mt-6 border-t bg-muted/30 flex flex-col gap-4 p-6 sm:flex-row sm:items-end sm:justify-between">
          <p className="text-xs leading-relaxed text-muted-foreground max-w-xl text-pretty">
            Submissions are public on the marketing site. Use initials if you
            prefer not to share your full name.
          </p>
          <Button
            type="submit"
            size="sm"
            className="w-full shrink-0 sm:w-auto"
            disabled={isSubmitting || isLoading}
          >
            {existing ? "Update testimonial" : "Submit testimonial"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
