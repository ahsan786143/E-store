import connectToDatabase from "@/lib/db";
import { catchError, response } from "@/lib/helperFunction";
import { zSchema } from "@/lib/zodSchema";
import CouponModel from "@/models/CouponModel";

export async function POST(request) {
  try {
    // const auth = await isAuthenticated("admin");
    // if (!auth.isAuth) {
    //   return NextResponse.json({ // Changed from response.json
    //     success: false,
    //     message: "You are not authorized to perform this action",
    //   }, { status: 401 });
    // }
    await connectToDatabase();

    const payload = await request.json();

    const schema = zSchema.pick({
      code: true,
      discountPercentage: true,
      minShoppingAmount: true,
      validity: true,
    });

    const validated = schema.safeParse(payload);

    if (!validated.success) {
      return response(
        false,
        400,
        "Invalid or missing input fields",
        validated.error.format()
      );
    }

    const couponData = validated.data;

    // Check duplicate coupon
    const existingCoupon = await CouponModel.findOne({ code: couponData.code });
    if (existingCoupon) {
      return response(false, 409, "Coupon code already exists");
    }

    const newCoupon = new CouponModel({
      code: couponData.code,
      discountPercentage: Number(couponData.discountPercentage),
      minShoppingAmount: Number(couponData.minShoppingAmount),
      validity: new Date(couponData.validity),
    });

    await newCoupon.save();

    return response(true, 201, "Coupon created successfully", newCoupon);
  } catch (error) {
    return catchError(error);
  }
}
