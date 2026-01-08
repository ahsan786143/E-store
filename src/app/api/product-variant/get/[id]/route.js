import connectToDatabase from "@/lib/db";
import { catchError, response } from "@/lib/helperFunction";
import ProductVariantModel from "@/models/ProductVariantModel";
import { isValidObjectId } from "mongoose"

export async function GET(request, { params }) {
  try {
    await connectToDatabase();

    // Unwrap params (important in Next.js 16)
    const unwrappedParams = await params; 
    const rawId = unwrappedParams.id;

    // Decode and trim
    const id = decodeURIComponent(rawId).trim();

    if (!isValidObjectId(id)) {
      return response(false, 400, "Invalid Product ID");
    }

    // Fetch Product
    const getProductVariant = await ProductVariantModel.findOne(
      { _id: id, deletedAt: null },
      // "_id createdAt public_id path thumbnail_url secure_url deletedAt"
    ).populate("media","_id secure_url").lean();
      
    if (!getProductVariant) {
      return response(false, 404, "Product-variant not found");
    }

    return response(true, 200, "Product-variant found", getProductVariant);
  } catch
  (error) {
    return catchError(error);
  }
}






