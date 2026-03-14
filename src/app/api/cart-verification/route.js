import connectToDatabase from "@/lib/db";
import { catchError, response } from "@/lib/helperFunction";
import ProductVariantModel from "@/models/ProductVariantModel";

export async function POST(request) {
  try {
    await connectToDatabase();

    const payload = await request.json(); // should be ARRAY

    if (!Array.isArray(payload)) {
      return response(false, 400, "Invalid cart format", []);
    }

    const verifiedRaw = await Promise.all(
      payload.map(async (cartItem) => {
        const variant = await ProductVariantModel.findById(
          cartItem.variantId
        )
          .populate("product")
          .populate("media", "secure_url")
          .lean();

        if (!variant) return null;

        return {
          productId: variant.product._id,
          variantId: variant._id,
          name: variant.product.name,
          url: variant.product.slug,
          size: variant.size,
          color: variant.color,
          mrp: variant.mrp,
          sellingPrice: variant.sellingPrice,
          media: variant?.media?.[0]?.secure_url,
          qty: cartItem.qty,
        };
      })
    );

    const verifiedCartData = verifiedRaw.filter(Boolean);

    return response(true, 200, "Cart verified", verifiedCartData);
  } catch (error) {
    return catchError(error);
  }
}