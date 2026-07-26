import { NextResponse } from "next/server";

import { z } from "zod";

const WEB3FORMS_URL = "https://api.web3forms.com/submit";

const closedTestingSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
  app: z.enum(["muslim-companion", "unit-converter", "rcm-academy"]),
});

type ClosedTestingApiResponse =
  | { success: true; message: string }
  | { success: false; error: string };

const MAX_BODY_BYTES = 8_192;

export async function POST(request: Request) {
  const contentLength = request.headers.get("content-length");

  if (contentLength && Number.parseInt(contentLength, 10) > MAX_BODY_BYTES) {
    return NextResponse.json(
      {
        success: false,
        error: "Request body too large",
      } satisfies ClosedTestingApiResponse,
      { status: 413 }
    );
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch (error) {
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid JSON body",
        } satisfies ClosedTestingApiResponse,
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: "An unexpected error occurred",
      } satisfies ClosedTestingApiResponse,
      { status: 500 }
    );
  }

  const parsed = closedTestingSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      {
        success: false,
        error: "Validation failed",
      } satisfies ClosedTestingApiResponse,
      { status: 400 }
    );
  }

  const accessKey = process.env.WEB3FORMS_ACCESS_KEY;

  if (!accessKey) {
    return NextResponse.json(
      {
        success: false,
        error: "Email service is not configured",
      } satisfies ClosedTestingApiResponse,
      { status: 500 }
    );
  }

  const { email, app } = parsed.data;

  const appLabel =
    app === "muslim-companion" ? "Muslim Companion" : "Unit Converter";

  let response: Response;

  try {
    response = await fetch(WEB3FORMS_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        access_key: accessKey,
        name: `Closed Testing — ${appLabel}`,
        email,
        subject: `[MS DevX Closed Testing] ${appLabel} — ${email}`,
        message: `${email} signed up for ${appLabel} closed testing.`,
        from_name: "MS DevX",
        replyto: email,
      }),
    });
  } catch {
    return NextResponse.json(
      {
        success: false,
        error: "Unable to reach the email service. Please try again.",
      } satisfies ClosedTestingApiResponse,
      { status: 502 }
    );
  }

  const text = await response.text();
  let result: unknown;

  try {
    result = JSON.parse(text) as unknown;
  } catch {
    return NextResponse.json(
      {
        success: false,
        error: "Email service returned an invalid response. Please try again.",
      } satisfies ClosedTestingApiResponse,
      { status: 502 }
    );
  }

  if (!response.ok) {
    const errorMessage =
      typeof result === "object" && result !== null && "message" in result
        ? String((result as Record<string, unknown>).message)
        : "Unable to sign you up. Please try again.";

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
      } satisfies ClosedTestingApiResponse,
      { status: response.status }
    );
  }

  return NextResponse.json(
    {
      success: true,
      message: "You've been signed up for closed testing.",
    } satisfies ClosedTestingApiResponse
  );
}
