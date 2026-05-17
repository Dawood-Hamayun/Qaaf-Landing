import { NextResponse } from "next/server";
import { Resend } from "resend";
import { WelcomeEmail } from "@/emails/WelcomeEmail";

/**
 * POST /api/subscribe
 *
 * Two things happen, in order:
 *   1. Email is added to the Resend Audience (the list we'll mail when
 *      Qaaf launches). Duplicate emails are treated as success, not error.
 *   2. A welcome email is sent immediately via the WelcomeEmail React
 *      template.
 *
 * If step 1 fails we abort (no point sending a welcome to someone we
 * can't reach later). If step 2 fails we still return success — the
 * email is captured, the user is on the list, we can resend the welcome
 * out-of-band. We just log the send error.
 *
 * Required env vars:
 *   RESEND_API_KEY        — server-only, from resend.com/api-keys
 *   RESEND_AUDIENCE_ID    — the Audience to add contacts to
 *   RESEND_FROM_EMAIL     — verified sender, e.g. "Qaaf <hello@qaaf.app>"
 */

export const runtime = "nodejs";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  let body: { email?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid request body." },
      { status: 400 }
    );
  }

  const email =
    typeof body.email === "string" ? body.email.trim().toLowerCase() : "";

  if (!email || !EMAIL_RE.test(email) || email.length > 254) {
    return NextResponse.json(
      { error: "Please enter a valid email address." },
      { status: 400 }
    );
  }

  const apiKey = process.env.RESEND_API_KEY;
  const audienceId = process.env.RESEND_AUDIENCE_ID;
  const fromEmail = process.env.RESEND_FROM_EMAIL;

  if (!apiKey || !audienceId || !fromEmail) {
    console.error("[subscribe] missing env vars", {
      hasApiKey: Boolean(apiKey),
      hasAudienceId: Boolean(audienceId),
      hasFromEmail: Boolean(fromEmail),
    });
    return NextResponse.json(
      { error: "Subscription is temporarily unavailable. Please try again." },
      { status: 503 }
    );
  }

  const resend = new Resend(apiKey);

  // 1. Add to Audience.
  try {
    const { error: contactError } = await resend.contacts.create({
      email,
      unsubscribed: false,
      audienceId,
    });

    if (contactError) {
      // Resend returns a structured error. Most common: duplicate. Treat
      // that as success so the user doesn't see "you already signed up" as
      // an error state.
      const message = contactError.message?.toLowerCase() ?? "";
      const isDuplicate =
        message.includes("already") ||
        message.includes("exists") ||
        message.includes("duplicate");

      if (!isDuplicate) {
        console.error("[subscribe] contacts.create failed", contactError);
        return NextResponse.json(
          { error: "We couldn't sign you up just now. Please try again." },
          { status: 502 }
        );
      }

      // Duplicate. Don't send a second welcome, just confirm.
      return NextResponse.json(
        { ok: true, alreadySubscribed: true },
        { status: 200 }
      );
    }
  } catch (err) {
    console.error("[subscribe] contacts.create threw", err);
    return NextResponse.json(
      { error: "We couldn't sign you up just now. Please try again." },
      { status: 502 }
    );
  }

  // 2. Send welcome email. Failure here is logged but not surfaced to
  //    the user since they're already on the list.
  try {
    const { error: sendError } = await resend.emails.send({
      from: fromEmail,
      to: email,
      subject: "JazakAllah — you're on the list",
      react: WelcomeEmail({}),
    });

    if (sendError) {
      console.error("[subscribe] welcome email failed", sendError);
    }
  } catch (err) {
    console.error("[subscribe] welcome email threw", err);
  }

  return NextResponse.json({ ok: true }, { status: 200 });
}
