import connectToDatabase from "@/lib/db";
import { catchError, response } from "@/lib/helperFunction";
import UserModel from "@/models/UserSignUp";
import { jwtVerify } from "jose";
import { isValidObjectId } from "mongoose";

export async function POST(request) {
  try {
    await connectToDatabase();
    const { token } = await request.json();

    if (!token) {
      return response(false, 401, "Token not found");
    }

    const secret = new TextEncoder().encode(process.env.SECRET_KEY);
    const decoded = await jwtVerify(token, secret);
    const userId = decoded.payload.userId;
    // console.log(decoded);

    if (!isValidObjectId(userId)) {
      return response(false, 401, "Invalid token");
    }

    //...... get user.......
   // Inside your verification POST route
const user = await UserModel.findById(userId);

if (!user) {
    return response(false, 404, "User not found");
}

// Use findByIdAndUpdate to be more explicit if save() is failing
const updatedUser = await UserModel.findByIdAndUpdate(
    userId, 
    { $set: { isEmailVerified: true } }, 
    { new: true }
);

if (updatedUser) {
    return response(true, 200, "Email verified successfully", updatedUser);
}

    if (user.isEmailVerified) {
      return response(true, 200, "Email already verified", user);
    }

    user.isEmailVerified = true;
    await user.save();

    return response(true, 200, "Email verified successfully", user);
  } catch (error) {
    return catchError(error);
  }
}
