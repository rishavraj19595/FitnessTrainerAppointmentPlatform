import { Mail, Phone, MapPin, Send, MessageSquare } from "lucide-react";
import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

export default function ContactPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-1 py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
          <div className="max-w-2xl mb-12">
            <Badge variant="outline" className="border-emerald-500/40 text-emerald-600 mb-2">
              Support & Inquiries
            </Badge>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900 dark:text-white">
              We're Here To Help Your Fitness Journey
            </h1>
            <p className="mt-3 text-muted-foreground text-base sm:text-lg">
              Have questions about booking trainers, workout packages, or trainer
              onboarding? Get in touch with our concierge team.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Contact details */}
            <div className="space-y-6">
              <div className="p-6 rounded-2xl border bg-card space-y-2">
                <div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center mb-3">
                  <Mail className="h-5 w-5" />
                </div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">Email Us</h4>
                <p className="text-xs text-muted-foreground">Direct response within 2 hours</p>
                <p className="text-sm font-semibold text-emerald-600">support@fitpulse.com</p>
              </div>

              <div className="p-6 rounded-2xl border bg-card space-y-2">
                <div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center mb-3">
                  <Phone className="h-5 w-5" />
                </div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">Phone Support</h4>
                <p className="text-xs text-muted-foreground">Mon-Fri 8am - 8pm EST</p>
                <p className="text-sm font-semibold text-emerald-600">+1 (800) FIT-PULSE</p>
              </div>

              <div className="p-6 rounded-2xl border bg-card space-y-2">
                <div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center mb-3">
                  <MapPin className="h-5 w-5" />
                </div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">Headquarters</h4>
                <p className="text-xs text-muted-foreground">San Francisco, CA & Global Remote Operations</p>
              </div>
            </div>

            {/* Contact form */}
            <div className="lg:col-span-2 p-8 rounded-2xl border bg-card shadow-sm space-y-6">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                Send Us a Message
              </h3>

              <form className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="name">Your Name</Label>
                    <Input id="name" placeholder="Alex Morgan" required />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" type="email" placeholder="alex@example.com" required />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="subject">Subject</Label>
                  <Input id="subject" placeholder="Question regarding trainer verification or bookings" required />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="message">Message</Label>
                  <textarea
                    id="message"
                    rows={4}
                    placeholder="How can our support team assist you today?"
                    required
                    className="w-full p-3 rounded-xl border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <Button type="button" className="w-full h-11 font-bold shadow-md shadow-emerald-600/20">
                  <Send className="mr-2 h-4 w-4" />
                  Send Message
                </Button>
              </form>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
