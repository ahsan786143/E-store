import connectToDatabase from "@/lib/db";
import { catchError, response } from "@/lib/helperFunction";
import { zSchema } from "@/lib/zodSchema";
import ProductModel from "@/models/ProductModel";
import {encode } from "entities"

export async function PUT(request) {
  try {
    await connectToDatabase();
    const payload = await request.json();
    const schema = zSchema.pick({
      _id: true,
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

    const validatedData = validated.data;

     const getProduct = await ProductModel.findOne({ deletedAt: null, _id: validatedData._id });
      
     if (!getProduct) {
      return response(false, 404, "Product not found");
    }
     getProduct.name = validatedData.name
     getProduct.slug = validatedData.slug
     getProduct.category = validatedData.category
     getProduct.mrp= validatedData.mrp
     getProduct.sellingPrice= validatedData.sellingPrice
     getProduct.discountPercentage= validatedData.discountPercentage
     getProduct.description= encode(validatedData.description) 
     getProduct.media= validatedData.media
      
     await getProduct.save();
     return response(true, 200, "Product updated successfully", getProduct);
   
  } catch (error) {
    return catchError(error);
  }
}