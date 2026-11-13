import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { dbService } from "@/lib/db-service";
import { redirect } from "next/navigation";
import { Users, Dumbbell, TrendingUp, Calendar, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const revalidate = 0;

export default async function TrainerClientsPage() {
  const session = await getServerSession(authOptions);
  if (!session || (session.user.role !== "TRAINER" && session.user.role !== "ADMIN")) {
    redirect("/login?redirect=/trainer/clients");
  }

  const trainerId = session.user.id;
  const bookings = await dbService.getBookingsByTrainer(trainerId);

  // Deduplicate clients
  const clientsMap = new Map();
  bookings.forEach((b) => {
    if (b.client?.id) {
      if (!clientsMap.has(b.client.id)) {
        clientsMap.set(b.client.id, {
          ...b.client,
          sessionCount: 0,
          latestBooking: b,
        });
      }
      const existing = clientsMap.get(b.client.id);
      existing.sessionCount += 1;
    }
  });

  const clients = Array.from(clientsMap.values());

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
          Client Roster
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Review all athletes and fitness members enrolled in your programs.
        </p>
      </div>

      {clients.length === 0 ? (
        <div className="py-20 text-center rounded-2xl border bg-card p-8">
          <Users className="h-12 w-12 text-muted-foreground mx-auto opacity-40 mb-3" />
          <h3 className="text-base font-bold">No active clients yet</h3>
          <p className="text-xs text-muted-foreground mt-1">
            When clients book consultations or workout packages with you, they will appear here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {clients.map((client) => (
            <div
              key={client.id}
              className="p-6 rounded-2xl border bg-card shadow-sm space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center space-x-3.5">
                  <Avatar className="h-12 w-12 ring-2 ring-emerald-500">
                    <AvatarImage src={client.image || ""} />
                    <AvatarFallback>{client.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      {client.name}
                    </h3>
                    <p className="text-xs text-muted-foreground truncate">{client.email}</p>
                    {client.phone && (
                      <p className="text-[11px] text-muted-foreground">{client.phone}</p>
                    )}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 text-xs space-y-1">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Sessions Booked:</span>
                    <strong className="text-foreground">{client.sessionCount} Sessions</strong>
                  </div>
                  {client.bio && (
                    <p className="text-[11px] text-slate-500 italic mt-1 line-clamp-2">
                      Goal: "{client.bio}"
                    </p>
                  )}
                </div>
              </div>

              <div className="border-t pt-3 flex gap-2">
                <Link href={`/trainer/clients/${client.id}`} className="flex-1">
                  <Button size="sm" className="w-full font-bold">
                    View Biometrics
                    <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                  </Button>
                </Link>
                <Link href={`/trainer/workouts?clientId=${client.id}`}>
                  <Button size="sm" variant="outline" className="font-semibold" title="Assign Routine">
                    <Dumbbell className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
