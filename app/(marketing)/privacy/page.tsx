import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy — Interview Coach",
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16 md:px-8">
      <Link
        href="/"
        className="text-sm text-muted-foreground hover:text-foreground"
      >
        ← Back home
      </Link>
      <h1 className="mt-6 text-2xl font-semibold text-foreground">Privacy</h1>
      <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
        This placeholder page will hold your privacy policy. Update it before
        launch.
      </p>
    </div>
  );
}
