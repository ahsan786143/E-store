import connectToDatabase from "@/lib/db";
import { catchError, response } from "@/lib/helperFunction";
import { zSchema } from "@/lib/zodSchema";
import MediaModel from "@/models/MediaModel";
import { isValidObjectId } from "mongoose";

export async function PUT(request) {
  try {
    await connectToDatabase();
    const payload = await request.json();

    // Validate using picked zod schema
    const schema = zSchema.pick({
      _id: true,
      alt: true,
      title: true,
    });

    const validated = schema.safeParse(payload);
    if (!validated.success) {
      return response(false, 400, "Invalid or missing input fields", validated.error);
    }

    const { _id, alt, title } = validated.data;

    if (!isValidObjectId(_id)) {
      return response(false, 400, "Invalid media ID");
    }

    const getMedia = await MediaModel.findById(_id);
    if (!getMedia) {
      return response(false, 404, "Media not found");
    }

    getMedia.alt = alt
    getMedia.title = title

    await getMedia.save();

    return response(true, 200, "Media updated successfully", getMedia);
  } catch (error) {
    return catchError(error);
  }
}
