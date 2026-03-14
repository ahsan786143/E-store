import { ADMIN_DASHBOARD } from "@/app/routes/AdminPanel";
import { USER_DASHBOARD, WEBSITE_LOGIN } from "@/app/routes/UserWebsite";
import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(request) {
  try {
    const pathname = request.nextUrl.pathname;
    const token = request.cookies.get("access_token")?.value; // ✅ get the string value

    if (!token) {
      if (!pathname.startsWith("/auth")) {
        return NextResponse.redirect(new URL(WEBSITE_LOGIN, request.nextUrl));
      }
      return NextResponse.next();
    }

    const { payload } = await jwtVerify(
      token, // ✅ pass the string, not the cookie object
      new TextEncoder().encode(process.env.SECRET_KEY)
    );
    const role = payload.role;

    if (pathname.startsWith("/auth")) {
      return NextResponse.redirect(
        new URL(role === "admin" ? ADMIN_DASHBOARD : USER_DASHBOARD, request.nextUrl)
      );
    }

    if (pathname.startsWith("/admin") && role !== "admin") {
      return NextResponse.redirect(new URL(WEBSITE_LOGIN, request.nextUrl));
    }

    if (pathname.startsWith("/my-account") && role !== "user") {
      return NextResponse.redirect(new URL(WEBSITE_LOGIN, request.nextUrl));
    }

    return NextResponse.next();

  } catch (error) {
    console.error("Middleware error:", error); // helpful for debugging
    return NextResponse.redirect(new URL(WEBSITE_LOGIN, request.nextUrl));
  }
}

export const config = {
  matcher: ["/admin/:path*", "/my-account/:path*", "/auth/:path*"],
};