import { Resend } from "resend";
import type { InvitationLead } from "./crm";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

// Public URLs for the logos. Base64 data-URIs are stripped by Gmail /
// Outlook.com / Yahoo, so we host through the parent domain (proxied via
// blackoak-website → baynrsvp.vercel.app).
const PUBLIC_BASE = "https://www.blackoak-re.com/baynopenhouse";
const BAYN_LOGO_URL = `${PUBLIC_BASE}/bayn-logo.png`;
const BLACKOAK_LOGO_URL = `${PUBLIC_BASE}/blackoak-logo-2k.png`;

const MAP_URL = "https://maps.app.goo.gl/d9ZtYm3hXjHPRweV6";

export async function sendInvitationConfirmation(lead: InvitationLead): Promise<{ ok: boolean; error?: string }> {
  if (!resend) {
    console.warn("[email] RESEND_API_KEY not set — skipping confirmation email");
    return { ok: false, error: "no-resend-key" };
  }

  const from = process.env.RESEND_FROM ?? "Bayn <invitation@blackoak-re.com>";
  const firstName = (lead.name.split(/\s+/)[0] ?? "").trim() || "Guest";

  try {
    const { error } = await resend.emails.send({
      from,
      to: lead.email,
      subject: `Thank you ${firstName} — you are on the Bayn list`,
      replyTo: "openday@blackoak-re.com",
      html: renderHtml({ firstName }),
      text: renderText(firstName),
    });
    if (error) {
      console.error("[email] Resend send failed:", error.message);
      return { ok: false, error: error.message };
    }
    return { ok: true };
  } catch (err) {
    console.error("[email] send threw", err);
    return { ok: false, error: String(err) };
  }
}

function renderText(firstName: string): string {
  return [
    `Dear ${firstName},`,
    "",
    "Thank you. You are added to the Bayn list.",
    "",
    "The Date    Saturday, 19th September",
    "The Hours   11 AM – 4 PM",
    `The Address Ora Sales Center, Jumeirah 3, Dubai`,
    `Map:        ${MAP_URL}`,
    "",
    "Exclusive Offer only available on the day. Opens at 11 AM.",
    "By Invitation Only.",
    "",
    "Hosted by BlackOak Real Estate",
    "In partnership with ORA Developers · © 2026 BlackOak Real Estate",
  ].join("\n");
}

