import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { dbService } from "@/lib/db-service";
import { z } from "zod";

const updateProfileSchema = z.object({
  name: z.string().min(2).optional(),
  phone: z.string().optional(),
  bio: z.string().optional(),
  image: z.string().optional(),
  headline: z.string().optional(),
  experienceYears: z.number().optional(),
  consultationPrice: z.number().optional(),
  languages: z.array(z.string()).optional(),
  specializations: z.array(z.string()).optional(),
});

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const result = updateProfileSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.errors[0].message },
        { status: 400 }
      );
    }

    const updatedUser = await dbService.updateUser(session.user.id, {
      name: result.data.name,
      phone: result.data.phone,
      bio: result.data.bio,
      image: result.data.image,
    });

    if (session.user.role === "TRAINER") {
      await dbService.updateTrainerProfile(session.user.id, {
        headline: result.data.headline,
        bio: result.data.bio,
        experienceYears: result.data.experienceYears,
        consultationPrice: result.data.consultationPrice,
        languages: result.data.languages,
        specializations: result.data.specializations,
        profileImage: result.data.image,
      });
    }

    return NextResponse.json({ user: updatedUser });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    );
  }
}
