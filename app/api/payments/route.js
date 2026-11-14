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
      filter.userId = session.user.id;
    } else if (session.user.role === "trainer") {
      filter.trainerId = session.user.id;
    }

    const payments = await dbService.getPayments(filter);
    return NextResponse.json({ payments });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch transactions" },
      { status: 500 }
    );
  }
}
