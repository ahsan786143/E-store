import connectToDatabase from "@/lib/db";
import { catchError } from "@/lib/helperFunction";
import ProductVariantModel from "@/models/ProductVariantModel";

export async function POST(request){
  try {
    
    await connectToDatabase();

    const payload = await request.json();
    const verifiedCardData= await Promise.all(
      payload.map(async (cartItem)=>{
        const variant = await ProductVariantModel.findById(cartItem.variant).populate("product").populate("media", "secure_url").lean();
        if(variant){
          return{
              productId: product._id,
              variantId: variant._id,
              name: product.name,
              url: product.slug,
              size: variant.size,
              color: variant.color,
              mrp: variant.mrp,
              sellingPrice: variant.sellingPrice,
              media: variant?.media[0]?.secure_url,
              qty: qty,
          }
        }
      })
    )
  } catch (error ) {
    return catchError(error);
    
  }
}
