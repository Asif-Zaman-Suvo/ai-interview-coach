"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmailPasswordLoginForm } from "@/components/auth/EmailPasswordLoginForm";
import { useRedirectIfAuthenticated } from "@/lib/hooks/useRedirectIfAuthenticated";

export default function AdminLoginPage() {
  useRedirectIfAuthenticated();
  const [googleErr, setGoogleErr] = useState("");

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md border border-border shadow-none">
        <div className="p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-semibold text-foreground">
              Admin sign in
            </h1>
            <p className="text-sm text-muted-foreground mt-2">
              Administrator access only
            </p>
          </div>

          <EmailPasswordLoginForm mode="admin" />

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-card text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              className="w-full mt-4"
              onClick={() =>
                setGoogleErr("Google sign-in is not configured on the server.")
              }
            >
              Google
            </Button>
            {googleErr ? (
              <p className="text-sm text-destructive text-center mt-3" role="alert">
                {googleErr}
              </p>
            ) : null}
          </div>

          <div className="mt-6 space-y-3 text-center text-sm">
            <p>
              <Link
                href="/login"
                className="text-muted-foreground hover:text-foreground underline underline-offset-4"
              >
                Back to user sign in
              </Link>
            </p>
            <p className="text-muted-foreground">
              Don&apos;t have an account?{" "}
              <Link
                href="/register"
                className="text-primary hover:underline font-medium"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
