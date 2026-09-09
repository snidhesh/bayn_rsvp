export const EVENT = {
  title: "Bayn by ORA — Open House",
  shortTitle: "Bayn Open Day",
  description:
    "Explore the vision, discover the investment opportunity, meet our team — and enjoy an exclusive special offer available only during the Open House Day.",
  location: "ORA Sales Centre, Jumeirah 3, Dubai",
  mapUrl: "https://maps.app.goo.gl/d9ZtYm3hXjHPRweV6",
  dateLabel: "Saturday, 19 September 2026",
  timeLabel: "11:00 – 16:00 (GST)",
  // ics uses 1-based months: [YYYY, M, D, HH, mm]
  start: [2026, 9, 19, 11, 0] as [number, number, number, number, number],
  end: [2026, 9, 19, 16, 0] as [number, number, number, number, number],
  timezone: "Asia/Dubai",
  organizer: {
    name: "BlackOak Real Estate",
    email: "openday@blackoak-re.com",
  },
  url: "https://openday.blackoak-re.com",
} as const;
