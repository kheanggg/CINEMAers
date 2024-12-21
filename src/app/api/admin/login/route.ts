import { compare } from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "@/app/lib/prisma"; // Your Prisma client
import { NextRequest, NextResponse } from "next/server";

// POST Handler for the route
export async function POST(req: NextRequest) {
  try {
    // Use req.json() to parse the incoming JSON body
    const { email, password } = await req.json();

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password are required" },
        { status: 400 }
      );
    }

    // Fetch the admin user from the database
    const admin = await prisma.admin.findUnique({ where: { email } });

    // console.log(admin);

    if (!admin) {
      return NextResponse.json(
        { message: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Compare the password
    const isValid = await compare(password, admin.password);

    if (!isValid) {
      return NextResponse.json(
        { message: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Make sure admin is a valid object before generating the JWT
    if (!admin || !admin.id || !admin.role) {
      throw new Error("Invalid admin data");
    }

    // Log the admin object to ensure it's valid
    // console.log("Admin found:", admin);

    // Generate a JWT token
    const token = jwt.sign(
      { id: admin.id, role: admin.role },
      process.env.JWT_SECRET!,
      { expiresIn: "1h" }
    );

    // console.log("Generated JWT Token:", token);  // Add this line to see the generated tok

    // Set the token in the response cookies
    const response = NextResponse.json({ message: "Login successful" });
    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 3600,
    });

    // console.log("Token set in cookies:", token); // This line confirms token is being set in the cookies

    return response;
  } catch (error) {
    console.error(error); // Log the error to the server console for debugging
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

// Optional: Method validation for non-POST requests
export async function GET() {
  return NextResponse.json({ message: "Method not allowed" }, { status: 405 });
}
