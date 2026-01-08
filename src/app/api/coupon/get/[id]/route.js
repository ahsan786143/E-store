import connectToDatabase from "@/lib/db";
import { catchError, response } from "@/lib/helperFunction";
import CouponModel from "@/models/CouponModel";

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
      return response(false, 400, "Invalid Coupon ID");
    }

    // Fetch Coupon
    const getCoupon = await CouponModel.findOne(
      { _id: id, deletedAt: null },
      // "_id createdAt public_id path thumbnail_url secure_url deletedAt"
    ).lean();
      
    if (!getCoupon) {
      return response(false, 404, "Coupon not found");
    }

    return response(true, 200, "Coupon found", getCoupon);
  } catch
  (error) {
    return catchError(error);
  }
}






