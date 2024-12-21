import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";  // Import from 'jose'

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
    const secret = new TextEncoder().encode(process.env.JWT_SECRET!);  // Ensure the secret is in the correct format for jose

    // Verify the JWT using jose's jwtVerify function
    const { payload } = await jwtVerify(token, secret);

    // Optionally, store user data in a cookie or pass it to the frontend
    // Instead of modifying headers, we can add a custom cookie with user info
    const user = JSON.stringify(payload);
    const response = NextResponse.next();

    // You can pass the decoded JWT info as a cookie to the client-side if necessary
    response.cookies.set("user", user, {
      httpOnly: true,  // Keep it secure
      secure: process.env.NODE_ENV === "production",  // Use secure cookies in production
      path: "/",
      maxAge: 3600, // 1 hour
    });

    return response; // Continue to the endpoint
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
