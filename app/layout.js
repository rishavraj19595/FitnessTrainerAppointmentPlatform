import "./globals.css";
import { Providers } from "@/components/providers";
import { Navbar } from "@/components/layout/Navbar";

export const metadata = {
  title: "FitPulse | Fitness Trainer Appointment & Management Platform",
  description:
    "India's premier fitness platform connecting trainees with verified elite trainers. Book sessions, track workout attendance, personalized diet plans, and progress analytics.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-zinc-50 text-zinc-950 antialiased selection:bg-black selection:text-white">
        <Providers>
          <Navbar />
          <main className="flex-1 flex flex-col">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
