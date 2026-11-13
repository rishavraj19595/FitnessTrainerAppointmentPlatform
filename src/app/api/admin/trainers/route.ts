import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { dbService } from "@/lib/db-service";
import { z } from "zod";

const verifyTrainerSchema = z.object({
  trainerProfileId: z.string().min(1),
  status: z.enum(["APPROVED", "REJECTED", "PENDING"]),
});

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Access denied." }, { status: 403 });
    }

    const body = await req.json();
    const result = verifyTrainerSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.errors[0].message },
        { status: 400 }
      );
    }

    const isVerified = result.data.status === "APPROVED";
    const updated = await dbService.updateTrainerVerification(
      result.data.trainerProfileId,
      result.data.status,
      isVerified
    );

    return NextResponse.json({ trainerProfile: updated });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to update trainer verification" },
      { status: 500 }
    );
  }
}
