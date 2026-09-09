"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { Lead } from "@/lib/types";

const empty: Lead = {
  fullName: "",
  phone: "",
  email: "",
  intent: "Buying a home to live in",
  guests: "1",
  arrival: "11:00 to 12:00",
};

export default function RsvpForm() {
  const router = useRouter();
  const [values, setValues] = useState<Lead>(empty);
  const [errors, setErrors] = useState<Partial<Record<keyof Lead, boolean>>>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const setField = <K extends keyof Lead>(key: K, v: Lead[K]) => {
    setValues((s) => ({ ...s, [key]: v }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: false }));
  };

  const validate = (): boolean => {
    const next: Partial<Record<keyof Lead, boolean>> = {};
    if (!values.fullName.trim()) next.fullName = true;
    if (!values.phone.trim()) next.phone = true;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) next.email = true;
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);
    if (!validate()) return;

    startTransition(async () => {
      try {
        const res = await fetch("/api/rsvp", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        });
        if (!res.ok) {
          const j = await res.json().catch(() => ({}));
          throw new Error(j.error || `Request failed (${res.status})`);
        }
        router.push("/thanks");
      } catch (err) {
        setServerError(err instanceof Error ? err.message : "Something went wrong");
      }
    });
  };

  return (
    <form id="reserve" className="form" onSubmit={onSubmit} noValidate>
      <div className="field">
        <label htmlFor="fullName">Full name</label>
        <input
          id="fullName"
          name="name"
          type="text"
          autoComplete="name"
          placeholder="Your name"
          className={errors.fullName ? "invalid" : undefined}
          value={values.fullName}
          onChange={(e) => setField("fullName", e.target.value)}
          required
        />
      </div>

      <div className="field">
        <label htmlFor="phone">Mobile with country code</label>
        <input
          id="phone"
          name="phone"
          type="tel"
          autoComplete="tel"
          placeholder="+971 50 000 0000"
          className={errors.phone ? "invalid" : undefined}
          value={values.phone}
          onChange={(e) => setField("phone", e.target.value)}
          required
        />
      </div>

      <div className="field">
        <label htmlFor="email">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          className={errors.email ? "invalid" : undefined}
          value={values.email}
          onChange={(e) => setField("email", e.target.value)}
          required
        />
      </div>

      <div className="field">
        <label htmlFor="intent">What brings you</label>
        <select
          id="intent"
          value={values.intent}
          onChange={(e) => setField("intent", e.target.value as Lead["intent"])}
        >
          <option>Buying a home to live in</option>
          <option>Buying as an investment</option>
          <option>Still exploring</option>
          <option>Broker or partner</option>
        </select>
      </div>

      <div className="field">
        <label htmlFor="guests">Guests including you</label>
        <select
          id="guests"
          value={values.guests}
          onChange={(e) => setField("guests", e.target.value as Lead["guests"])}
        >
          <option>1</option>
          <option>2</option>
          <option>3</option>
          <option>4</option>
        </select>
      </div>

      <div className="field">
        <label htmlFor="arrival">Arrival time</label>
        <select
          id="arrival"
          value={values.arrival}
          onChange={(e) => setField("arrival", e.target.value as Lead["arrival"])}
        >
          <option>11:00 to 12:00</option>
          <option>12:00 to 13:30, with the masterplan presentation</option>
          <option>13:30 to 15:00, with the second presentation</option>
          <option>15:00 to 16:00, with the final presentation</option>
        </select>
      </div>

      {serverError && <div className="form-error">{serverError}</div>}

      <button className="btn" type="submit" disabled={pending}>
        {pending ? "Reserving…" : "Reserve my place"}
      </button>

      <p className="fineprint">
        By registering you agree to be contacted by BlackOak Real Estate about Bayn. Marketed in
        partnership with ORA Developers.
      </p>
    </form>
  );
}
