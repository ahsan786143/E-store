import Category from "@/app/(root)/(admin)/admin/category/page";
import connectToDatabase from "@/lib/db";
import { catchError } from "@/lib/helperFunction";
import CouponModel from "@/models/CouponModel";
import { NextResponse } from "next/server";

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
        { code: { $regex: globalFilter, $options: "i" } },
        
        {
          $expr: {
            $regexMatch:{
              input:{$toString:"$minShoppingAmount"},
              regex:globalFilter,
              options:"i"
            }

          }
        },
        {
          $expr: {
            $regexMatch:{
              input:{$toString:"$discountPercentage"},
              regex:globalFilter,
              options:"i"
            }

          }
        },
      ];
    }

    // --- Column Filtering ---
    filter.forEach((f) => {
      matchQuery[f.id] = { $regex: f.value, $options: "i" }
      
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
    // ---------------------------------------------------
    const pipeline = [
      
      { $match: matchQuery },
      { $sort: Object.keys(sortQuery).length ? sortQuery : { createdAt: -1 } },
      { $skip: start },
      { $limit: size },
      {
        $project: {
          id: "$_id", // Needed for MRT getRowId
          name: 1,
          code: 1,
          minShoppingAmount: 1,
          discountPercentage: 1,
          validity: 1,
          deletedAt: 1,
          createdAt: 1,
          updatedAt: 1,
        },
      },
    ];

    const getCoupon = await CouponModel.aggregate(pipeline);
    const totalRowCount = await CouponModel.countDocuments(matchQuery);

    return NextResponse.json({
      success: true,
      data: getCoupon,
      meta: { totalRowCount },
    });
  } catch (error) {
    return catchError(error);
  }
}
