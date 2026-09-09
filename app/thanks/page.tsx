import Link from "next/link";
import Image from "next/image";
import { EVENT } from "@/lib/event";

export const metadata = {
  title: "You're on the list · Bayn Open Day",
  robots: { index: false, follow: false },
};

export default function ThanksPage() {
  return (
    <main className="thanks">
      <div className="card">
        <Image
          src="/bayn-logo-web.png"
          alt="Bayn — Ghantoot by ORA"
          width={180}
          height={180}
          className="thanks-mark"
        />
        <div className="kicker">You&apos;re on the list</div>
        <h1>See you on the day.</h1>
        <p>
          A confirmation is on its way to your inbox with a <strong>calendar invite attached</strong>.
          Open the <em>bayn-open-house.ics</em> file to add the Open House to Apple, Google, or
          Outlook in one tap.
        </p>
        <p>
          We&apos;ll WhatsApp your location pin and arrival slot on Friday 18 September. If your
          plans change, reply to that message and we&apos;ll hold a private viewing for you instead.
        </p>
        <div className="foot">
          <div>
            <strong>When</strong> — {EVENT.dateLabel} · {EVENT.timeLabel}
          </div>
          <div style={{ marginTop: 6 }}>
            <strong>Where</strong> — {EVENT.location}
          </div>
          <div style={{ marginTop: 22 }}>
            <Link href="/" className="rsvp-back" style={{ color: "#17677d" }}>
              ← Back to the film
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
