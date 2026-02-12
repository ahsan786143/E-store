import connectToDatabase from "@/lib/db";
import { catchError, response } from "@/lib/helperFunction";
import ProductModel from "@/models/ProductModel";
import MediaModel from "@/models/MediaModel";
import ProductVariantModel from "@/models/ProductVariantModel";
import ReviewModel from "@/models/ReviewModel";
export async function GET(request, { params }) {
  try {
    await connectToDatabase();
    const getParams = await params;
    const slug = await getParams.slug;

    const searchParams = request.nextUrl.searchParams
    const size = searchParams.get('size');
    const color = searchParams.get('color');


    const filter = {
      deletedAt: null,
    }
     if(!slug ){
      return response(false, 404, "Product not found");
     }
     filter.slug = slug
     // get product details

     const getProduct = await ProductModel.findOne(filter).populate("media","secure_url").lean()
      if (!getProduct) {
        return response(false, 404, "Product not found");
      }
      // get  product variant 
      const variantFilter = {
        product: getProduct._id,
      }
      if(size){
        variantFilter.size = size
      }
      if (color) {
        variantFilter.color = color
      }



      const variant = await  ProductVariantModel.findOne(variantFilter).populate("media","secure_url").lean()
      if(!variant){
        return response(false, 404, "Product variant not found");
      }
      // get color and size

      const getColor = await ProductVariantModel.distinct("color", {product:getProduct._id});
      const getSize = await ProductVariantModel.aggregate([
        {$match:{product:getProduct._id}},
         {$sort:{_id:1}},
       {
        $group:{
          _id:"$size",
          first:{ $first:"$_id" }

        }
       },
       { $sort: { first: 1}},
       {
        $project: {
          _id: 0,
          size: "$_id"
        }
      }

        
      ])

      // get review 

    const review = await ReviewModel.countDocuments({product:getProduct._id})

    const productData ={
      product:getProduct,
      variant:variant,
      colors:getColor,
      sizes:getSize.length ? getSize.map(item => item.size) : [],
      reviewCount:review
    }
    return response(true, 200, "Product found", productData);
  } catch
  (error) {
    return catchError(error);
  }
}






