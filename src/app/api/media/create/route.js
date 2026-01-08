import connectToDatabase from "@/lib/db";
import MediaModel from "@/models/MediaModel";
import { NextResponse } from "next/server"; 
import cloudinary from "@/lib/cloudinary"; 
import { isAuthenticated, response } from "@/lib/helperFunction";

export async function POST(request) {
  const payload = await request.json();

  try {
    // const auth = await isAuthenticated("admin");
    // if (!auth.isAuth) {
    //   return NextResponse.json({ // Changed from response.json
    //     success: false,
    //     message: "You are not authorized to perform this action",
    //   }, { status: 401 });
    // }
    await connectToDatabase();
    
    const newMedia = await MediaModel.insertMany(payload);
    
    return NextResponse.json({
        success: true,
        message: "Media created successfully",
        data: newMedia
    }, { status: 200 });

  } catch (error) {
    
    if (payload && payload.length > 0) {
      const publicIds = payload.map((item) => item.public_id);
      try {
        await cloudinary.api.delete_resources(publicIds);
      } catch (deleteError) {
        console.error("Cloudinary rollback failed:", deleteError);
        error.cloudinary = deleteError;
      }
    }
    
    return NextResponse.json({
        success: false,
        message: "Failed to create media",
        error: error.message || "Database insert error"
    }, { status: 500 });
  }
}