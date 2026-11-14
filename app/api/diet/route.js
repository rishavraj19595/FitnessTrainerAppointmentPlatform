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

    const charts = await dbService.getDietCharts(filter);
    return NextResponse.json({ charts });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch diet charts" },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "trainer") {
      return NextResponse.json(
        { error: "Only trainers can publish personalized diet charts." },
        { status: 403 }
      );
    }

    const body = await req.json();
    const {
      traineeId,
      title,
      dailyCalories,
      targetProtein,
      targetCarbs,
      targetFats,
      waterIntakeLiters,
      instructions,
      meals,
    } = body;

    if (!traineeId || !title) {
      return NextResponse.json(
        { error: "Trainee ID and Diet plan title are required." },
        { status: 400 }
      );
    }

    const diet = await dbService.createDietChart({
      trainerId: session.user.id,
      traineeId,
      title,
      dailyCalories: Number(dailyCalories) || 2200,
      targetProtein: Number(targetProtein) || 140,
      targetCarbs: Number(targetCarbs) || 240,
      targetFats: Number(targetFats) || 60,
      waterIntakeLiters: Number(waterIntakeLiters) || 3.5,
      instructions: instructions || "",
      meals: meals || [],
    });

    return NextResponse.json({ diet }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Failed to create diet chart" },
      { status: 400 }
    );
  }
}
