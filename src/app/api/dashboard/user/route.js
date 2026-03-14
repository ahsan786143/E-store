import connectToDatabase from "@/lib/db";
import { catchError, response } from "@/lib/helperFunction";
import UserModel from "@/models/UserSignUp";
import OrderModel from "@/models/OrderModel";
import mediaModel from "@/models/MediaModel";
import productModel from "@/models/ProductModel";
import productVariantModel from "@/models/ProductVariantModel";


export async function GET() {
  try {
    await connectToDatabase();

    // ✅ Single populate with nested fields + media
    const recentOrders = await OrderModel.find({ deletedAt: null })
      .populate({
        path: "products.productId",
        select: "name slug media",   // name, slug bhi lo
        populate: {
          path: "media",             // media nested populate
        },
      })
      .sort({ createdAt: -1 })       // ✅ latest orders pehle
      .limit(10)                     // ✅ sirf 10 recent orders
      .lean();

    const totalOrder = await OrderModel.countDocuments({ deletedAt: null });

    return response(true, 200, "Dashboard data fetched successfully", {
      totalOrder,
      recentOrders,
    });
  } catch (error) {
    return catchError(error);
  }
}

