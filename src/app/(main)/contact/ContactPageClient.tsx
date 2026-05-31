"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  AlertCircle,
  Calendar,
  CheckCircle2,
  Clock,
  Loader2,
  Mail,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";

import SocialLinks from "@/components/shared/SocialLinks";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { siteConfig } from "@/lib/constants";
import { contactFormSchema } from "@/lib/schemas/contact";
import type {
  ContactApiResponse,
  ContactFormValues,
  ContactPageClientProps,
} from "@/lib/types";
import { cn } from "@/lib/utils";

type FormStatus = "idle" | "loading" | "success" | "error";

export default function ContactPageClient({
  className,
  faqs = [],
}: ContactPageClientProps) {
  const [status, setStatus] = useState<FormStatus>("idle");
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  const onSubmit = async (values: ContactFormValues) => {
    setStatus("loading");
    setSubmitError(null);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const data = (await response.json()) as ContactApiResponse;

      if (!response.ok || !data.success) {
        const message =
          !data.success && data.error
            ? data.error
            : "Unable to send your message. Please try again.";
        throw new Error(message);
      }

      setStatus("success");
      reset();
    } catch (error) {
      setStatus("error");
      setSubmitError(
        error instanceof Error
          ? error.message
          : "Unable to send your message. Please try again."
      );
    }
  };

  const isSubmitting = status === "loading";

  return (
    <main className={cn("py-20", className)}>
      <div className="container">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <h1 className="text-4xl font-bold text-navy dark:text-white">
            Get in Touch
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            Have a project idea, partnership inquiry, or question about our
            tools? Send us a message and we&apos;ll get back to you as soon as
            possible.
          </p>
        </div>

        <div className="grid gap-10 lg:grid-cols-2">
          <Card className="border-white/10 bg-background py-6">
            <CardHeader>
              <CardTitle className="text-xl text-navy dark:text-white">
                Send a Message
              </CardTitle>
              <CardDescription>
                Fill out the form below and our team will respond within 1–2
                business days.
              </CardDescription>
            </CardHeader>

            <CardContent>
              {status === "success" && (
                <div
                  role="status"
                  className="mb-6 flex items-start gap-3 rounded-lg border border-teal/30 bg-teal/10 p-4 text-sm text-navy dark:text-white"
                >
                  <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-teal" />
                  <div>
                    <p className="font-medium">Message sent successfully</p>
                    <p className="mt-1 text-muted-foreground">
                      Thank you for reaching out. We&apos;ll be in touch soon.
                    </p>
                  </div>
                </div>
              )}

              {status === "error" && submitError && (
                <div
                  role="alert"
                  className="mb-6 flex items-start gap-3 rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm"
                >
                  <AlertCircle className="mt-0.5 size-5 shrink-0 text-destructive" />
                  <div>
                    <p className="font-medium text-destructive">
                      Failed to send message
                    </p>
                    <p className="mt-1 text-muted-foreground">{submitError}</p>
                  </div>
                </div>
              )}

              <form
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-5"
                noValidate
              >
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium">
                    Name
                  </label>
                  <Input
                    id="name"
                    type="text"
                    autoComplete="name"
                    placeholder="Your name"
                    aria-invalid={Boolean(errors.name)}
                    disabled={isSubmitting}
                    {...register("name")}
                  />
                  {errors.name && (
                    <p className="text-sm text-destructive">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">
                    Email
                  </label>
                  <Input
                    id="email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    aria-invalid={Boolean(errors.email)}
                    disabled={isSubmitting}
                    {...register("email")}
                  />
                  {errors.email && (
                    <p className="text-sm text-destructive">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label htmlFor="subject" className="text-sm font-medium">
                    Subject
                  </label>
                  <Input
                    id="subject"
                    type="text"
                    placeholder="What is this about?"
                    aria-invalid={Boolean(errors.subject)}
                    disabled={isSubmitting}
                    {...register("subject")}
                  />
                  {errors.subject && (
                    <p className="text-sm text-destructive">
                      {errors.subject.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-medium">
                    Message
                  </label>
                  <Textarea
                    id="message"
                    rows={6}
                    placeholder="Tell us about your project or question..."
                    aria-invalid={Boolean(errors.message)}
                    disabled={isSubmitting}
                    {...register("message")}
                  />
                  {errors.message && (
                    <p className="text-sm text-destructive">
                      {errors.message.message}
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  size="lg"
                  disabled={isSubmitting}
                  className="w-full bg-electric text-white hover:bg-electric/90 sm:w-auto"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="animate-spin" />
                      Sending...
                    </>
                  ) : (
                    "Send Message"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className="border-white/10 bg-background py-6">
              <CardHeader>
                <CardTitle className="text-xl text-navy dark:text-white">
                  Contact Information
                </CardTitle>
                <CardDescription>
                  Prefer email? Reach us directly or connect on social media.
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-5">
                <div className="flex items-start gap-3">
                  <Mail className="mt-0.5 size-5 shrink-0 text-electric" />
                  <div>
                    <p className="text-sm font-medium">Email</p>
                    <Link
                      href={`mailto:${siteConfig.contactEmail}`}
                      className="text-sm text-electric transition hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-electric focus-visible:ring-offset-2"
                    >
                      {siteConfig.contactEmail}
                    </Link>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="mt-0.5 size-5 shrink-0 text-electric" />
                  <div>
                    <p className="text-sm font-medium">Response Time</p>
                    <p className="text-sm text-muted-foreground">
                      We typically reply within 1–2 business days.
                    </p>
                  </div>
                </div>

                <div>
                  <p className="mb-3 text-sm font-medium">Follow Us</p>
                  <SocialLinks />
                </div>
              </CardContent>
            </Card>

            <Card className="border-electric/30 bg-electric/5 py-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl text-navy dark:text-white">
                  <Calendar className="size-5 text-electric" />
                  Schedule a Call
                </CardTitle>
                <CardDescription>
                  Book a free 30-minute discovery call to discuss your project,
                  timeline, and goals.
                </CardDescription>
              </CardHeader>

              <CardContent>
                <div className="rounded-lg border border-dashed border-white/20 bg-background/50 p-6 text-center">
                  <p className="text-sm font-medium text-navy dark:text-white">
                    Calendly integration coming soon
                  </p>
                  <p className="mt-2 text-xs text-muted-foreground">
                    In the meantime, use the contact form or email us directly.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {faqs.length > 0 && (
          <section className="mt-16">
            <h2 className="mb-6 text-center text-2xl font-bold text-navy dark:text-white">
              Frequently Asked Questions
            </h2>
            <div className="mx-auto max-w-3xl rounded-xl border border-white/10 bg-background px-4 sm:px-6">
              <Accordion type="single" collapsible className="w-full">
                {faqs.map((item) => (
                  <AccordionItem key={item.question} value={item.question}>
                    <AccordionTrigger className="text-left text-navy dark:text-white">
                      {item.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      {item.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
            <p className="mt-4 text-center text-sm text-muted-foreground">
              Ready to start?{" "}
              <Link href="/hire" className="text-electric hover:underline">
                View hiring packages
              </Link>
            </p>
          </section>
        )}
      </div>
    </main>
  );
}
