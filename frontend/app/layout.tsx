import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { AppChrome } from "@/components/layout/app-chrome";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap"
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap"
});

export const metadata: Metadata = {
  metadataBase: new URL("https://mins.example"),
  title: {
    default: "MINES | Building Trust Since 2007",
    template: "%s | MINS"
  },
  description:
    "MINES is a trusted company delivering quality services with professionalism, commitment, and customer-first business values since 2007.",
  keywords: [
    "MINSE",
    "corporate services",
    "trading services",
    "industrial solutions",
    "business consultancy",
    "product supply"
  ],
  openGraph: {
    title: "MINES | Building Trust Since 2007",
    description:
      "Trusted company delivering quality services with professionalism and commitment.",
    url: "https://mins.example",
    siteName: "MINES",
    type: "website"
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body>
        <AppChrome>{children}</AppChrome>
      </body>
    </html>
  );
}
