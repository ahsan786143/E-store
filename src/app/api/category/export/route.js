import connectToDatabase from "@/lib/db";
import { catchError, response } from "@/lib/helperFunction";
import CategoryModel from "@/models/CategoryModel";

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
    const categories = await CategoryModel
      .find(filter)
      .sort({ createdAt: -1 })
      .lean();

    if (!categories || categories.length === 0) {
      return response(false, 404, "No data found for export", []);
    }

    return response(true, 200, "Export data fetched successfully", categories);

  } catch (error) {
    return catchError(error);
  }
}
