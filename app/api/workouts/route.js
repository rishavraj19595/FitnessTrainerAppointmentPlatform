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

    const tasks = await dbService.getWorkoutTasks(filter);
    return NextResponse.json({ tasks });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch workouts" },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "trainer") {
      return NextResponse.json(
        { error: "Only trainers can create and assign workout tasks." },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { traineeId, title, description, dayOfWeek, exercises } = body;

    if (!traineeId || !title) {
      return NextResponse.json(
        { error: "Trainee ID and Workout title are required." },
        { status: 400 }
      );
    }

    const task = await dbService.createWorkoutTask({
      trainerId: session.user.id,
      traineeId,
      title,
      description: description || "",
      dayOfWeek: dayOfWeek || "Monday",
      exercises: exercises || [],
    });

    return NextResponse.json({ task }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Failed to create workout task" },
      { status: 400 }
    );
  }
}

export async function PATCH(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { taskId } = body;

    if (!taskId) {
      return NextResponse.json(
        { error: "Task ID is required." },
        { status: 400 }
      );
    }

    const task = await dbService.toggleWorkoutTask(taskId, session.user.id);
    return NextResponse.json({ task });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Failed to update workout task" },
      { status: 400 }
    );
  }
}