function renderHtml(args: { firstName: string }): string {
  const { firstName } = args;
  const name = escapeHtml(firstName);

  // Palette matches public/invitation.html
  const ink = "#084C61";       // teal background
  const paper = "#efe6d1";     // champagne text
  const gold = "#c8a976";      // brass hairline
  const goldHi = "#e6cf99";    // brass highlight
  const mute = "#b4a887";
  const dim = "#8a8067";
  const serif = "'Playfair Display', Georgia, 'Times New Roman', serif";
  const caps = "'Cinzel', 'Playfair Display', Georgia, serif";
  const sans = "'Inter', 'Helvetica Neue', Arial, sans-serif";

  const baynImg = `<img src="${BAYN_LOGO_URL}" alt="Bayn" width="140" style="display:block;width:140px;height:auto;margin:0 auto;border:0" />`;
  const blackoakImg = `<img src="${BLACKOAK_LOGO_URL}" alt="BlackOak Real Estate" height="30" style="display:block;height:30px;width:auto;margin:0 auto;border:0" />`;

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="dark">
<title>Bayn — You are on the list</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;1,400;1,500&family=Cinzel:wght@400;500&family=Inter:wght@400;500;600&display=swap');
</style>
</head>
<body style="margin:0;padding:0;background:${ink};color:${paper};font-family:${serif};-webkit-font-smoothing:antialiased">
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:${ink}">
  <tr><td align="center" style="padding:44px 16px">
    <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="max-width:600px">

      <!-- seal -->
      <tr><td align="center" style="padding:8px 0 34px">
        <div style="font-family:${caps};font-size:12px;font-weight:500;letter-spacing:.36em;text-transform:uppercase;color:${goldHi}">By Private Invitation</div>
      </td></tr>

      <!-- Bayn logo -->
      <tr><td align="center" style="padding:0 0 10px">${baynImg}</td></tr>

      <!-- An Exclusive Event -->
      <tr><td align="center" style="padding:12px 0 40px">
        <div style="font-family:${caps};font-size:16px;font-weight:500;letter-spacing:.44em;text-transform:uppercase;color:${goldHi}">— An Exclusive Event —</div>
      </td></tr>

      <!-- Thank you -->
      <tr><td align="center" style="padding:0 20px 34px">
        <h1 style="font-family:${serif};font-size:36px;font-weight:400;font-style:italic;line-height:1.15;color:${paper};margin:0">Thank you ${name}.<br/>You are added to the list.</h1>
      </td></tr>

      <!-- itinerary -->
      <tr><td style="padding:0 24px 44px">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-top:1px solid rgba(200,169,118,.42);border-bottom:1px solid rgba(200,169,118,.42)">
          <tr>
            <td width="130" style="padding:18px 0;border-bottom:1px solid rgba(200,169,118,.28);font-family:${caps};font-size:11.5px;font-weight:500;letter-spacing:.22em;text-transform:uppercase;color:${gold};vertical-align:top">The Date</td>
            <td style="padding:18px 0;border-bottom:1px solid rgba(200,169,118,.28);font-family:${serif};font-size:22px;color:${paper}">Saturday, 19<sup style="font-size:.5em;color:${gold};font-style:italic;vertical-align:.9em">th</sup> September</td>
          </tr>
          <tr>
            <td style="padding:18px 0;border-bottom:1px solid rgba(200,169,118,.28);font-family:${caps};font-size:11.5px;font-weight:500;letter-spacing:.22em;text-transform:uppercase;color:${gold};vertical-align:top">The Hours</td>
            <td style="padding:18px 0;border-bottom:1px solid rgba(200,169,118,.28);font-family:${serif};font-size:22px;color:${paper}">11 AM &#8211; 4 PM</td>
          </tr>
          <tr>
            <td style="padding:18px 0;font-family:${caps};font-size:11.5px;font-weight:500;letter-spacing:.22em;text-transform:uppercase;color:${gold};vertical-align:top">The Address</td>
            <td style="padding:18px 0;font-family:${serif};font-size:22px;color:${paper}">
              Ora Sales Center<br/>
              <span style="color:${mute};font-size:.85em">Jumeirah 3, Dubai</span><br/>
              <a href="${MAP_URL}" style="display:inline-block;margin-top:10px;font-family:${sans};font-size:10.5px;font-weight:600;letter-spacing:.24em;text-transform:uppercase;color:${gold};text-decoration:none;border-bottom:1px solid ${gold};padding-bottom:3px">View on map &rarr;</a>
            </td>
          </tr>
        </table>
      </td></tr>

      <!-- offer panel -->
      <tr><td style="padding:0 24px 44px">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-top:1px solid ${gold};border-bottom:1px solid ${gold};background:rgba(200,169,118,.06)">
          <tr><td align="center" style="padding:40px 30px">
            <p style="font-family:${serif};font-size:24px;font-style:italic;line-height:1.5;color:${paper};margin:0 0 22px 0">Exclusive Offer only available on the day.<br/>Opens at <em style="font-style:normal;color:${goldHi};font-weight:500">11 AM</em>.</p>
            <div style="font-family:${caps};font-size:12px;font-weight:500;letter-spacing:.36em;text-transform:uppercase;color:${gold}">By Invitation Only</div>
          </td></tr>
        </table>
      </td></tr>

      <!-- divider -->
      <tr><td align="center" style="padding:16px 0 34px">
        <div style="display:inline-block;width:44px;height:1px;background:${gold}"></div>
      </td></tr>

      <!-- Hosted by -->
      <tr><td align="center" style="padding:0 20px 16px">
        <div style="font-family:${caps};font-size:11px;font-weight:500;letter-spacing:.36em;text-transform:uppercase;color:${gold};margin-bottom:18px">Hosted by</div>
        ${blackoakImg}
      </td></tr>

      <!-- fine print -->
      <tr><td align="center" style="padding:34px 20px 10px">
        <p style="font-family:${sans};font-size:10.5px;line-height:1.7;letter-spacing:.08em;color:${dim};margin:0">In partnership with ORA Developers &middot; &copy; 2026 BlackOak Real Estate</p>
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
