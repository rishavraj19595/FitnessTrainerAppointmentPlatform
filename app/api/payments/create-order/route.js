import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { createRazorpayOrder, RAZORPAY_KEY_ID } from "@/lib/razorpay";
import { dbService } from "@/lib/db";

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { amount, planId, trainerId, type } = body;

    let finalAmount = Number(amount);
    let title = "Fitness Service";

    if (planId) {
      const plan = await dbService.getWorkoutPlanById(planId);
      if (plan) {
        finalAmount = plan.price;
        title = plan.title;
      }
    } else if (trainerId) {
      const trainer = await dbService.getTrainerByUserId(trainerId);
      if (trainer) {
        finalAmount = trainer.hourlyRate;
        title = `Coaching session with ${trainer.name}`;
      }
    }

    if (!finalAmount || finalAmount <= 0) {
      return NextResponse.json(
        { error: "Invalid payment amount" },
        { status: 400 }
      );
    }

    const order = await createRazorpayOrder({
      amount: finalAmount,
      currency: "INR",
      receipt: `rcpt_${Date.now()}`,
      notes: {
        userId: session.user.id,
        userEmail: session.user.email,
        itemTitle: title,
      },
    });

    return NextResponse.json({
      orderId: order.id,
      amount: finalAmount,
      currency: "INR",
      keyId: RAZORPAY_KEY_ID,
      title,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Failed to initialize payment order" },
      { status: 500 }
    );
  }
}
