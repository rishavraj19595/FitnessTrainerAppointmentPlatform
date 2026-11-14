import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { dbService } from "@/lib/db";

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let filter = {};
    if (session.user.role === "trainee") {
      filter.traineeId = session.user.id;
    } else if (session.user.role === "trainer") {
      filter.trainerId = session.user.id;
    }

    const bookings = await dbService.getBookings(filter);
    return NextResponse.json({ bookings });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch appointments" },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const {
      trainerId,
      workoutPlanId,
      date,
      startTime,
      endTime,
      sessionType,
      amount,
      clientNotes,
      razorpayOrderId,
      razorpayPaymentId,
    } = body;

    if (!trainerId || !date || !startTime) {
      return NextResponse.json(
        { error: "Trainer, date, and start time are required." },
        { status: 400 }
      );
    }

    const booking = await dbService.createBooking({
      traineeId: session.user.id,
      trainerId,
      workoutPlanId: workoutPlanId || null,
      date,
      startTime,
      endTime: endTime || "08:00 AM",
      sessionType: sessionType || "CONSULTATION",
      amount: Number(amount) || 0,
      clientNotes: clientNotes || "",
      razorpayOrderId: razorpayOrderId || null,
      razorpayPaymentId: razorpayPaymentId || null,
    });

    return NextResponse.json({ booking }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Failed to book appointment" },
      { status: 400 }
    );
  }
}
