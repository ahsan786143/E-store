import connectToDatabase from "@/lib/db";
import { catchError, response } from "@/lib/helperFunction";
import ProductVariantModel from "@/models/ProductVariantModel";

export async function GET() {
  try {
    await connectToDatabase();

   

    const getColor = await ProductVariantModel.distinct("color");

    if (!getColor) {
      return response(false, 404, "Color not found");
    }

    return response(true, 200, "Color found", getColor);
  } catch
  (error) {
    return catchError(error);
  }
}






