import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { dbService } from "@/lib/db-service";
import { verifyRazorpaySignature } from "@/lib/razorpay";
import { z } from "zod";

const verifyPaymentSchema = z.object({
  razorpayOrderId: z.string().min(1),
  razorpayPaymentId: z.string().min(1),
  razorpaySignature: z.string().min(1),
  packageId: z.string().optional(),
  amount: z.number().min(1),
});

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const result = verifyPaymentSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.errors[0].message },
        { status: 400 }
      );
    }

    const {
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
      packageId,
      amount,
    } = result.data;

    // Verify cryptographic signature
    const isValid = verifyRazorpaySignature({
      orderId: razorpayOrderId,
      paymentId: razorpayPaymentId,
      signature: razorpaySignature,
    });

    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid payment signature verification failed." },
        { status: 400 }
      );
    }

    // If payment was for a workout package, activate purchase
    let purchaseRecord = null;
    if (packageId) {
      purchaseRecord = await dbService.purchasePackage({
        userId: session.user.id,
        packageId,
        purchasePrice: amount,
        razorpayOrderId,
        razorpayPaymentId,
      });
    }

    return NextResponse.json({
      success: true,
      message: "Payment successfully verified and recorded.",
      purchase: purchaseRecord,
    });
  } catch (error: any) {
    console.error("Payment verification error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to verify payment." },
      { status: 500 }
    );
  }
}
