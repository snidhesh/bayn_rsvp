/**
 * Event date — shared by the CRM notes and the confirmation email.
 *
 * The date is not final yet: it will be Saturday 10th or 17th October.
 * Until then guests see "Mid-October 2026 — exact date shared personally",
 * which reads as part of the private-invitation tone. Once confirmed, set
 * EVENT_DAY to "10" or "17" here AND in the matching `EVENT_DAY` constant
 * at the top of the <script> in public/invitation.html.
 */
export const EVENT_DAY: "10" | "17" | null = null;

/** Guest-facing date (email). Never exposes the undecided options. */
export const EVENT_DATE_TEXT = EVENT_DAY
  ? `Saturday, ${EVENT_DAY}th October`
  : "Mid-October 2026 — exact date shared personally with confirmed guests";

/** Internal date for CRM notes — staff see the candidate dates. */
export const EVENT_DATE_INTERNAL = EVENT_DAY
  ? `${EVENT_DAY}th October`
  : "10th or 17th October (TBC)";
