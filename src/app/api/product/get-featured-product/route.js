import connectToDatabase from "@/lib/db";
import { catchError, response } from "@/lib/helperFunction";
import ProductModel from "@/models/ProductModel";
import "@/models/MediaModel"; // IMPORTANT for populate

export async function GET() {
  try {
    await connectToDatabase();

    const products = await ProductModel.find({})
      .limit(8)
      .populate("media", "_id secure_url thumbnail_url")
      .lean();

    if (!products.length) {
      return response(false, 404, "No featured products found", []);
    }

    return response(true, 200, "Featured products found", products);
  } catch (error) {
    return catchError(error);
  }
}
