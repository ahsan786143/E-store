import connectToDatabase from "@/lib/db";
import { catchError, response } from "@/lib/helperFunction";
import CouponModel from "@/models/CouponModel";

export async function GET(request) {
  try {
    await connectToDatabase();

    // Read deleteType from query ?deleteType=SD or PD etc.
    const { searchParams } = new URL(request.url);
    const deleteType = searchParams.get("deleteType");

    let filter = {};

    // Default (Active items only)
    if (!deleteType || deleteType === "SD") {
      filter = { deletedAt: null };
    }

    // Trash view
    if (deleteType === "PD") {
      filter = { deletedAt: { $ne: null } };
    }

    // Fetch all matching records
    const getCoupon = await CouponModel
      .find(filter)
      .sort({ createdAt: -1 })
      .lean();

    if (!getCoupon || getCoupon.length === 0) {
      return response(false, 404, "No data found for export", []);
    }

    return response(true, 200, "Export data fetched successfully", getCoupon);

  } catch (error) {
    return catchError(error);
  }
}
