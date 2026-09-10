import { NextResponse } from "next/server";
import { z } from "zod";
import { postInvitationLead } from "@/lib/crm";
import { sendInvitationConfirmation } from "@/lib/email";

export const runtime = "nodejs";

const LeadSchema = z.object({
  name: z.string().trim().min(2, "Name is required"),
  phone: z
    .string()
    .trim()
    .refine(
      (v) => {
        if (/[a-zA-Z]/.test(v)) return false;
        const digits = v.replace(/\D/g, "");
        return digits.length >= 7 && digits.length <= 15;
      },
      "Please enter a valid phone number"
    ),
  email: z.string().trim().email("Please enter a valid email address"),
  look: z.string().trim().min(1, "Please pick what you're here for"),
  guests: z.string().trim().min(1, "Guests is required"),
});

/**
 * /api/invitation
 *
 * Handles the invitation form on public/invitation.html:
 *   1. Validate the payload.
 *   2. Post to the BlackOak CRM (studio.blackoak-re.com).
 *   3. Send a branded confirmation email to the guest via Resend.
 * All three run in sequence; failures are logged but never block the 200
 * response so the client-side confirmation always renders. WhatsApp remains
 * the guaranteed confirmation channel.
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

  const crmResult = await postInvitationLead(parsed.data);
  if (!crmResult.ok) {
    console.error(`[invitation] CRM did not accept lead: status=${crmResult.status}`);
  }

  const emailResult = await sendInvitationConfirmation(parsed.data);
  if (!emailResult.ok) {
    console.error(`[invitation] Email not sent: ${emailResult.error ?? "unknown"}`);
  }

  return NextResponse.json({ ok: true });
}
