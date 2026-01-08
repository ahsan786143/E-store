import connectToDatabase from "@/lib/db";
import { catchError, response } from "@/lib/helperFunction";
import { zSchema } from "@/lib/zodSchema";
import ProductVariantModel from "@/models/ProductVariantModel";
import {encode } from "entities"

export async function PUT(request) {
  try {
    await connectToDatabase();
    const payload = await request.json();
    const schema = zSchema.pick({
        _id: true,
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

    const validatedData = validated.data;

     const getProductVariant = await ProductVariantModel.findOne({ deletedAt: null, _id: validatedData._id });
      
     if (!getProductVariant) {
      return response(false, 404, "Product not found");
    }
     getProductVariant.product = validatedData.product
     getProductVariant.sku = validatedData.sku
     getProductVariant.color = validatedData.color
     getProductVariant.size = validatedData.size
     getProductVariant.slug = validatedData.slug
     getProductVariant.category = validatedData.category
     getProductVariant.mrp= validatedData.mrp
     getProductVariant.sellingPrice= validatedData.sellingPrice
     getProductVariant.discountPercentage= validatedData.discountPercentage
     getProductVariant.description= encode(validatedData.description) 
     getProductVariant.media= validatedData.media
      
     await getProductVariant.save();
     return response(true, 200, "Product variant updated successfully", getProductVariant);
   
  } catch (error) {
    return catchError(error);
  }
}

