import connectToDatabase from "@/lib/db";
import { catchError, response } from "@/lib/helperFunction";
import ProductModel from "@/models/ProductModel";

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
    const getProduct = await ProductModel
      .find(filter)
      .select("media-description")
      .sort({ createdAt: -1 })
      .lean();

    if (!getProduct || getProduct.length === 0) {
      return response(false, 404, "No data found for export", []);
    }

    return response(true, 200, "Export data fetched successfully", getProduct);

  } catch (error) {
    return catchError(error);
  }
}
