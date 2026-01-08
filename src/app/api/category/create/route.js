import connectToDatabase from "@/lib/db";
import { catchError, response } from "@/lib/helperFunction";
import { zSchema } from "@/lib/zodSchema";
import CategoryModel from "@/models/CategoryModel";

export async function POST(request) {
  try {
    
    await connectToDatabase();

    const payload = await request.json();

    const schema = zSchema.pick({
      name: true,
      slug: true,
    });

    const validated = schema.safeParse(payload);
    if (!validated.success) {
      return response(false, 400, "Invalid or missing input fields", validated.error);
    }

    const { name, slug } = validated.data;

    const newCategory = await CategoryModel({ 
      name, slug 
    });

    await newCategory.save();
    return response(true, 200, "Category created successfully", newCategory);
    
  } catch (error) {
    return catchError(error);
  }
}