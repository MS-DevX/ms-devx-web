import nodemailer from "nodemailer";
import { NextResponse } from "next/server";

import { contactFormSchema } from "@/lib/schemas/contact";
import type { ContactApiResponse } from "@/lib/types";

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

const MAX_BODY_BYTES = 32_768;

export async function POST(request: Request) {
  try {
    const contentLength = request.headers.get("content-length");

    if (contentLength && Number.parseInt(contentLength, 10) > MAX_BODY_BYTES) {
      return NextResponse.json(
        { success: false, error: "Request body too large" } satisfies ContactApiResponse,
        { status: 413 }
      );
    }

    const body: unknown = await request.json();
    const parsed = contactFormSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Validation failed",
          details: parsed.error.flatten().fieldErrors,
        } satisfies ContactApiResponse,
        { status: 400 }
      );
    }

    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;

    if (!smtpUser || !smtpPass) {
      return NextResponse.json(
        { success: false, error: "Email service is not configured" } satisfies ContactApiResponse,
        { status: 500 }
      );
    }

    const { name, email, subject, message } = parsed.data;

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: { user: smtpUser, pass: smtpPass },
    });

    await transporter.sendMail({
      from: `"${escapeHtml(name)}" <${smtpUser}>`,
      to: "marthsystems@gmail.com",
      replyTo: email,
      subject: `[MS DevX Contact] ${subject}`,
      html: `
        <h2>New contact form submission</h2>
        <p><strong>Name:</strong> ${escapeHtml(name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(email)}</p>
        <p><strong>Subject:</strong> ${escapeHtml(subject)}</p>
        <p><strong>Message:</strong></p>
        <p>${escapeHtml(message).replace(/\n/g, "<br />")}</p>
      `,
    });

    return NextResponse.json(
      { success: true, message: "Your message has been sent successfully." } satisfies ContactApiResponse
    );
  } catch (error) {
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { success: false, error: "Invalid JSON body" } satisfies ContactApiResponse,
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: "An unexpected error occurred" } satisfies ContactApiResponse,
      { status: 500 }
    );
  }
}
