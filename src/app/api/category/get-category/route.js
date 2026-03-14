import connectToDatabase from "@/lib/db";
import { catchError, response } from "@/lib/helperFunction";
import CategoryModel from "@/models/CategoryModel";

export async function GET() {
  try {
    await connectToDatabase();

    const categories = await CategoryModel.find({
      $or: [{ deletedAt: null }, { deletedAt: { $exists: false } }],
    }).lean();

    if (!categories.length) {
      return response(false, 404, "Category not found");
    }

    return response(true, 200, "Category found", categories);
  } catch (error) {
    return catchError(error);
  }
}