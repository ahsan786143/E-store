
import cloudinary from "@/lib/cloudinary"; 
import { catchError } from "@/lib/helperFunction"; 
import { NextResponse } from "next/server";


export async function POST(request) {
  try { 
    const payload = await request.json();
    const { paramsToSign } = payload;  

    const signature = cloudinary.utils.api_sign_request(
      paramsToSign,
      process.env.CLOUDINARY_SECRET_KEY 
    );
    
    return NextResponse.json({ 
      success: true,
      signature: signature,
      apiKey: process.env.CLOUDINARY_API_KEY, 
      cloudName: process.env.CLOUDINARY_CLOUD_NAME 
    });

  } catch (error) {
    return catchError(error); 
  } 
}