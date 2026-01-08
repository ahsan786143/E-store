import connectToDatabase from "@/lib/db";
import { catchError, response } from "@/lib/helperFunction";
import CategoryModel from "@/models/CategoryModel";
import { isValidObjectId } from "mongoose";

export async function GET(request, { params }) {
  try {
    await connectToDatabase();

    // Unwrap params (important in Next.js 16)
    const unwrappedParams = await params; 
    const rawId = unwrappedParams.id;

    // Decode and trim
    const id = decodeURIComponent(rawId).trim();

    if (!isValidObjectId(id)) {
      return response(false, 400, "Invalid media ID");
    }

    // Fetch media
    const getCategory = await CategoryModel.findOne(
      { _id: id, deletedAt: null },
      // "_id createdAt public_id path thumbnail_url secure_url deletedAt"
    ).lean();

    if (!getCategory) {
      return response(false, 404, "Media not found");
    }

    return response(true, 200, "Media found", getCategory);
  } catch
  (error) {
    return catchError(error);
  }
}






