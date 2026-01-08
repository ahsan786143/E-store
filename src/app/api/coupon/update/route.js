import connectToDatabase from "@/lib/db";
import { catchError, response } from "@/lib/helperFunction";
import { zSchema } from "@/lib/zodSchema";
import CouponModel from "@/models/CouponModel";


export async function PUT(request) {
  try {
    await connectToDatabase();
    const payload = await request.json();
    const schema = zSchema.pick({
    _id: true,   
    code : true,
    discountPercentage: true,
    minShoppingAmount: true,
    validity: true

    });

    const validated = schema.safeParse(payload);
    if (!validated.success) {
      return response(false, 400, "Invalid or missing input fields", validated.error);
    }

    const validatedData = validated.data;

     const getCoupon = await CouponModel.findOne({ deletedAt: null, _id: validatedData._id });
      
     if (!getCoupon) {
      return response(false, 404, "Coupon not found");
    }
     getCoupon.code = validatedData.code
     getCoupon.discountPercentage = validatedData.discountPercentage
     getCoupon.minShoppingAmount = validatedData.minShoppingAmount
     getCoupon.validity = validatedData.validity
      
     await getCoupon.save();
     return response(true, 200, "Coupon updated successfully", getCoupon);
   
  } catch (error) {
    return catchError(error);
  }
}