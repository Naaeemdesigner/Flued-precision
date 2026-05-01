import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { BookingPayload } from "@/lib/booking-schema";
import { renderBookingEmail } from "@/lib/booking-email";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// In-memory IP rate limiter — 5 submissions per IP per 10 min.
// Replace with Upstash/Redis for multi-instance prod.
const RATE_WINDOW_MS = 10 * 60 * 1000;
const RATE_MAX = 5;
const ipHits = new Map<string, number[]>();

function rateLimit(ip: string): boolean {
  const now = Date.now();
  const hits = (ipHits.get(ip) ?? []).filter((t) => now - t < RATE_WINDOW_MS);
  if (hits.length >= RATE_MAX) {
    ipHits.set(ip, hits);
    return false;
  }
  hits.push(now);
  ipHits.set(ip, hits);
  return true;
}

function clientIp(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown"
  );
}

function genRef(): string {
  const ts = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `FP-${ts}-${rand}`;
}

export async function POST(req: NextRequest) {
  // Env preflight — fail fast w/ clear message
  const apiKey = process.env.RESEND_API_KEY;
  const toEmail = process.env.BOOKING_TO_EMAIL;
  const fromEmail = process.env.BOOKING_FROM_EMAIL;

  if (!apiKey || !toEmail || !fromEmail) {
    console.error("[booking] Missing env: RESEND_API_KEY / BOOKING_TO_EMAIL / BOOKING_FROM_EMAIL");
    return NextResponse.json(
      { ok: false, error: "Email service not configured" },
      { status: 500 },
    );
  }

  // Rate limit
  const ip = clientIp(req);
  if (!rateLimit(ip)) {
    return NextResponse.json(
      { ok: false, error: "Too many requests. Try again shortly." },
      { status: 429 },
    );
  }

  // Parse + validate
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = BookingPayload.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        ok: false,
        error: "Validation failed",
        issues: parsed.error.issues.map((i) => ({ path: i.path, message: i.message })),
      },
      { status: 400 },
    );
  }
  const data = parsed.data;

  // Honeypot — silent success to deceive bots
  if (data.website && data.website.length > 0) {
    return NextResponse.json({ ok: true, ref: "honeypot" });
  }

  const ref = genRef();
  const { subject, html, text } = renderBookingEmail(data, ref);

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from: fromEmail,
      to: [toEmail],
      replyTo: data.email,
      subject,
      html,
      text,
      headers: { "X-Booking-Ref": ref },
    });

    if (error) {
      console.error("[booking] Resend error:", error);
      return NextResponse.json(
        { ok: false, error: "Email delivery failed" },
        { status: 502 },
      );
    }

    return NextResponse.json({ ok: true, ref });
  } catch (err) {
    console.error("[booking] Unexpected error:", err);
    return NextResponse.json(
      { ok: false, error: "Server error" },
      { status: 500 },
    );
  }
}

export function GET() {
  return NextResponse.json(
    { ok: false, error: "Method not allowed" },
    { status: 405, headers: { Allow: "POST" } },
  );
}
