export type ArrivalSlot =
  | "11:00 AM – 12:00 PM"
  | "12:00 PM – 1:30 PM"
  | "1:30 PM – 3:00 PM"
  | "3:00 PM – 4:00 PM";

export type Intent =
  | "Buying a home to live in"
  | "Buying as an investment"
  | "Still exploring"
  | "Broker or partner";

export type Guests = "1" | "2" | "3" | "4";

export interface Lead {
  fullName: string;
  phone: string;
  email: string;
  intent: Intent;
  guests: Guests;
  arrival: ArrivalSlot;
}
