import connectToDatabase from "@/lib/db";
import { catchError } from "@/lib/helperFunction";
import MediaModel from "@/models/MediaModel";
import { NextResponse } from "next/server";

export async function GET(request){
  try {
    await connectToDatabase();

    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page"), 10) || 0;
    const limit = parseInt(searchParams.get("limit"), 10) || 10;
    const deleteType = searchParams.get("deleteType");
    // SD- Soft Delete, RSD- restore soft Delete, PD => permanent delete

    let filter= {}
    if (deleteType === "SD"){
      filter = {deletedAt: null};
    }else if(deleteType === "PD"){
      filter = {deletedAt: {$ne: null}};
    }

    const mediaData = await MediaModel.find(filter).sort({ createdAt: -1 }).skip(page * limit).limit(limit).lean();
    const totalMedia = await MediaModel.countDocuments(filter);

    return NextResponse.json({
      mediaData : mediaData,
      hasMore : ((page + 1) * limit) < totalMedia
    })
  } catch (error) {
    return catchError(error);
  }
}