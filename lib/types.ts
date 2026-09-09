export type ArrivalSlot =
  | "11:00 to 12:00"
  | "12:00 to 13:30, with the masterplan presentation"
  | "13:30 to 15:00, with the second presentation"
  | "15:00 to 16:00, with the final presentation";

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
