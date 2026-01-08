import { emailVerificationLink } from "@/email/emailverification";
import { otpEmail } from "@/email/otpEmail";
import connectToDatabase from "@/lib/db";
import { response, catchError, generateOTP } from "@/lib/helperFunction";
import { sendMail } from "@/lib/sendMail";
import { zSchema } from "@/lib/zodSchema";
import OTPModel from "@/models/Otp.model";
import UserModel from "@/models/UserSignUp";
import { SignJWT } from "jose";
import z  from "zod";
import bcrypt from "bcryptjs";


export async function POST(request) {
  try{
    await connectToDatabase();
    const payload = await request.json();
    const validationSchema = zSchema.pick({
      email: true,  
    }).extend({
      password: z.string()
    }) 
    const validatedData = validationSchema.safeParse(payload);
    if(!validatedData.success){
            return response(false, 401, "Invalid or missing input fields",
               validatedData.error); 
    }
    const { email, password }= validatedData.data;
    // ..........get user..............

    const getUser = await UserModel.findOne({deletedAt: null,email}).select("+password");
//     console.log("Found User:", getUser);
//     console.log("User found:", getUser.email);
// console.log("Hashed password from DB:", getUser.password);
// console.log("Password match:", await bcrypt.compare(password, getUser.password));


    if(!getUser){
      return response(false, 404, "User not found");
    }
    

    // resend email verification
   if (!getUser.isEmailVerified) {
    const secret = new TextEncoder().encode(process.env.SECRET_KEY);
        const token = await new SignJWT({ userId: getUser._id.toString() })
          .setIssuedAt()
          .setExpirationTime("1h")
          .setProtectedHeader({ alg: "HS256" })
          .sign(secret);
    
        await sendMail(
          "Welcome to E-store",
          `Hi ${getUser.name}, Welcome to E-store`,
          email,
          emailVerificationLink(
            `${process.env.NEXT_PUBLIC_BASE_URL}/auth/verify-email/${token}`
          )
        );
              return response(false, 400, "Please verify your email first");

   }

   // ..........check password........
    
 const isPasswordVerified = await getUser.comparePassword(password);
if (!isPasswordVerified) {
  return response(false, 400, "Invalid password");
}



   
    //...... OTP Generation......

    await OTPModel.deleteMany({email}); // delete previous otp

    const otp = generateOTP();
    // console.log("Generated OTP:", otp);


    // store otp in database
    const newOtpData = new OTPModel({
      email,
      otp
    })

    await newOtpData.save();
    // console.log("OTP Saved in DB:", newOtpData);


   const otpEmailStatus = await sendMail(`Your login verification  code `,
    email,otpEmail(otp)
   )

  //  console.log("OTP EMAIL STATUS:", otpEmailStatus);

   if(!otpEmailStatus.success){
    return response(false, 400, "Error sending OTP email");
   }
    return response(true, 200, "Please verify your device ");


  }catch (error) {
    return catchError(error);
  }
  
}