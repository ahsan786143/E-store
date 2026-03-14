import connectToDatabase from "@/lib/db";
import { catchError, response } from "@/lib/helperFunction";
import OrderModel from "@/models/OrderModel";
import UserModel from "@/models/UserSignUp";

import mediaModel from "@/models/MediaModel";
import productModel from "@/models/ProductModel";
import productVariantModel from "@/models/ProductVariantModel";
export async function GET(request) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const page  = Math.max(1, parseInt(searchParams.get("page")  || "1"));
    const limit = Math.max(1, parseInt(searchParams.get("limit") || "15"));
    const skip  = (page - 1) * limit;

    const [orders, totalOrders] = await Promise.all([
      OrderModel.find({ deletedAt: null })
        .populate({
          path: "products.productId",
          select: "name slug media",
          populate: { path: "media" },
        })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      OrderModel.countDocuments({ deletedAt: null }),
    ]);

    const totalPages = Math.ceil(totalOrders / limit);

    return response(true, 200, "Orders fetched successfully", {
      orders,
      pagination: {
        page,
        limit,
        totalOrders,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    return catchError(error);
  }
}