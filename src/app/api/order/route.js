import connectToDatabase from "@/lib/db";
import { catchError, response } from "@/lib/helperFunction";
import OrderModel from "@/models/OrderModel";
import { zSchema } from "@/lib/zodSchema";

export async function POST(request) {
  try {
    await connectToDatabase();

    /* ============================
       PARSE & VALIDATE PAYLOAD
    ============================ */
    const payload = await request.json();

    const schema = zSchema.pick({
      fullName:   true,
      email:      true,
      phone:      true,
      address:    true,
      city:       true,
      postalCode: true,
      country:    true,
      ordernote:  true,
    });

    const validated = schema.safeParse(payload);

    if (!validated.success) {
      return response(false, 400, "Invalid input fields", validated.error);
    }

    const {
      fullName,
      email,
      phone,
      address,
      city,
      postalCode,
      country,
      ordernote,
      products,
      subtotal,
      discount,
      couponDiscount,
      total,
    } = payload;

    /* ============================
       VALIDATE PRODUCTS
    ============================ */
    if (!products || !Array.isArray(products) || products.length === 0) {
      return response(false, 400, "Cart is empty. Cannot place order.");
    }

    /* ============================
       CREATE ORDER
       (fields directly — no nesting)
    ============================ */
    const newOrder = new OrderModel({
      fullName,
      email,
      phone,
      address,
      city,
      postalCode,
      country,
      ordernote: ordernote || "",

      products,

      subtotal,
      discount,
      couponDiscount,
      total,

      canUpdateAddressUntil: new Date(Date.now() + 24 * 60 * 60 * 1000),
    });

    await newOrder.save();

    // ✅ _id ko string mein convert karke bhejo
    // taake frontend par Order ID properly show ho
    const orderData = {
      ...newOrder.toObject(),
      _id: newOrder._id.toString(),
    };

    return response(true, 201, "Order placed successfully", orderData);
  } catch (error) {
    return catchError(error);
  }
}