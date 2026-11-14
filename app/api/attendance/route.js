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

    const attendance = await dbService.getAttendance(filter);
    return NextResponse.json({ attendance });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch attendance records" },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user.role !== "trainer" && session.user.role !== "admin")) {
      return NextResponse.json(
        { error: "Only trainers and admins can record attendance." },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { bookingId, traineeId, date, status, notes } = body;

    if (!traineeId) {
      return NextResponse.json(
        { error: "Trainee ID is required." },
        { status: 400 }
      );
    }

    const record = await dbService.markAttendance({
      bookingId: bookingId || null,
      trainerId: session.user.id,
      traineeId,
      date: date || new Date(),
      status: status || "PRESENT",
      notes: notes || "",
    });

    return NextResponse.json({ record }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Failed to mark attendance" },
      { status: 400 }
    );
  }
}
