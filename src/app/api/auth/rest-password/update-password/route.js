import connectToDatabase from "@/lib/db";
import { catchError, response } from "@/lib/helperFunction";
import { zSchema } from "@/lib/zodSchema";
import UserModel from "@/models/UserSignUp";
import bcrypt from "bcryptjs";

export async function POST(request) {
  try {
    await connectToDatabase();

    const payload = await request.json();
    const validationSchema = zSchema.pick({
      email: true,
      password: true,
    });

    const validatedData = validationSchema.safeParse(payload);
    if (!validatedData.success) {
      return response(false, 400, "Invalid or missing input fields", validatedData.error);
    }

    const { email, password } = validatedData.data;

    const getUser = await UserModel.findOne({ deletedAt: null, email }).select("+password");
    if (!getUser) {
      return response(false, 404, "User not found");
    }

    // Hash password before saving
    const hashedPassword = await bcrypt.hash(password, 10);
    getUser.password = hashedPassword;

    await getUser.save();

    return response(true, 200, "Password updated successfully");
  } catch (error) {
    return catchError(error);
  }
}
