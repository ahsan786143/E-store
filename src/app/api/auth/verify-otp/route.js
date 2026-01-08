import connectToDatabase from "@/lib/db";
import { catchError } from "@/lib/helperFunction";
import { SignJWT } from "jose";
import { zSchema } from "@/lib/zodSchema";
import OTPModel from "@/models/Otp.model";
import UserModel from "@/models/UserSignUp";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    await connectToDatabase();

    
    const payload = await request.json();

    const validationSchema = zSchema.pick({
      otp: true,
      email: true,
    });

    const validatedData = validationSchema.safeParse(payload);
    if (!validatedData.success) {
      return NextResponse.json(
        { success: false, message: "Invalid input fields" },
        { status: 401 }
      );
    }

    const { otp, email } = validatedData.data;

    const getOtpData = await OTPModel.findOne({ email, otp });
    if (!getOtpData) {
      return NextResponse.json(
        { success: false, message: "Invalid or expired OTP" },
        { status: 404 }
      );
    }

    const getUser = await UserModel.findOne({ email, deletedAt: null }).lean();
    if (!getUser) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    const loggedInUserData = {
      _id: getUser._id,
      name: getUser.name,
      email: getUser.email,
      role: getUser.role,
      avatar: getUser.avatar,
    };

    const secret = new TextEncoder().encode(process.env.SECRET_KEY);

    const token = await new SignJWT(loggedInUserData)
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("24h")
      .sign(secret);

    const res = NextResponse.json({
      success: true,
      message: "Login successful",
      data: loggedInUserData,
    });

    res.cookies.set("access_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24,
    });

    await getOtpData.deleteOne();

    return res; 
  } catch (error) {
    return catchError(error);
  }
}
