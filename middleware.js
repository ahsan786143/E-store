import { ADMIN_DASHBOARD } from "@/app/routes/AdminPanel";
import { USER_DASHBOARD, WEBSITE_LOGIN } from "@/app/routes/UserWebsite";
import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(request) {
  const pathname = request.nextUrl.pathname;
  
  // 1. Correctly get the token value
  const tokenEntry = request.cookies.get("access_token");
  const token = tokenEntry?.value;

  // 2. Handle Unauthenticated Users
  if (!token) {
    if (!pathname.startsWith("/auth")) {
      return NextResponse.redirect(new URL(WEBSITE_LOGIN, request.url));
    }
    return NextResponse.next();
  }

  try {
    // 3. Verify Token
    const secret = new TextEncoder().encode(process.env.SECRET_KEY);
    const { payload } = await jwtVerify(token, secret);
    console.log("Token Payload:", payload); // Check if this prints in your terminal
    const role = payload.role;

    // 4. Redirect Authenticated users away from Auth pages
    if (pathname.startsWith("/auth")) {
      const target = role === "admin" ? ADMIN_DASHBOARD : USER_DASHBOARD;
      return NextResponse.redirect(new URL(target, request.url));
    }

    // 5. Role-based Route Protection
    if (pathname.startsWith("/admin") && role !== "admin") {
      return NextResponse.redirect(new URL(WEBSITE_LOGIN, request.url));
    }

    if (pathname.startsWith("/my-account") && role !== "user") {
      return NextResponse.redirect(new URL(WEBSITE_LOGIN, request.url));
    }

    return NextResponse.next();
  } catch (error) {
    // If token is expired or invalid, clear it and redirect to login
    console.error("Middleware Error:", error.message);
    const response = NextResponse.redirect(new URL(WEBSITE_LOGIN, request.url));
    response.cookies.delete("access_token");
    return response;
  }
}

export const config = {
  matcher: ["/admin/:path*", "/my-account/:path*", "/auth/:path*"],
};