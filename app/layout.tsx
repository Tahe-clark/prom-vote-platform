import type { Metadata } from "next";
import { Inder, Playfair_Display } from "next/font/google";
import "./globals.css";

const inder = Inder({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-inder",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

export const metadata: Metadata = {
  title: "Gala d'Élégance — Bal de Promo 2026",
  description: "Élection du Roi et de la Reine du bal de promotion",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body
        className={`${inder.variable} ${playfair.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}