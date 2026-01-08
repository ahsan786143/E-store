import connectToDatabase from "@/lib/db";
import { catchError } from "@/lib/helperFunction";
import { NextResponse } from "next/server";
import ReviewModel from "@/models/ReviewModel";


export async function GET(request) {
  try {
    await connectToDatabase();
    const searchParams = request.nextUrl.searchParams;

    // --- Pagination ---
    const start = parseInt(searchParams.get("start") || "0", 10);
    const size = parseInt(searchParams.get("size") || "10", 10);

    // --- Filters ---
    const filter = JSON.parse(searchParams.get("filter") || "[]"); // MUST be array
    const globalFilter = searchParams.get("globalFilter") || ""; // SHOULD NOT be JSON
    const sorting = JSON.parse(searchParams.get("sorting") || "[]"); // MUST be array

    const deleteType = searchParams.get("deleteType");

    // ---------------------------------------------------
    // Build match query
    // ---------------------------------------------------
    let matchQuery = {};

    if (deleteType === "SD") {
      matchQuery = { deletedAt: null };
    } else if (deleteType === "PD") {
      matchQuery = { deletedAt: { $ne: null } };
    }

    // --- Global Search ---
    if (globalFilter.trim() !== "") {
      matchQuery.$or = [
        { "productData.title": { $regex: globalFilter, $options: "i" } },
        { "userData.name": { $regex: globalFilter, $options: "i" } },
        { rating: { $regex: globalFilter, $options: "i" } },
        { title: { $regex: globalFilter, $options: "i" } },
        { review: { $regex: globalFilter, $options: "i" } },
        
      ];
    }
    
    // --- Column Filtering ---
    filter.forEach((f) => {
      if(filter.id ==="product"){
        matchQuery["productData.name"] = { $regex: f.value, $options: "i" }
      }else if(filter.id ==="user"){
        matchQuery["userData.name"] = { $regex: f.value, $options: "i" }
      }
      
      else{
        matchQuery[f.id] = { $regex: f.value, $options: "i" }
      }

      
      if (f.id === "validity") {
        matchQuery[f.id] = new Date(f.value);
      };
    });

    // --- Sorting ---
    const sortQuery = {};
    sorting.forEach((s) => {
      sortQuery[s.id] = s.desc ? -1 : 1;
    });

    // ---------------------------------------------------
    // Aggregate Pipeline
    // --------------------------------------------------
    const pipeline = [

      // lookup for product
      {
        $lookup: {
          from: "products",
          localField: "product",
          foreignField: "_id",
          as: "productData",
        },
      },
      {
        $unwind: {
          path: "$productData",
          preserveNullAndEmptyArrays: true,
        },
      },
      // lookup for user
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "userData",
        },
      },
      {
        $unwind: {
          path: "$userData",
          preserveNullAndEmptyArrays: true,
        },
      },

      { $match: matchQuery },
      { $sort: Object.keys(sortQuery).length ? sortQuery : { createdAt: -1 } },
      { $skip: start },
      { $limit: size },
      {
        $project: {
          id: "$_id", // Needed for MRT getRowId
          product:"$productData.name", 
          user:"$userData.name",
          rating: 1,
          title: 1,
          review: 1,
          deletedAt: 1,
          createdAt: 1,
          updatedAt: 1,
        },
      },
    ];

    const getReview = await ReviewModel.aggregate(pipeline);
    const totalRowCount = await ReviewModel.countDocuments(matchQuery);

    return NextResponse.json({
      success: true,
      data: getReview,
      meta: { totalRowCount },
    });
  } catch (error) {
    return catchError(error);
  }
}
