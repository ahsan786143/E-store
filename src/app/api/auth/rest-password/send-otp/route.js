import { otpEmail } from "@/email/otpEmail";
import connectToDatabase from "@/lib/db";
import { catchError, generateOTP, response } from "@/lib/helperFunction";
import { sendMail } from "@/lib/sendMail";
import { zSchema } from "@/lib/zodSchema";
import OTPModel from "@/models/Otp.model";
import UserModel from "@/models/UserSignUp"; 

export async function POST(request) {
  try {
    await connectToDatabase();

    const payload = await request.json();

    
    const validationSchema = zSchema.pick({
      email: true,
    });

    const validatedData = validationSchema.safeParse(payload);

    if (!validatedData.success) {
      return response(
        false,
        401,
        "Invalid or missing input fields",
        validatedData.error
      );
    }

     const { email } = validatedData.data;

    const getUser = await UserModel.findOne({ email });
    if (!getUser) {
      return response(false, 404, "User not found");
    }

    // Remove old OTPs
    await OTPModel.deleteMany({ email });

    const otp = generateOTP();
    const newOtpData = new OTPModel({ email, otp });
    await newOtpData.save();

    // Send OTP email
    const otpSendStatus = await sendMail(
      "Your login verification code",
      email,
      otpEmail(otp)
    );

    if (!otpSendStatus) {
      return response(false, 500, "Failed to send email");
    }

    return response(true, 200, "OTP sent successfully");
  }catch (error) {
    return catchError(error); 
  }
}
