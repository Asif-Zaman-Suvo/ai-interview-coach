"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { api } from "@/lib/api";

type Props = {
  /** Regular login → `/dashboard`; admin entry validates role then `/admin/dashboard` */
  mode: "user" | "admin";
};

export function EmailPasswordLoginForm({ mode }: Props) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const { error: signError } = await authClient.signIn.email({
      email,
      password,
    });

    if (signError) {
      setError(signError.message ?? "Sign in failed");
      setIsLoading(false);
      return;
    }

    await queryClient.invalidateQueries({ queryKey: ["auth-user"] });

    try {
      const me = await api.get<{ user?: { role?: string } }>("/auth/me");
      const profileRole = me?.user?.role;

      if (mode === "admin") {
        if (profileRole !== "admin") {
          await authClient.signOut();
          setError("This account is not an administrator.");
          setIsLoading(false);
          return;
        }
        router.push("/admin/dashboard");
      } else {
        router.push(
          profileRole === "admin" ? "/admin/dashboard" : "/dashboard",
        );
      }
    } catch {
      router.push("/dashboard");
    }

    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="name@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={isLoading}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isLoading}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <EyeOff className="size-4" />
            ) : (
              <Eye className="size-4" />
            )}
          </button>
        </div>
      </div>

      {error && (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      )}

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Signing in..." : "Sign In"}
      </Button>
    </form>
  );
}
