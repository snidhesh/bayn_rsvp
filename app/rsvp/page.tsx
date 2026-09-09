import Link from "next/link";
import Image from "next/image";
import RsvpForm from "@/components/RsvpForm";
import { EVENT } from "@/lib/event";

export const metadata = {
  title: "Reserve your place · Bayn Open Day",
  description:
    "Reserve your seat at the Bayn by ORA Open House — Saturday 19 September 2026, ORA Sales Centre, Dubai.",
};

export default function RsvpPage() {
  const vimeoId = process.env.NEXT_PUBLIC_DANA_VIMEO_ID;

  return (
    <main className="rsvp-shell">
      <section id="details" className="rsvp-left">
        <Link href="/" className="rsvp-back">
          ← Back
        </Link>

        <div>
          <div className="brand" style={{ marginBottom: 28 }}>
            <Image
              src="/bayn-logo-web-white.png"
              alt="Bayn — Ghantoot by ORA"
              width={200}
              height={200}
              priority
              className="mark sm"
            />
            <div className="hosted-by">
              <span className="hosted-label">Hosted by</span>
              <Image
                src="/blackoak-logo-2k.png"
                alt="BlackOak Real Estate"
                width={340}
                height={80}
                className="hosted-logo"
              />
            </div>
          </div>
          <div className="rsvp-kicker">Registration</div>
          <h1 className="rsvp-title" style={{ marginTop: 12 }}>
            Explore the vision, discover the investment opportunity, meet our team.
          </h1>
          <p className="rsvp-body" style={{ marginTop: 16 }}>
            Enjoy an exclusive special offer available only during the Open House Day. Places in each
            arrival slot are limited. We will email your confirmation with a calendar invite you
            can add in one tap.
          </p>
        </div>

        <div className="rsvp-meta">
          <div className="meta-card">
            <span className="meta-kicker">When</span>
            <span className="meta-value">{EVENT.dateLabel}</span>
            <span className="meta-sub">{EVENT.timeLabel}</span>
          </div>
          <div className="meta-card">
            <span className="meta-kicker">Where</span>
            <span className="meta-value">ORA Sales Centre</span>
            <span className="meta-sub">Jumeirah 3, Dubai</span>
            <a
              className="meta-link"
              href={EVENT.mapUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              View on map →
            </a>
          </div>
        </div>

        <RsvpForm />
      </section>

      <aside className="rsvp-right">
        {vimeoId ? (
          <iframe
            src={`https://player.vimeo.com/video/${vimeoId}?autoplay=1&muted=1&loop=1&background=1&byline=0&title=0&portrait=0`}
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
            title="Bayn by ORA — Open House film"
          />
        ) : (
          <div className="placeholder">
            <span>
              A film from the shoreline —<br />
              upload &ldquo;Open House - Dana.mp4&rdquo; to Vimeo
              <br />
              and set <code>NEXT_PUBLIC_DANA_VIMEO_ID</code>.
            </span>
          </div>
        )}
        <a
          href="#details"
          className="scroll-cue"
          aria-label="RSVP now — scroll to the event details"
        >
          <span>RSVP Now</span>
          <svg
            className="chev"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
        </a>
      </aside>
    </main>
  );
}
