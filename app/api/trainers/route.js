import { NextResponse } from "next/server";
import { dbService } from "@/lib/db";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search");
    const specialization = searchParams.get("specialization");
    const maxPrice = searchParams.get("maxPrice");
    const verifiedOnly = searchParams.get("verifiedOnly") === "true";

    const trainers = await dbService.getTrainers({
      search,
      specialization,
      maxPrice,
      verifiedOnly,
    });

    return NextResponse.json({ trainers });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch trainers" },
      { status: 500 }
    );
  }
}
