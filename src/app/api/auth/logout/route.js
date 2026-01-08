import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import { catchError } from "@/lib/helperFunction";

export async function POST(request) {
  try {
    await connectToDatabase();

    // Create a response with the Set-Cookie header to clear the token
    const response = NextResponse.json({
      success: true,
      message: "Logged out successfully",
    });

    // Set cookie to expire immediately
    response.cookies.set({
      name: "access_token",
      value: "",
      path: "/",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 0, // expire immediately
    });

    return response;
  } catch (error) {
    return catchError(error);
  }
}
