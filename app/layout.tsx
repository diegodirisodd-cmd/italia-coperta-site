import type { Metadata } from "next";
import { Oswald, Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Spotlight } from "@/components/motion/Spotlight";
import { MotionProvider } from "@/components/motion/MotionProvider";

const oswald = Oswald({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-oswald",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.dirisoteloni1950.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Di Riso Teloni — Teli per bilico e teloni per camion dal 1950",
    template: "%s · Di Riso Teloni",
  },
  description:
    "Teli per bilico, teloni per camion e tensostrutture industriali su misura dal 1950. Terza generazione, sede ad Angri (SA) e copertura in Lombardia — Italia Coperta.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it" className={`${oswald.variable} ${inter.variable}`}>
      <body className="font-body">
        <MotionProvider>
          <Spotlight />
          <div className="w-full overflow-x-hidden bg-navy-deep">
            <Header />
            {children}
            <Footer />
          </div>
        </MotionProvider>
      </body>
    </html>
  );
}
