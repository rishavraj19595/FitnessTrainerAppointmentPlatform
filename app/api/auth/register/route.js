import { NextResponse } from "next/server";
import { dbService } from "@/lib/db";

export async function POST(req) {
  try {
    const body = await req.json();
    const { name, email, password, role, phone } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Name, email, and password are required." },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters long." },
        { status: 400 }
      );
    }

    const assignedRole = role === "trainer" ? "trainer" : "trainee";

    const newUser = await dbService.createUser({
      name,
      email,
      password,
      role: assignedRole,
      phone: phone || "",
    });

    return NextResponse.json(
      {
        message: "Account created successfully.",
        user: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
        },
      },
      { status: 201 }
    );
  } catch (err) {
    return NextResponse.json(
      { error: err.message || "Failed to create account" },
      { status: 400 }
    );
  }
}
