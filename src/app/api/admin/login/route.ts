import { compare } from "bcrypt";
import { SignJWT } from "jose";  // Import SignJWT from jose
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

    // Ensure admin is a valid object before generating the JWT
    if (!admin || !admin.id || !admin.role) {
      throw new Error("Invalid admin data");
    }

    // Generate a JWT token using jose's SignJWT
    const secret = new TextEncoder().encode(process.env.JWT_SECRET!); // Encode the secret key as a Uint8Array
    const token = await new SignJWT({ id: admin.id, role: admin.role })
      .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })  // Set the header with the signing algorithm (HS256) and type (JWT)
      .setExpirationTime("1h")  // Set token expiry to 1 hour
      .sign(secret);  // Sign the token with the secret

    // Set the token in the response cookies
    const response = NextResponse.json({ message: "Login successful" });
    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Use secure cookies in production
      path: "/",
      maxAge: 3600, // 1 hour
    });

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
