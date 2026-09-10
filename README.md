# Bayn — By Private Invitation

Standalone invitation page for the Bayn by ORA Open House, **Saturday 19th September, 11 AM – 4 PM, ORA Sales Center, Jumeirah 3, Dubai**. Hosted by BlackOak Real Estate.

- Cinematic splash: hero video + gold RSVP disc, no reveal until the disc is clicked.
- Slide-up invitation sheet: Bayn logo, itinerary, gold-framed sealed offer, portrait reel, form.
- Form submits to studio.blackoak-re.com; each guest gets a randomised Vimeo reveal + WhatsApp confirm button.
- **No email, no calendar invite** — WhatsApp is the confirmation channel by design.

## Where the page lives

- **Locally:** `http://localhost:3002/`
- **Production:** `https://baynrsvp.vercel.app/baynopenhouse/` (Vercel), reverse-proxied to `https://www.blackoak-re.com/baynopenhouse/` via a rewrite in `blackoak-website/next.config.mjs`.

The whole page is a single self-contained file at `public/invitation.html`. Next.js only hosts:
- The rewrite `/` → `/invitation.html` (see `next.config.ts`)
- One API route: `POST /api/invitation` → validates + posts to CRM

## Stack

- Next.js 15 App Router · TypeScript · React 19 (used only for the API route + layout wrapper)
- Zod for the intake validator
- Fonts loaded by the HTML directly (Playfair Display · Cinzel · Inter — Google Fonts)

## Local development

```bash
npm install
cp .env.local.example .env.local   # fill in CRM URL + token
npm run dev
# open http://localhost:3002/  (or whichever port Next picks)
```

## Environment variables

| Variable | Purpose |
|---|---|
| `BLACKOAK_CRM_URL` | Lead intake endpoint on `studio.blackoak-re.com` |
| `BLACKOAK_CRM_TOKEN` | Bearer token for the CRM |
| `NEXT_PUBLIC_BASE_PATH` | Set to `/baynopenhouse` in Vercel Production + Preview so the app serves under the parent site's proxy path. Leave blank for local dev. |

## Adding more reveal videos

The invitation randomly picks a Vimeo video from a pool on each successful RSVP so two guests sitting side-by-side see different reveals. Add IDs to the array at the top of the `<script>` block in `public/invitation.html`:

```js
const REVEAL_VIDEOS = [
  '1225189972',
  // paste more Vimeo numeric IDs here
];
```

More IDs = lower collision rate. 5+ videos gets you under 4% collision for the first 10 guests.

## Deploy

```bash
git push origin main   # Vercel auto-deploys baynrsvp.vercel.app
```

For the parent site (`blackoak-website`), the rewrite proxying `/baynopenhouse/*` → `https://baynrsvp.vercel.app/baynopenhouse/*` is already in place (see `blackoak-website/next.config.mjs`). Once bayn_rsvp is deployed, `www.blackoak-re.com/baynopenhouse/` resolves through it.

## File map

```
app/
  layout.tsx                Next 15 root layout (minimal — needed for API route)
  api/invitation/route.ts   POST → validate → post to CRM
lib/
  crm.ts                    postInvitationLead() — flat payload to studio.blackoak-re.com
public/
  invitation.html           the whole page (styles + scripts inline)
  hero_spash_banner.mp4     shared background video
  costal_views.mp4          pre-submit portrait reel
  bayn-logo-web-white.png   Bayn wordmark
  blackoak-logo-2k.png      BlackOak wordmark for the footer
next.config.ts              rewrite `/` → `/invitation.html`, optional basePath
```
