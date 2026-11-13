import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { dbService } from "@/lib/db-service";
import { z } from "zod";

const recordAttendanceSchema = z.object({
  bookingId: z.string().min(1),
  clientId: z.string().min(1),
  status: z.enum(["PRESENT", "ABSENT", "NO_SHOW"]),
  notes: z.string().optional(),
});

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (session.user.role === "TRAINER") {
      const attendance = await dbService.getAttendanceByTrainer(session.user.id);
      return NextResponse.json({ attendance });
    } else {
      const attendance = await dbService.getAttendanceByClient(session.user.id);
      return NextResponse.json({ attendance });
    }
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to fetch attendance records" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "TRAINER") {
      return NextResponse.json(
        { error: "Only trainers can record session attendance" },
        { status: 403 }
      );
    }

    const body = await req.json();
    const result = recordAttendanceSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.errors[0].message },
        { status: 400 }
      );
    }

    const attendance = await dbService.recordAttendance({
      bookingId: result.data.bookingId,
      trainerId: session.user.id,
      clientId: result.data.clientId,
      status: result.data.status,
      notes: result.data.notes,
    });

    return NextResponse.json({ attendance }, { status: 201 });
  } catch (error: any) {
    console.error("Attendance recording error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to record attendance" },
      { status: 500 }
    );
  }
}
