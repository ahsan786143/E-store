import connectToDatabase from "@/lib/db";
import { catchError, response } from "@/lib/helperFunction";
import { zSchema } from "@/lib/zodSchema";
import ProductVariantModel from "@/models/ProductVariantModel";

export async function POST(request) {
  try {
    await connectToDatabase();

    const payload = await request.json();

    const schema = zSchema.pick({
    
        product: true,
        sku: true,
        color: true,
        size: true,
        mrp: true,
        sellingPrice: true,
        discountPercentage: true,
        media: true,


    });
    

    const validated = schema.safeParse(payload);

    if (!validated.success) {
      return response(false, 400, "Invalid or missing input fields", validated.error);
    }

    const variantData = validated.data;

    const newvariant = new ProductVariantModel({
      product: variantData.product,
      sku: variantData.sku,
      color: variantData.color,
      size: variantData.size,
      mrp: Number(variantData.mrp),
      sellingPrice: Number(variantData.sellingPrice),
      discountPercentage: Number(variantData.discountPercentage),
      media: variantData.media,
    });

    await newvariant.save();

    return response(true, 201, "Product variant created successfully", newvariant);

  } catch (error) {
    return catchError(error);
  }
}