import connectToDatabase from "@/lib/db";
import { catchError, response } from "@/lib/helperFunction";
import { zSchema } from "@/lib/zodSchema";
import ProductModel from "@/models/ProductModel";
import { encode } from "entities";

export async function POST(request) {
  try {
    await connectToDatabase();

    const payload = await request.json();
    const schema = zSchema.pick({
      name: true,
      slug: true,
      category: true,
      mrp: true,
      sellingPrice: true,
      discountPercentage: true,
      description: true,
      media: true,
    });

    const validated = schema.safeParse(payload);

    if (!validated.success) {
      return response(false, 400, "Invalid or missing input fields", validated.error);
    }

    const productData = validated.data;

    const newProduct = new ProductModel({
      name: productData.name,
      slug: productData.slug,
      category: productData.category,
      mrp: Number(productData.mrp),
      sellingPrice: Number(productData.sellingPrice),
      discountPercentage: Number(productData.discountPercentage),
      description: encode(productData.description),
      media: productData.media,
    });

    await newProduct.save();

    return response(true, 201, "Product created successfully", newProduct);

  } catch (error) {
    return catchError(error);
  }
}
