import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { dbService } from "@/lib/db-service";
import { z } from "zod";

const createPackageSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  durationWeeks: z.number().min(1),
  sessionCount: z.number().min(1),
  price: z.number().min(100),
  trainingType: z.string().min(2),
  difficultyLevel: z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED"]),
  includedServices: z.array(z.string()).default([]),
  targetGoal: z.string().min(3),
  coverImage: z.string().optional(),
});

export async function GET() {
  try {
    const packages = await dbService.getAllPackages();
    return NextResponse.json({ packages });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to fetch packages" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user.role !== "TRAINER" && session.user.role !== "ADMIN")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const trainerProfile = await dbService.getTrainerById(session.user.id);
    if (!trainerProfile) {
      return NextResponse.json(
        { error: "Trainer profile not found" },
        { status: 404 }
      );
    }

    const body = await req.json();
    const result = createPackageSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.errors[0].message },
        { status: 400 }
      );
    }

    const newPackage = await dbService.createPackage({
      ...result.data,
      trainerProfileId: trainerProfile.id,
    });

    return NextResponse.json({ package: newPackage }, { status: 201 });
  } catch (error: any) {
    console.error("Package creation error:", error);
    return NextResponse.json(
      { error: "Failed to create workout package" },
      { status: 500 }
    );
  }
}
