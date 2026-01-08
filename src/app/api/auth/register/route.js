import { emailVerificationLink } from "@/email/emailverification";
import connectToDatabase from "@/lib/db";
import { catchError, response } from "@/lib/helperFunction";
import { sendMail } from "@/lib/sendMail";
import { zSchema } from "@/lib/zodSchema";
import { SignJWT } from "jose";
import bcrypt from "bcryptjs";
import UserModel from "@/models/UserSignUp";

export async function POST(request) {
  try {
    await connectToDatabase();
       //.......validation Schema..........
       
    const validationSchema = zSchema.pick({
      name: true,
      email: true,
      password: true,
    });

    const payload = await request.json();
    const validatedData = validationSchema.safeParse(payload);

    if (!validatedData.success) {
      return response(false, 401, "Invalid or missing input fields", validatedData.error);
    }

    const { name, email, password } = validatedData.data;


     //.......check if user already exists........

    const existingUser = await UserModel.exists({ email });
    if (existingUser) {
      return response(false, 409, "User already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    //  Create new user
    const NewRegistration = new UserModel ({
      name, email, password: hashedPassword 
    });
    await NewRegistration.save();

    //  Create email token
    const secret = new TextEncoder().encode(process.env.SECRET_KEY);

    const token = await new SignJWT({ userId: NewRegistration._id.toString() })
      .setIssuedAt()
      .setExpirationTime("1h")
      .setProtectedHeader({ alg: "HS256" })
      .sign(secret);

    //...........send mail...............


    await sendMail(
  "Verify your E-store account",
  email,
  `
    <p>Hi ${name}, welcome to E-store!</p>
    ${emailVerificationLink(`${process.env.NEXT_PUBLIC_BASE_URL}/auth/verify-email/${token}`)}
  `
);


    return response(
      true,
      200,
      "Registration successful! Please check your email to verify your account."
    );
  } catch (error) {
    catchError(error);
  }
}
