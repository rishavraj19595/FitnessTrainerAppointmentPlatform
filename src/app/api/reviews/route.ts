import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { dbService } from "@/lib/db-service";
import { z } from "zod";

const createReviewSchema = z.object({
  trainerProfileId: z.string().min(1),
  rating: z.number().min(1).max(5),
  comment: z.string().min(5, "Review comment must be at least 5 characters"),
});

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const result = createReviewSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.errors[0].message },
        { status: 400 }
      );
    }

    const review = await dbService.addReview({
      clientId: session.user.id,
      trainerProfileId: result.data.trainerProfileId,
      rating: result.data.rating,
      comment: result.data.comment,
    });

    return NextResponse.json({ review }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to submit review" },
      { status: 500 }
    );
  }
}
