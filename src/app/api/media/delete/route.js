
import cloudinary from "@/lib/cloudinary";
import connectToDatabase from "@/lib/db";
import { catchError, response } from "@/lib/helperFunction";
import MediaModel from "@/models/MediaModel";
import mongoose from "mongoose";

// -------------------- PUT API: Move to Trash / Restore --------------------

// PUT => Soft Delete OR Restore
export async function PUT(request) {
  try {
    await connectToDatabase();

    const payload = await request.json();
    const ids = payload.ids || [];
    const deleteType = payload.deleteType; // SD = trash, RESTORE = restore

    if (!Array.isArray(ids) || ids.length === 0) {
      return response(false, 400, "Invalid or empty id list");
    }

    if (!["SD", "RESTORE"].includes(deleteType)) {
      return response(false, 400, "Invalid operation type");
    }

    if (deleteType === "SD") {
      await MediaModel.updateMany(
        { _id: { $in: ids } },
        { $set: { deletedAt: new Date() } }
      );
      return response(true, 200, "Moved to trash successfully");
    }

    if (deleteType === "RESTORE") {
      await MediaModel.updateMany(
        { _id: { $in: ids } },
        { $set: { deletedAt: null } }
      );
      return response(true, 200, "Restored successfully");
    }
  } catch (error) {
    return catchError(error);
  }
}

// -------------------- DELETE API: Permanent Deletion --------------------
export async function DELETE(request) {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    await connectToDatabase();

    const payload = await request.json();
    const ids = payload.ids || [];
    const deleteType = payload.deleteType; // must be "PD"

    if (!Array.isArray(ids) || ids.length === 0) {
      return response(false, 400, "Invalid or empty id list");
    }

    const media = await MediaModel.find({ _id: { $in: ids } })
      .session(session)
      .lean();

    if (!media.length) {
      return response(false, 404, "Data not found");
    }

    if (deleteType !== "PD") {
      return response(
        false,
        400,
        "Invalid delete operation: deleteType should be 'PD' for permanent deletion"
      );
    }

    // Delete from DB
    await MediaModel.deleteMany({ _id: { $in: ids } }).session(session);

    // Delete files from Cloudinary
    const publicIds = media.map((m) => m.public_id);

    try {
      if (publicIds.length > 0) {
        await cloudinary.api.delete_resources(publicIds);
      }
    } catch (cloudError) {
      await session.abortTransaction();
      session.endSession();
      return response(false, 500, "Failed to delete media files from Cloudinary");
    }

    await session.commitTransaction();
    session.endSession();

    return response(true, 200, "Data deleted permanently successfully");
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    return catchError(error);
  }
}



