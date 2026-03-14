import connectToDatabase from "@/lib/db";
import { response, catchError } from "@/lib/helperFunction";
import OrderModel from "@/models/OrderModel";

export async function GET() {
  try {
    await connectToDatabase();

    const orders = await OrderModel.find()
      .populate("userId", "name email")
      .sort({ createdAt: -1 });

    return response(true, 200, "Orders fetched successfully", orders);
  } catch (error) {
    catchError(error);
  }
}