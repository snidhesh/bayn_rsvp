import Link from "next/link";
import Image from "next/image";

export default function SplashHero() {
  const year = new Date().getFullYear();
  return (
    <main className="splash">
      <video
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        poster="/poster.jpg"
        aria-hidden="true"
      >
        <source src="/hero_spash_banner.mp4" type="video/mp4" />
      </video>
      <div className="veil" />
      <div className="frame">
        <div aria-hidden="true" />

        <section className="center">
          <Image
            src="/bayn-logo-web-white.png"
            alt="Bayn — Ghantoot by ORA"
            width={520}
            height={520}
            priority
            className="hero-mark"
          />
          <h1 className="open-house">Open House</h1>
          <div className="cta-row">
            <Link href="/rsvp" className="btn dark" prefetch>
              Reserve your place →
            </Link>
          </div>
        </section>

        <footer className="splash-footer">
          <div className="host">
            <span className="host-label">Hosted by</span>
            <Image
              src="/blackoak-logo-2k.png"
              alt="BlackOak Real Estate"
              width={340}
              height={80}
              className="host-logo"
              priority
            />
          </div>
          <p className="disclaimer">
            Bayn by ORA Developers · Marketed by BlackOak Real Estate in partnership with ORA
            Developers · © {year} BlackOak Real Estate. All rights reserved. Renderings, timings
            and terms are indicative and subject to change without notice; nothing herein
            constitutes an offer or contract.
          </p>
        </footer>
      </div>
    </main>
  );
}
