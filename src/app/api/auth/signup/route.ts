import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";
import { hash } from "bcrypt";
import { z } from "zod";

// Validation schema
const SignUpSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(255),
  username: z.string().min(3, "Username must be at least 3 characters").max(50),
  dob: z.string().optional(),
  email: z.string().email("Invalid email format"),
  phone_number: z.string().optional(),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const validationResult = SignUpSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Invalid input", details: validationResult.error.errors },
        { status: 400 }
      );
    }

    const { name, username, dob, email, phone_number, password } =
      validationResult.data;

    const existingUser = await prisma.users.findFirst({
      where: { OR: [{ email }, { username }] },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email or username already exists." },
        { status: 400 }
      );
    }

    const hashedPassword = await hash(password, 10);

    await prisma.users.create({
      data: {
        name,
        username,
        dob: dob ? new Date(dob) : null,
        email,
        phone_number,
        auth_providers: {
          create: {
            provider: "credentials",
            provider_id: null,
            password: hashedPassword,
          },
        },
      },
    });

    // Indicate success with a JSON response
    return NextResponse.json({
      success: true,
      message: "User created successfully",
    });
  } catch {
    return NextResponse.json(
      { error: "An unexpected error occurred during signup." },
      { status: 500 }
    );
  }
}
