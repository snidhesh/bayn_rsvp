import type { Metadata, Viewport } from "next";
import { Instrument_Serif, Archivo, Inter } from "next/font/google";
import "./globals.css";

const serif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
});

const archivo = Archivo({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-archivo",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Bayn by ORA · Open Day · 19 September 2026",
  description:
    "Reserve your place at the Bayn by ORA Open House — Saturday 19 September 2026, ORA Sales Centre, Dubai. Hosted by BlackOak Real Estate.",
  openGraph: {
    title: "Bayn by ORA · Open Day",
    description:
      "Explore the vision, discover the investment opportunity, meet our team — exclusive offers available only during the Open House Day.",
    type: "website",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#084C61",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${serif.variable} ${archivo.variable} ${inter.variable}`}>
      <body>{children}</body>
    </html>
  );
}
