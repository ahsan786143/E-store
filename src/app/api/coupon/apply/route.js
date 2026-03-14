import connectToDatabase from "@/lib/db";
import { catchError, response } from "@/lib/helperFunction";
import { zSchema } from "@/lib/zodSchema";
import CouponModel from "@/models/CouponModel";

export async function POST(request) {
  try {
    await connectToDatabase();

    const payload = await request.json();

    const couponFormSchema = zSchema.pick({
      code: true,
      minShoppingAmount: true,
    });

    const validate = couponFormSchema.safeParse(payload);

    if (!validate.success) {
      return response(
        false,
        400,
        "Invalid or missing input fields",
        validate.error
      );
    }

    const { code, minShoppingAmount } = validate.data;

    const couponData = await CouponModel.findOne({ code }).lean();

    if (!couponData) {
      return response(false, 404, "Invalid Coupon Code");
    }

    if (new Date() > couponData.validity) {
      return response(false, 400, "Expired Coupon");
    }

    if (minShoppingAmount < couponData.minShoppingAmount) {
      return response(false, 400, "Insufficient shopping amount");
    }

    return response(true, 200, "Coupon applied successfully", {
      discountPercentage: couponData.discountPercentage,
    });
  } catch (error) {
    return catchError(error);
  }
}