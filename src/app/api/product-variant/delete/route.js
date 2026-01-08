import connectToDatabase from "@/lib/db";
import { catchError, response } from "@/lib/helperFunction";
import ProductVariantModel from "@/models/ProductVariantModel";

export async function PUT(request) {
  try {
    await connectToDatabase();

    const payload = await request.json();
    const ids = payload.ids || [];
    const deleteType = payload.deleteType; // SD = Move to trash, RESTORE = restore

    if (!Array.isArray(ids) || ids.length === 0) {
      return response(false, 400, "Invalid or empty id list");
    }

    if (!["SD", "RESTORE"].includes(deleteType)) {
      return response(false, 400, "Invalid operation type");
    }

    if (deleteType === "SD") {
      await ProductVariantModel.updateMany(
        { _id: { $in: ids } },
        { $set: { deletedAt: new Date() } }
      );
      return response(true, 200, "Moved to trash successfully");
    }

    if (deleteType === "RESTORE") {
      await ProductVariantModel.updateMany(
        { _id: { $in: ids } },
        { $set: { deletedAt: null } }
      );
      return response(true, 200, "Restored successfully");
    }
  } catch (error) {
    return catchError(error);
  }
}

// Permanent DELETE
export async function DELETE(request) {
  try {
    await connectToDatabase();

    const payload = await request.json();
    const ids = payload.ids || [];
    const deleteType = payload.deleteType;

    if (!Array.isArray(ids) || ids.length === 0) {
      return response(false, 400, "Invalid or empty id list");
    }

    if (deleteType !== "PD") {
      return response(false, 400, "deleteType must be PD for permanent delete");
    }

    await ProductVariantModel.deleteMany({ _id: { $in: ids } });

    return response(true, 200, "Data permanently deleted");
  } catch (error) {
    return catchError(error);
  }
}
