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

    let trainees = [];
    if (session.user.role === "trainer") {
      trainees = await dbService.getTrainees(session.user.id);
    } else if (session.user.role === "admin") {
      trainees = await dbService.getTrainees();
    } else {
      const trainee = await dbService.getTraineeByUserId(session.user.id);
      return NextResponse.json({ trainee });
    }

    return NextResponse.json({ trainees });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch trainees" },
      { status: 500 }
    );
  }
}
