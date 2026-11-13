import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { dbService } from "@/lib/db-service";
import { z } from "zod";

export const dynamic = "force-dynamic";

const progressSchema = z.object({
  date: z.string().default(() => new Date().toISOString()),
  weightKg: z.number().min(20).max(300),
  chestCm: z.number().optional().nullable(),
  waistCm: z.number().optional().nullable(),
  hipsCm: z.number().optional().nullable(),
  armsCm: z.number().optional().nullable(),
  thighsCm: z.number().optional().nullable(),
  bodyFatPercentage: z.number().min(3).max(60).optional().nullable(),
  strengthNotes: z.string().optional().nullable(),
  personalNotes: z.string().optional().nullable(),
  photoUrl: z.string().optional().nullable(),
});

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const clientId = searchParams.get("clientId") || session.user.id;

    // Security check: trainers can view assigned client progress, or clients view own progress
    const progress = await dbService.getProgressByClient(clientId);
    return NextResponse.json({ progress });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to fetch progress entries" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const result = progressSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.errors[0].message },
        { status: 400 }
      );
    }

    const newEntry = await dbService.addProgressEntry({
      clientId: session.user.id,
      date: result.data.date,
      weightKg: result.data.weightKg,
      chestCm: result.data.chestCm || undefined,
      waistCm: result.data.waistCm || undefined,
      hipsCm: result.data.hipsCm || undefined,
      armsCm: result.data.armsCm || undefined,
      thighsCm: result.data.thighsCm || undefined,
      bodyFatPercentage: result.data.bodyFatPercentage || undefined,
      strengthNotes: result.data.strengthNotes || undefined,
      personalNotes: result.data.personalNotes || undefined,
      photoUrl: result.data.photoUrl || undefined,
    });

    return NextResponse.json({ progress: newEntry }, { status: 201 });
  } catch (error: any) {
    console.error("Progress entry error:", error);
    return NextResponse.json(
      { error: "Failed to save progress entry" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Missing ID" }, { status: 400 });
    }

    await dbService.deleteProgressEntry(id, session.user.id);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to delete progress entry" },
      { status: 500 }
    );
  }
}
