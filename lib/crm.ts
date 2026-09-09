import type { Lead } from "./types";

/**
 * Posts a lead to BlackOak's internal CRM intake at
 * studio.blackoak-re.com/api/v1/public/intake/leads.
 *
 * Payload shape mirrors the working Bashayer landing (bashayer/api/lead.js):
 * flat { name, phone, email, requirements, source } — extra fields are folded
 * into `requirements` as a pipe-delimited human-readable string that shows up
 * as the lead's notes in Studio.
 */
export async function postLead(lead: Lead): Promise<{ ok: boolean; status: number; body?: string }> {
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

  const requirements = [
    `Interested in: ${lead.intent}`,
    `Arrival: ${lead.arrival}`,
    `Guests: ${lead.guests}`,
    "Event: Bayn Open House — 19 September 2026",
  ].join(" | ");

  const payload = {
    name: lead.fullName,
    phone: lead.phone,
    email: lead.email,
    requirements,
    source: "bayn-open-day-rsvp",
  };

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
