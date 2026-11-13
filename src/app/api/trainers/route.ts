import { NextResponse } from "next/server";
import { dbService } from "@/lib/db-service";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || undefined;
    const specialization = searchParams.get("specialization") || undefined;
    const maxPrice = searchParams.get("maxPrice")
      ? Number(searchParams.get("maxPrice"))
      : undefined;
    const minRating = searchParams.get("minRating")
      ? Number(searchParams.get("minRating"))
      : undefined;

    const trainers = await dbService.getAllTrainers({
      search,
      specialization,
      maxPrice,
      minRating,
    });

    return NextResponse.json({ trainers });
  } catch (error: any) {
    console.error("Error fetching trainers:", error);
    return NextResponse.json(
      { error: "Failed to fetch trainers" },
      { status: 500 }
    );
  }
}
