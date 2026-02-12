import connectToDatabase from "@/lib/db";
import { catchError, response } from "@/lib/helperFunction";
import ReviewModel from "@/models/ReviewModel";
import mongoose from "mongoose";

export async function GET(request) {
  try {
    await connectToDatabase();

    const searchParams = request.nextUrl.searchParams;
    const productId = searchParams.get("productId");

    if (!productId) {
      return response(false, 404, "Product is missing");
    }

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return response(false, 400, "Invalid Product ID");
    }

    const review = await ReviewModel.aggregate([
      {
        $match: {
          product: new mongoose.Types.ObjectId(productId),
          deletedAt: null,
        },
      },
      {
        $group: {
          _id: "$rating",
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    /*  Total Reviews */
    const totalReview = review.reduce((sum, r) => sum + r.count, 0);

    /*  Average Rating */
    const averageRating =
      totalReview > 0
        ? (
            review.reduce((sum, r) => sum + r._id * r.count, 0) /
            totalReview
          ).toFixed(1)
        : "0.0";

    /* Rating Count Map */
    const rating = review.reduce((acc, r) => {
      acc[r._id] = r.count;
      return acc;
    }, {});

    /*  Percentage Map (FIXED) */
    const percentage = review.reduce((acc, r) => {
      acc[r._id] =
        totalReview > 0 ? (r.count / totalReview) * 100 : 0;
      return acc;
    }, {});

    return response(true, 200, "Review summary fetched", {
      totalReview,
      averageRating,
      rating,
      percentage,
    });
  } catch (error) {
    return catchError(error);
  }
}
