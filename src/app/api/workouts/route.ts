import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { dbService } from "@/lib/db-service";
import { z } from "zod";

const createWorkoutPlanSchema = z.object({
  clientId: z.string().min(1, "Client is required"),
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(5, "Description is required"),
  targetGoal: z.string().min(3, "Target goal is required"),
  exercises: z
    .array(
      z.object({
        dayOfWeek: z.number().min(1).max(7),
        exerciseName: z.string().min(1),
        sets: z.number().min(1),
        reps: z.number().min(1),
        weightKg: z.number().optional(),
        durationMinutes: z.number().optional(),
        restSeconds: z.number().default(60),
        notes: z.string().optional(),
      })
    )
    .min(1, "At least one exercise is required"),
});

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (session.user.role === "TRAINER") {
      const plans = await dbService.getWorkoutPlansByTrainer(session.user.id);
      return NextResponse.json({ workoutPlans: plans });
    } else {
      const plans = await dbService.getWorkoutPlansByClient(session.user.id);
      return NextResponse.json({ workoutPlans: plans });
    }
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to fetch workout plans" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "TRAINER") {
      return NextResponse.json(
        { error: "Only trainers can create workout plans" },
        { status: 403 }
      );
    }

    const body = await req.json();
    const result = createWorkoutPlanSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.errors[0].message },
        { status: 400 }
      );
    }

    const plan = await dbService.createWorkoutPlan({
      trainerId: session.user.id,
      clientId: result.data.clientId,
      title: result.data.title,
      description: result.data.description,
      targetGoal: result.data.targetGoal,
      exercises: result.data.exercises,
    });

    return NextResponse.json({ workoutPlan: plan }, { status: 201 });
  } catch (error: any) {
    console.error("Workout plan error:", error);
    return NextResponse.json(
      { error: "Failed to create workout plan" },
      { status: 500 }
    );
  }
}
