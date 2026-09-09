import type { Lead } from "./types";

/**
 * Posts a lead to BlackOak's internal CRM at studio.blackoak-re.com.
 *
 * Payload shape is provisional — swap this once the CRM endpoint spec is
 * finalized. The rest of the request pipeline does not depend on it.
 */
export async function postLead(lead: Lead): Promise<{ ok: boolean; status: number; body?: string }> {
  const url = process.env.BLACKOAK_CRM_URL;
  const token = process.env.BLACKOAK_CRM_TOKEN;

  if (!url) {
    console.warn("[crm] BLACKOAK_CRM_URL not set — skipping CRM post");
    return { ok: false, status: 0, body: "no-crm-url" };
  }

  const payload = {
    source: "bayn-open-day-rsvp",
    event: "bayn-open-house-2026-09-19",
    submittedAt: new Date().toISOString(),
    lead: {
      full_name: lead.fullName,
      phone: lead.phone,
      email: lead.email,
      intent: lead.intent,
      guests: Number(lead.guests),
      arrival_slot: lead.arrival,
    },
  };

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
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
