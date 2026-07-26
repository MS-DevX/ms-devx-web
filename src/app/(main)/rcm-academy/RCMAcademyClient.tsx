"use client";

import { CheckCircle2, Loader2 } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";

type FormStatus = "idle" | "loading" | "success" | "error";

export default function RCMAcademyClient() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<FormStatus>("idle");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim() || !email.includes("@")) {
      setError("Please enter a valid email address.");
      setStatus("error");
      return;
    }

    setStatus("loading");
    setError(null);

    try {
      const response = await fetch("/api/closed-testing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          app: "rcm-academy",
        }),
      });

      if (!response.ok) {
        throw new Error("Something went wrong. Please try again.");
      }

      setStatus("success");
      setEmail("");
    } catch {
      setStatus("error");
      setError(
        "Unable to sign up right now. Please try again later or email us directly."
      );
    }
  };

  return (
    <Card className="border-border bg-background py-6">
      <CardHeader>
        <CardTitle className="text-xl text-foreground">
          Get Notified at Launch
        </CardTitle>
        <CardDescription>
          Be the first to know when RCM Academy goes live on Google Play.
          Enter your email and we&apos;ll send you a notification.
        </CardDescription>
      </CardHeader>

      <CardContent>
        {status === "success" ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="mb-4 flex size-14 items-center justify-center rounded-full bg-teal/10">
              <CheckCircle2 className="size-7 text-teal" />
            </div>
            <h3 className="mb-2 text-lg font-bold text-foreground">
              You&apos;re on the list!
            </h3>
            <p className="max-w-sm text-sm text-muted-foreground">
              We&apos;ll notify you as soon as RCM Academy launches on Google
              Play. Keep an eye on your inbox.
            </p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setStatus("idle")}
              className="mt-6"
            >
              Sign up another email
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            {status === "error" && error && (
              <p className="text-sm text-destructive">{error}</p>
            )}

            <div className="flex gap-3">
              <Input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={status === "loading"}
                required
                className="flex-1"
              />
              <Button
                type="submit"
                disabled={status === "loading"}
                className="bg-electric text-white hover:bg-electric/90"
              >
                {status === "loading" ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  "Notify Me"
                )}
              </Button>
            </div>

            <p className="text-[11px] text-muted-foreground">
              We&apos;ll only use your email to notify you about RCM Academy
              launches. No spam, ever. Unsubscribe anytime.
            </p>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
