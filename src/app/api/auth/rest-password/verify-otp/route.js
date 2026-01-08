import connectToDatabase from "@/lib/db";
import { catchError, response } from "@/lib/helperFunction";
import { SignJWT } from "jose";
import { zSchema } from "@/lib/zodSchema";
import OTPModel from "@/models/Otp.model";
import UserModel from "@/models/UserSignUp";

export async function POST(request) {
 try{
  await connectToDatabase();
   const payload = await request.json();
   const validationSchema = zSchema.pick({
     otp: true, email: true
   })

   const validatedData = validationSchema.safeParse(payload);

   if (!validatedData.success) {
     return response(false, 401, "Invalid or missing input fields", validatedData.error);
   }

   const { otp, email } = validatedData.data;

   const getOtpData = await OTPModel.findOne({ email, otp })
   if(!getOtpData){
     return response(false, 404, "Invalid OTP or expried otp");
   }

   const getUser =await UserModel.findOne({ deletedAt: null,email}).lean();

   if(!getUser){
     return response(false, 404, "User not found");
   }

   

     // remove otp after validation
      await getOtpData.deleteOne()

      return response(true,200, "OTP verified", );


  } catch (error) {
    return catchError(error);
  }
}
