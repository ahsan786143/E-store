import connectToDatabase from "@/lib/db";
import { catchError, response } from "@/lib/helperFunction";
import UserModel from "@/models/UserSignUp";

export async function GET() {
  try {
    await connectToDatabase();

    const user = await UserModel.findOne({ deletedAt: null }).lean();

    return response(true, 200, "Profile data fetched successfully", user);

  } catch (error) {
    return catchError(error);
  }
}