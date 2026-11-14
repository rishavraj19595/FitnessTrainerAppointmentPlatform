import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { dbService } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type");

    if (type === "plans") {
      const plans = await dbService.getWorkoutPlans();
      return NextResponse.json({ plans });
    }

    const stats = await dbService.getAdminStats();
    return NextResponse.json({ stats });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch admin metrics" },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const body = await req.json();
    const { action, trainerProfileId, status, traineeId, trainerId, userId, traineeData, planData } = body;

    if (action === "verifyTrainer") {
      const updated = await dbService.updateTrainerVerification(trainerProfileId, status);
      return NextResponse.json({ success: true, trainer: updated });
    }

    if (action === "assignTrainee") {
      const updated = await dbService.assignTraineeToTrainer(traineeId, trainerId);
      return NextResponse.json({ success: true, assignment: updated });
    }

    if (action === "updateUserStatus") {
      const updated = await dbService.updateUserStatus(userId, status);
      return NextResponse.json({ success: true, user: updated });
    }

    if (action === "createTrainer") {
      const payload = body.trainerData || body;
      const result = await dbService.createTrainerByAdmin(payload);
      return NextResponse.json({ success: true, ...result });
    }

    if (action === "createTrainee") {
      const payload = traineeData || body;
      const result = await dbService.createTraineeByAdmin(payload);
      return NextResponse.json({ success: true, ...result });
    }

    if (action === "createWorkoutPlan") {
      const payload = planData || body;
      const newPlan = await dbService.createWorkoutPlan(payload);
      return NextResponse.json({ success: true, plan: newPlan });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Failed admin operation" },
      { status: 400 }
    );
  }
}
