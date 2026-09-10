/**
 * Posts to BlackOak's internal CRM intake at
 * studio.blackoak-re.com/api/v1/public/intake/leads.
 *
 * Payload shape mirrors the working Bashayer landing (bashayer/api/lead.js):
 * flat { name, phone, email, requirements, source } — extra fields are folded
 * into `requirements` as a pipe-delimited human-readable string that shows up
 * as the lead's notes in Studio.
 */

interface CrmPayload {
  name: string;
  phone: string;
  email: string;
  requirements: string;
  source: string;
  ref?: string;
}

async function postToCrm(payload: CrmPayload): Promise<{ ok: boolean; status: number; body?: string }> {
  const url = process.env.BLACKOAK_CRM_URL;
  const token = process.env.BLACKOAK_CRM_TOKEN;

  if (!url) {
    console.warn("[crm] BLACKOAK_CRM_URL not set — skipping CRM post");
    return { ok: false, status: 0, body: "no-crm-url" };
  }
  if (!token) {
    console.warn("[crm] BLACKOAK_CRM_TOKEN not set — skipping CRM post");
    return { ok: false, status: 0, body: "no-crm-token" };
  }

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      cache: "no-store",
    });

    const text = await res.text().catch(() => "");
    if (!res.ok) {
      console.error(`[crm] non-2xx ${res.status}: ${text.slice(0, 500)}`);
    }
    return { ok: res.ok, status: res.status, body: text };
  } catch (err) {
    console.error("[crm] fetch failed", err);
    return { ok: false, status: 0, body: String(err) };
  }
}

/** Invitation form (public/invitation.html) — real email captured; no calendar invite is sent. */
export interface InvitationLead {
  name: string;
  phone: string;
  email: string;
  look: string;
  guests: string;
  /**
   * Agent-referral slug from the CTA URL (`?ref=<agent-slug>`). Forwarded to
   * the CRM so an active sales agent's slug auto-assigns the created lead.
   * Silent-ignored server-side if unknown/invalid — safe to pass an empty
   * string or omit entirely.
   */
  ref?: string;
}

export async function postInvitationLead(lead: InvitationLead) {
  const requirements = [
    `Interested in: ${lead.look}`,
    `Guests: ${lead.guests}`,
    "Event: Bayn Open House — 19th September (Invitation)",
  ].join(" | ");

  const payload: CrmPayload = {
    name: lead.name,
    phone: lead.phone,
    email: lead.email,
    requirements,
    source: "bayn-open-day-invitation",
  };
  if (lead.ref && lead.ref.trim() !== "") {
    payload.ref = lead.ref.trim();
  }
  return postToCrm(payload);
}
