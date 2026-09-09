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
    "11:00 to 12:00",
    "12:00 to 13:30, with the masterplan presentation",
    "13:30 to 15:00, with the second presentation",
    "15:00 to 16:00, with the final presentation",
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

  // Fire-and-forget the CRM post — a CRM outage must not block a guest's confirmation.
  postLead(lead).catch((err) => console.error("[rsvp] postLead threw", err));

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
