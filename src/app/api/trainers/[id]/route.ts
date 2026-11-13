import { NextResponse } from "next/server";
import { dbService } from "@/lib/db-service";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const trainer = await dbService.getTrainerById(params.id);

    if (!trainer) {
      return NextResponse.json({ error: "Trainer not found" }, { status: 404 });
    }

    return NextResponse.json({ trainer });
  } catch (error: any) {
    console.error("Error fetching trainer:", error);
    return NextResponse.json(
      { error: "Failed to fetch trainer profile" },
      { status: 500 }
    );
  }
}
