import type { Lead } from "./types";

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

/** RSVP form on /rsvp — full details, triggers email + ICS. */
export async function postLead(lead: Lead) {
  const requirements = [
    `Interested in: ${lead.intent}`,
    `Arrival: ${lead.arrival}`,
    `Guests: ${lead.guests}`,
    "Event: Bayn Open House — 19th September 2026",
  ].join(" | ");

  return postToCrm({
    name: lead.fullName,
    phone: lead.phone,
    email: lead.email,
    requirements,
    source: "bayn-open-day-rsvp",
  });
}

/** Invitation form on /invitation — no email captured, no calendar invite sent. */
export interface InvitationLead {
  name: string;
  phone: string;
  look: string;
  guests: string;
}

export async function postInvitationLead(lead: InvitationLead) {
  const requirements = [
    `Interested in: ${lead.look}`,
    `Guests: ${lead.guests}`,
    "Event: Bayn Open House — 19th September (Invitation)",
  ].join(" | ");

  // No email is captured on the invitation form. The CRM's `email` field is
  // required for uniqueness, so we synthesize a namespaced placeholder from
  // the phone digits — this also gives natural deduplication if a guest
  // submits twice. Follow-up is via WhatsApp, not email.
  const phoneKey = lead.phone.replace(/\D/g, "") || "unknown";

  return postToCrm({
    name: lead.name,
    phone: lead.phone,
    email: `wa-${phoneKey}@invitation.blackoak-re.com`,
    requirements,
    source: "bayn-open-day-invitation",
  });
}
