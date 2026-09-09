import { NextResponse } from "next/server";
import { z } from "zod";
import { postLead } from "@/lib/crm";
import { buildIcs } from "@/lib/ics";
import { sendConfirmation } from "@/lib/email";

export const runtime = "nodejs";

const LeadSchema = z.object({
  fullName: z.string().trim().min(2, "Full name is required"),
  phone: z.string().trim().min(6, "A valid phone is required"),
  email: z.string().trim().email("A valid email is required"),
  intent: z.enum([
    "Buying a home to live in",
    "Buying as an investment",
    "Still exploring",
    "Broker or partner",
  ]),
  guests: z.enum(["1", "2", "3", "4"]),
  arrival: z.enum([
    "11:00 AM – 12:00 PM",
    "12:00 PM – 1:30 PM",
    "1:30 PM – 3:00 PM",
    "3:00 PM – 4:00 PM",
  ]),
});

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = LeadSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input" },
      { status: 422 }
    );
  }
  const lead = parsed.data;

  // Post to CRM. postLead swallows its own errors and returns a status object,
  // so a CRM outage does not throw here — the guest still gets their calendar
  // invite. Awaiting (rather than fire-and-forget) is important on serverless:
  // Vercel can otherwise terminate the process before the CRM request lands.
  const crmResult = await postLead(lead);
  if (!crmResult.ok) {
    console.error(`[rsvp] CRM did not accept lead: status=${crmResult.status}`);
  }

  try {
    const ics = buildIcs(lead);
    await sendConfirmation(lead, ics);
  } catch (err) {
    console.error("[rsvp] email/ics failed", err);
    return NextResponse.json(
      { ok: false, error: "We couldn't send your confirmation. Please try again." },
      { status: 502 }
    );
  }

  return NextResponse.json({ ok: true });
}
