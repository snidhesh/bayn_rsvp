import { readFile } from "node:fs/promises";
import path from "node:path";
import { Resend } from "resend";
import { EVENT } from "./event";
import type { Lead } from "./types";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

let logoDataUri: string | null = null;
async function getLogoDataUri(): Promise<string> {
  if (logoDataUri) return logoDataUri;
  try {
    const buf = await readFile(path.join(process.cwd(), "public", "bayn-logo-web-white.png"));
    logoDataUri = `data:image/png;base64,${buf.toString("base64")}`;
  } catch {
    logoDataUri = "";
  }
  return logoDataUri;
}

export async function sendConfirmation(lead: Lead, ics: Buffer): Promise<void> {
  if (!resend) {
    console.warn("[email] RESEND_API_KEY not set — skipping email send");
    return;
  }
  const from = process.env.RESEND_FROM ?? "Bayn Open Day <openday@blackoak-re.com>";
  const bcc = process.env.RSVP_BCC ? [process.env.RSVP_BCC] : undefined;

  const logo = await getLogoDataUri();
  const { error } = await resend.emails.send({
    from,
    to: lead.email,
    bcc,
    subject: `You're on the list — ${EVENT.shortTitle}, 19 Sept`,
    replyTo: EVENT.organizer.email,
    html: renderHtml(lead, logo),
    text: renderText(lead),
    attachments: [
      {
        filename: "bayn-open-house.ics",
        content: ics.toString("base64"),
        contentType: "text/calendar; charset=utf-8; method=REQUEST",
      },
    ],
  });

  if (error) {
    throw new Error(`Resend send failed: ${error.message}`);
  }
}

function renderText(lead: Lead): string {
  return [
    `Dear ${lead.fullName.split(" ")[0]},`,
    "",
    `You're confirmed for the ${EVENT.title}.`,
    "",
    `When:  ${EVENT.dateLabel}, ${EVENT.timeLabel}`,
    `Where: ${EVENT.location}`,
    `Map:   ${EVENT.mapUrl}`,
    `Your arrival slot: ${lead.arrival}`,
    `Guests including you: ${lead.guests}`,
    "",
    "Tap the attached invite (bayn-open-house.ics) to add it to your calendar.",
    "",
    "We'll WhatsApp you the location pin the day before.",
    "",
    "— The BlackOak team",
    "In partnership with ORA Developers.",
  ].join("\n");
}

function renderHtml(lead: Lead, logoDataUri: string): string {
  const first = escapeHtml(lead.fullName.split(" ")[0] || lead.fullName);
  const logoImg = logoDataUri
    ? `<img src="${logoDataUri}" alt="Bayn — Ghantoot by ORA" width="132" height="132" style="display:block;height:auto;width:132px;border:0"/>`
    : `<div style="font-family:'Instrument Serif',Georgia,serif;font-size:26px;letter-spacing:.02em;color:#F4FAFC">BAYN <span style="font-size:11px;font-family:Archivo,sans-serif;letter-spacing:.2em;opacity:.7;margin-left:10px;text-transform:uppercase">Open Day</span></div>`;
  return `<!doctype html>
<html>
  <body style="margin:0;padding:0;background:#F4FAFC;font-family:Archivo,Helvetica,Arial,sans-serif;color:#084C61">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#F4FAFC;padding:40px 16px">
      <tr><td align="center">
        <table role="presentation" width="560" cellspacing="0" cellpadding="0" style="max-width:560px;background:#ffffff;border:1px solid #E4EEF2">
          <tr><td style="background:#084C61;color:#F4FAFC;padding:28px 32px">
            ${logoImg}
            <div style="color:#B08D57;font-size:11px;letter-spacing:.16em;text-transform:uppercase;margin-top:16px">You're on the list</div>
          </td></tr>
          <tr><td style="padding:34px 32px 8px 32px">
            <h1 style="font-family:'Instrument Serif',Georgia,serif;font-size:32px;line-height:1.1;margin:0 0 14px 0;color:#084C61;font-weight:400">
              Dear ${first},
            </h1>
            <p style="margin:0 0 20px 0;font-size:16px;line-height:1.55;color:#0E5871">
              You're confirmed for the <strong>${EVENT.title}</strong>. We've attached a calendar invite —
              tap <em>bayn-open-house.ics</em> to add it to Apple, Google, or Outlook.
            </p>
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-top:1px solid #E4EEF2;margin-top:22px">
              <tr><td style="padding:16px 0;border-bottom:1px solid #E4EEF2">
                <div style="font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:#17677D">When</div>
                <div style="font-family:'Instrument Serif',Georgia,serif;font-size:22px;color:#084C61;margin-top:4px">${EVENT.dateLabel}</div>
                <div style="font-size:14px;color:#0E5871;margin-top:2px">${EVENT.timeLabel}</div>
              </td></tr>
              <tr><td style="padding:16px 0;border-bottom:1px solid #E4EEF2">
                <div style="font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:#17677D">Where</div>
                <div style="font-family:'Instrument Serif',Georgia,serif;font-size:22px;color:#084C61;margin-top:4px">${EVENT.location}</div>
                <div style="margin-top:8px"><a href="${EVENT.mapUrl}" style="font-size:12px;font-weight:600;letter-spacing:.14em;text-transform:uppercase;color:#B08D57;text-decoration:none;border-bottom:1px solid #B08D57;padding-bottom:2px">View on map →</a></div>
              </td></tr>
              <tr><td style="padding:16px 0">
                <div style="font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:#17677D">Your arrival</div>
                <div style="font-family:'Instrument Serif',Georgia,serif;font-size:20px;color:#084C61;margin-top:4px">${escapeHtml(lead.arrival)}</div>
                <div style="font-size:13px;color:#0E5871;margin-top:2px">Guests including you: ${escapeHtml(lead.guests)}</div>
              </td></tr>
            </table>
            <p style="margin:26px 0 0 0;font-size:14px;line-height:1.6;color:#0E5871">
              Explore the vision, discover the investment opportunity, meet our team — and enjoy an
              exclusive special offer available only during the Open House Day. Reservation terms close at 16:00.
            </p>
          </td></tr>
          <tr><td style="padding:22px 32px 34px 32px;border-top:1px solid #E4EEF2;background:#F4FAFC">
            <div style="font-size:12px;color:#17677D;line-height:1.6">
              Hosted by <strong>BlackOak Real Estate</strong> in partnership with ORA Developers.<br/>
              Questions? Reply to this email — it goes straight to our concierge.
            </div>
          </td></tr>
        </table>
      </td></tr>
    </table>
  </body>
</html>`;
}

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!));
}
