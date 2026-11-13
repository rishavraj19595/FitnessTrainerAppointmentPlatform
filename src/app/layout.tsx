import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/providers";
import Script from "next/script";

export const metadata: Metadata = {
  title: "FitPulse | Fitness Trainer Appointment & Progress Platform",
  description:
    "Connect with certified fitness trainers, book personalized consultations, purchase workout packages, track your measurements, and achieve your peak physique.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <Script
          src="https://checkout.razorpay.com/v1/checkout.js"
          strategy="beforeInteractive"
        />
      </head>
      <body className="font-sans antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
