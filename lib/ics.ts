import { createEvent, type EventAttributes } from "ics";
import { EVENT } from "./event";
import type { Lead } from "./types";

export function buildIcs(lead: Lead): Buffer {
  const uid = `bayn-open-day-${Buffer.from(lead.email.toLowerCase()).toString("hex")}@blackoak-re.com`;

  const attrs: EventAttributes = {
    uid,
    productId: "-//BlackOak Real Estate//Bayn Open Day//EN",
    method: "REQUEST",
    start: EVENT.start,
    startInputType: "local",
    startOutputType: "local",
    end: EVENT.end,
    endInputType: "local",
    endOutputType: "local",
    title: EVENT.title,
    description: [
      EVENT.description,
      "",
      `Arrival slot: ${lead.arrival}`,
      `Guests: ${lead.guests}`,
      "",
      `Location: ${EVENT.location}`,
      `Map: ${EVENT.mapUrl}`,
      "",
      "See you there.",
      "— The BlackOak team",
    ].join("\n"),
    location: EVENT.location,
    url: EVENT.url,
    status: "CONFIRMED",
    busyStatus: "BUSY",
    organizer: EVENT.organizer,
    attendees: [
      { name: lead.fullName, email: lead.email, rsvp: true, partstat: "ACCEPTED", role: "REQ-PARTICIPANT" },
    ],
    alarms: [
      { action: "display", description: "Bayn Open Day starts in 1 day", trigger: { hours: 24, minutes: 0, before: true } },
      { action: "display", description: "Bayn Open Day starts in 2 hours", trigger: { hours: 2, minutes: 0, before: true } },
    ],
  };

  const { error, value } = createEvent(attrs);
  if (error || !value) {
    throw new Error(`Failed to build ICS: ${error?.message ?? "unknown"}`);
  }

  // ics emits DTSTART/DTEND as floating local times; pin them to Asia/Dubai so
  // Apple/Google/Outlook show 11:00 GST regardless of the invitee's timezone.
  const pinned = value
    .replace(/DTSTART:/g, "DTSTART;TZID=Asia/Dubai:")
    .replace(/DTEND:/g, "DTEND;TZID=Asia/Dubai:");

  return Buffer.from(pinned, "utf-8");
}
