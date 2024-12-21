import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;

  // Exclude /admin/login from being protected by the middleware
  if (req.nextUrl.pathname === "/admin/login") {
    return NextResponse.next(); // Allow access to the login page without a token
  }

  if (!token) {
    // Redirect to login page if no token is found
    return NextResponse.redirect(new URL("/admin/login", req.url));
  }

  try {
    const secret = process.env.JWT_SECRET!;
    const decoded = jwt.verify(token, secret);

    // Attach user data to the request for later use (optional)
    req.headers.set("user", JSON.stringify(decoded));

    return NextResponse.next(); // Continue to the endpoint
  } catch (error) {
    console.error("Token verification failed:", error);

    // Redirect to login page if token is invalid or expired
    return NextResponse.redirect(new URL("/admin/login", req.url));
  }
}

// Example matcher to apply this middleware to all routes under `/admin`, except `/admin/login`
export const config = {
  matcher: "/admin/:path*", // Protect all routes under `/admin` except `/admin/login`
};
