import connectToDatabase from "@/lib/db";
import { catchError, response } from "@/lib/helperFunction";
import CategoryModel from "@/models/CategoryModel";

export async function GET() {
  try {
    await connectToDatabase();

       const getCategory = await CategoryModel.find(
      {  deletedAt: null },
    ).lean();

    if (!getCategory) {
      return response(false, 404, "Category not found");
    }

    return response(true, 200, "Category found", getCategory);
  } catch
  (error) {
    return catchError(error);
  }
}






