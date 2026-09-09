import { NextResponse } from "next/server";
import { z } from "zod";
import { postInvitationLead } from "@/lib/crm";

export const runtime = "nodejs";

const LeadSchema = z.object({
  name: z.string().trim().min(2, "Name is required"),
  phone: z.string().trim().min(6, "Phone is required"),
  look: z.string().trim().min(1, "Please pick what you're here for"),
  guests: z.string().trim().min(1, "Guests is required"),
});

/**
 * /api/invitation
 *
 * Handles the mystery-invitation form on /invitation. Posts the lead to the
 * BlackOak CRM only — no confirmation email, no calendar invite. The user's
 * confirmation channel is the WhatsApp link shown after submission.
 */
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

  const result = await postInvitationLead(parsed.data);
  if (!result.ok) {
    console.error(`[invitation] CRM did not accept lead: status=${result.status}`);
  }

  // Always return 200 so the client-side envelope reveal proceeds — WhatsApp
  // is the primary confirmation channel; a CRM outage shouldn't break the UX.
  return NextResponse.json({ ok: true });
}
