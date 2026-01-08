import connectToDatabase from "@/lib/db";
import { catchError, response } from "@/lib/helperFunction";
import CategoryModel from "@/models/CategoryModel";
import ProductModel from "@/models/ProductModel";
import UserModel from "@/models/UserSignUp";


export async function GET(){
  try {
    await connectToDatabase();

    const [category, product, customer] = await Promise.all([
      CategoryModel.countDocuments({ deletedAt: null }),
      ProductModel.countDocuments({ deletedAt: null }),
      UserModel.countDocuments({ deletedAt: null }),
    ])
     
    return response(true, 200, "Dashboard count", {category, product, customer});
    
  } catch (error) {
     return catchError(error);
  }
}