# Bayn by ORA — Open Day RSVP

Standalone landing page for the **Bayn by ORA Open House**, Saturday **19 September 2026, 11:00–16:00 GST**, ORA Sales Centre, Dubai. Hosted by BlackOak Real Estate.

- Splash screen with the cinematic hero banner (`/public/hero_spash_banner.mp4`) and a single **Reserve your place** CTA.
- Two-column RSVP page — form left (dark), Vimeo film right — modeled on the Tim Allen buyer's-guide reference.
- On submit: POSTs the lead to the internal **studio.blackoak-re.com** CRM, then emails the guest a confirmation with an **`.ics` calendar invite** attached (Apple / Google / Outlook — one tap to add).

## Stack

- Next.js 15 App Router · TypeScript · React 19
- [`resend`](https://resend.com) for transactional email
- [`ics`](https://www.npmjs.com/package/ics) for calendar generation
- Deploys as a single Vercel project

## Local development

```bash
npm install                 # or pnpm install
cp .env.local.example .env.local   # fill in the values below
npm run dev                 # http://localhost:3000
```

## Environment variables

| Variable | Purpose |
|---|---|
| `BLACKOAK_CRM_URL` | Lead intake endpoint on `studio.blackoak-re.com` |
| `BLACKOAK_CRM_TOKEN` | Bearer token for the CRM |
| `RESEND_API_KEY` | Resend API key (transactional sender) |
| `RESEND_FROM` | e.g. `Bayn Open Day <openday@blackoak-re.com>` — domain must be verified in Resend |
| `RSVP_BCC` | (optional) internal inbox that gets a BCC of every confirmation |
| `NEXT_PUBLIC_DANA_VIMEO_ID` | Numeric Vimeo ID for the "Open House - Dana" film |

## Pre-launch checklist

1. **Vimeo** — upload `Open House - Dana.mp4` as **unlisted**, copy the numeric ID into `NEXT_PUBLIC_DANA_VIMEO_ID`. The 115 MB source cannot be shipped through Vercel's per-file limit — Vimeo also gives us a chrome-free player.
2. **Resend** — verify the sender domain (`blackoak-re.com` or equivalent). Add the API key to Vercel.
3. **CRM** — paste the studio.blackoak-re.com endpoint spec; adjust the payload in `lib/crm.ts` to match. The rest of the pipeline is decoupled.
4. **Poster frame (optional)** — export a still from `hero_spash_banner.mp4` to `/public/poster.jpg` so the splash has an instant paint on slow connections.
5. **Custom domain** — assign e.g. `openday.blackoak-re.com` in Vercel and update `EVENT.url` in `lib/event.ts` if the ICS should point at the live URL.

## Deploy to Vercel

```bash
npx vercel               # link the project once
npx vercel --prod        # ship
```

Set the environment variables in **Project → Settings → Environment Variables** (Production + Preview).

## Smoke-test end-to-end

1. Visit `/` — splash video should autoplay muted; CTA scrolls to `/rsvp`.
2. Submit the form with your own email.
3. Confirm within ~30s:
   - Confirmation email arrives with `bayn-open-house.ics`.
   - Opening the ICS on iOS/macOS/Android/Outlook creates an event **Sat 19 Sep 2026, 11:00–16:00 (Asia/Dubai)** at ORA Sales Centre.
   - The lead appears in studio.blackoak-re.com.

## File map

```
app/
  page.tsx              splash
  rsvp/page.tsx         form + video
  thanks/page.tsx       post-submit confirmation
  api/rsvp/route.ts     validate → CRM → email + ICS
components/
  SplashHero.tsx        <video> + CTA
  RsvpForm.tsx          controlled form
lib/
  event.ts              single source of truth for the event
  ics.ts                buildIcs(lead)
  crm.ts                postLead(lead)
  email.ts              sendConfirmation(lead, ics)
  types.ts              Lead
public/
  hero_spash_banner.mp4
```
