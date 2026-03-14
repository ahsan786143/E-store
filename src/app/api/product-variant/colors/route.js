import connectToDatabase from "@/lib/db";
import { catchError, response } from "@/lib/helperFunction";
import ProductVariantModel from "@/models/ProductVariantModel";

export async function GET() {
  try {
    await connectToDatabase();

    const colors = await ProductVariantModel.distinct("color");

    if (!colors.length) {
      return response(false, 404, "Color not found");
    }

    return response(true, 200, "Color found", colors);
  } catch (error) {
    return catchError(error);
  }
}