import { NextResponse } from "next/server";

/**
 * Newsletter subscription endpoint.
 *
 * For now, just captures the email and returns success — this keeps
 * the form UX working immediately. To forward to Beehiiv for real:
 *
 *   1. Add to .env.local:
 *        BEEHIIV_API_KEY=...
 *        BEEHIIV_PUBLICATION_ID=6a8360f5-d4ac-4fd3-a862-6473d0c069d6
 *   2. Uncomment the fetch block below.
 *
 * Until those env vars are set, the route still returns 200 so the
 * form's success state renders. Captured emails get logged
 * server-side so nothing is lost.
 */
export async function POST(req: Request) {
  let email: string | undefined;
  try {
    const body = (await req.json()) as { email?: string };
    email = body.email;
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  if (!email || !email.includes("@")) {
    return NextResponse.json({ error: "Email required" }, { status: 400 });
  }

  // Log captured emails server-side so nothing is lost during the
  // "before API key" period.
  console.log("[newsletter] subscribed:", email);

  // ---- Beehiiv proxy (enable once env vars are set) ----
  // const apiKey = process.env.BEEHIIV_API_KEY;
  // const pubId = process.env.BEEHIIV_PUBLICATION_ID;
  // if (apiKey && pubId) {
  //   const res = await fetch(
  //     `https://api.beehiiv.com/v2/publications/${pubId}/subscriptions`,
  //     {
  //       method: "POST",
  //       headers: {
  //         Authorization: `Bearer ${apiKey}`,
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({
  //         email,
  //         reactivate_existing: true,
  //         send_welcome_email: false,
  //         utm_source: "landing",
  //       }),
  //     },
  //   );
  //   if (!res.ok) {
  //     return NextResponse.json(
  //       { error: "Subscription failed" },
  //       { status: 502 },
  //     );
  //   }
  // }

  return NextResponse.json({ ok: true });
}
