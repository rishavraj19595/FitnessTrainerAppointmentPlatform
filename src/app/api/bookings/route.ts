import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { dbService } from "@/lib/db-service";
import { z } from "zod";

const createBookingSchema = z.object({
  trainerId: z.string().min(1, "Trainer ID is required"),
  packagePurchaseId: z.string().nullable().optional(),
  date: z.string().min(1, "Date is required"),
  startTime: z.string().min(1, "Start time is required"),
  endTime: z.string().min(1, "End time is required"),
  sessionType: z.enum(["CONSULTATION", "PACKAGE_SESSION"]),
  clientNotes: z.string().optional(),
  amount: z.number().default(0),
});

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (session.user.role === "TRAINER") {
      const bookings = await dbService.getBookingsByTrainer(session.user.id);
      return NextResponse.json({ bookings });
    } else {
      const bookings = await dbService.getBookingsByClient(session.user.id);
      return NextResponse.json({ bookings });
    }
  } catch (error: any) {
    console.error("Error fetching bookings:", error);
    return NextResponse.json(
      { error: "Failed to fetch bookings" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const result = createBookingSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.errors[0].message },
        { status: 400 }
      );
    }

    const newBooking = await dbService.createBooking({
      clientId: session.user.id,
      trainerId: result.data.trainerId,
      packagePurchaseId: result.data.packagePurchaseId,
      date: result.data.date,
      startTime: result.data.startTime,
      endTime: result.data.endTime,
      sessionType: result.data.sessionType,
      clientNotes: result.data.clientNotes,
      amount: result.data.amount,
    });

    return NextResponse.json({ booking: newBooking }, { status: 201 });
  } catch (error: any) {
    console.error("Booking creation error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to create booking" },
      { status: 400 }
    );
  }
}
