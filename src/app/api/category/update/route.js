import connectToDatabase from "@/lib/db";
import { catchError, response } from "@/lib/helperFunction";
import { zSchema } from "@/lib/zodSchema";
import CategoryModel from "@/models/CategoryModel";

export async function PUT(request) {
  try {
    await connectToDatabase();
    const payload = await request.json();
    const schema = zSchema.pick({
      _id: true,
      name: true,
      slug: true,
    });

    const validated = schema.safeParse(payload);
    if (!validated.success) {
      return response(false, 400, "Invalid or missing input fields", validated.error);
    }

    const { _id, name, slug } = validated.data;

     const getCategory = await CategoryModel.findOne({ deletedAt: null, _id });
      
     if (!getCategory) {
      return response(false, 404, "Category not found");
    }
     getCategory.name = name
     getCategory.slug = slug
     await getCategory.save();
     return response(true, 200, "Category updated successfully", getCategory);1
   
  } catch (error) {
    return catchError(error);
  }
}