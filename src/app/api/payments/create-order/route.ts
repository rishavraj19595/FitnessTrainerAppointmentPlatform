import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { dbService } from "@/lib/db-service";
import { createRazorpayOrder, RAZORPAY_KEY_ID } from "@/lib/razorpay";
import { z } from "zod";

const createOrderSchema = z.object({
  packageId: z.string().optional(),
  trainerId: z.string().optional(),
  type: z.enum(["PACKAGE", "CONSULTATION"]),
});

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const result = createOrderSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.errors[0].message },
        { status: 400 }
      );
    }

    let amount = 0;
    let receipt = `rcpt_${Date.now()}`;
    let itemTitle = "Fitness Service";

    if (result.data.type === "PACKAGE") {
      if (!result.data.packageId) {
        return NextResponse.json({ error: "Package ID is required" }, { status: 400 });
      }
      const pkg = await dbService.getPackageById(result.data.packageId);
      if (!pkg) {
        return NextResponse.json({ error: "Workout package not found" }, { status: 404 });
      }
      amount = pkg.price;
      itemTitle = pkg.title;
      receipt = `pkg_${pkg.id.slice(0, 8)}_${Date.now().toString(36)}`;
    } else {
      if (!result.data.trainerId) {
        return NextResponse.json({ error: "Trainer ID is required" }, { status: 400 });
      }
      const trainer = await dbService.getTrainerById(result.data.trainerId);
      if (!trainer) {
        return NextResponse.json({ error: "Trainer not found" }, { status: 404 });
      }
      amount = trainer.consultationPrice;
      itemTitle = `Consultation with ${trainer.user.name}`;
      receipt = `con_${trainer.id.slice(0, 8)}_${Date.now().toString(36)}`;
    }

    const razorpayOrder = await createRazorpayOrder({
      amount,
      receipt,
      notes: {
        userId: session.user.id,
        userEmail: session.user.email || "",
        itemTitle,
        type: result.data.type,
      },
    });

    return NextResponse.json({
      orderId: razorpayOrder.id,
      amount,
      currency: "INR",
      keyId: RAZORPAY_KEY_ID,
      itemTitle,
    });
  } catch (error: any) {
    console.error("Payment order creation error:", error);
    return NextResponse.json(
      { error: "Failed to initialize payment order" },
      { status: 500 }
    );
  }
}
