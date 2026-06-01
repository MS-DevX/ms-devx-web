import { NextResponse } from "next/server";

import { contactFormSchema } from "@/lib/schemas/contact";
import type { ContactApiResponse } from "@/lib/types";

const WEB3FORMS_URL = "https://api.web3forms.com/submit";

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

    const accessKey = process.env.WEB3FORMS_ACCESS_KEY;

    if (!accessKey) {
      return NextResponse.json(
        { success: false, error: "Email service is not configured" } satisfies ContactApiResponse,
        { status: 500 }
      );
    }

    const { name, email, subject, message } = parsed.data;

    const response = await fetch(WEB3FORMS_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        access_key: accessKey,
        name,
        email,
        subject: `[MS DevX Contact] ${subject}`,
        message,
        from_name: "MS DevX",
        replyto: email,
      }),
    });

    const result: unknown = await response.json();

    if (!response.ok) {
      const errorMessage =
        typeof result === "object" && result !== null && "message" in result
          ? String((result as Record<string, unknown>).message)
          : "Unable to send your message. Please try again.";

      return NextResponse.json(
        { success: false, error: errorMessage } satisfies ContactApiResponse,
        { status: response.status }
      );
    }

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
