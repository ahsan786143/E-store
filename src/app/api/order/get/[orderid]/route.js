import connectToDatabase from "@/lib/db";
import { catchError, response } from "@/lib/helperFunction";
import OrderModel from "@/models/OrderModel";
import MediaModel from "@/models/MediaModel";
import ProductModel from "@/models/ProductModel";
import ProductVariantModel from "@/models/ProductVariantModel";

export async function GET (request,{params}) {
  try {
    await connectToDatabase();
    const getParams = await params;
    const orderid = getParams.orderid
    if(!orderid){
      return response(false, 404, "Order not found");
    }
    const orderData = await OrderModel.findOne({_id:orderid}).populate("products.productId","name slug").populate({
      path:"products.variantId",
      populate:{path:"media"}

    }).lean();

    if(!orderData){
      return response(false, 404, "Order not found");
    }
    return response(true, 200, "Order data fetched successfully", orderData);

    
  } catch (error) {
    return catchError(error);
  }
}