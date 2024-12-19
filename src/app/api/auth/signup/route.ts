import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";
import { hash } from "bcrypt";
import { z } from "zod"; // Recommended for validation

// Validation schema
const SignUpSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(255),
  username: z.string().min(3, "Username must be at least 3 characters").max(50),
  dob: z.string().optional(), // Or use z.date() if you want to ensure it's a valid date
  email: z.string().email("Invalid email format"),
  phone_number: z.string().optional(),
  password: z.string().min(8, "Password must be at least 8 characters")
});

export async function POST(req: NextRequest) {
  try {
    // Parse the incoming JSON request body
    const body = await req.json();

    // Validate input using Zod
    const validationResult = SignUpSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { 
          error: "Invalid input", 
          details: validationResult.error.errors 
        },
        { status: 400 }
      );
    }

    const { name, username, dob, email, phone_number, password } = validationResult.data;

    // Check if the user already exists
    const existingUser = await prisma.users.findFirst({
      where: {
        OR: [
          { email },
          { username }
        ]
      }
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email or username already exists." },
        { status: 400 }
      );
    }

    // Hash the password
    const hashedPassword = await hash(password, 10);

    // Create the user with auth provider
    const user = await prisma.users.create({
      data: {
        name,
        username,
        dob: dob ? new Date(dob) : null,
        email,
        phone_number,
        auth_providers: {
          create: {
            provider: "credentials",  // Example: custom provider
            provider_id: null,  // You can use the email as the provider_id if needed
            password: hashedPassword,  // Store the hashed password
          },
        },
      },
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        created_at: true,
        auth_providers: true, // This will return related auth_providers
      }
    });

    return NextResponse.json(
      { user },
      { status: 201 }
    );
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred during signup." },
      { status: 500 }
    );
  }
}
