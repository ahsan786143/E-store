import Category from "@/app/(root)/(admin)/admin/category/page";
import connectToDatabase from "@/lib/db";
import { catchError } from "@/lib/helperFunction";
import ProductModel from "@/models/ProductModel";
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
        { name: { $regex: globalFilter, $options: "i" } },
        { slug: { $regex: globalFilter, $options: "i" } },
        {"categoryData.name": { $regex: globalFilter, $options: "i" }},
        {
          $expr: {
            $regexMatch:{
              input:{$toString:"$mrp"},
              regex:globalFilter,
              options:"i"
            }

          }
        },
        {
          $expr: {
            $regexMatch:{
              input:{$toString:"$sellingPrice"},
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
      matchQuery[f.id] = { $regex: f.value, $options: "i" };
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
      {
        $lookup: {
          from: "categories",
          localField: "category",
          foreignField: "_id",
          as: "categoryData",
        },
      },
      {
        $unwind:{
          path: "$categoryData",
          preserveNullAndEmptyArrays: true
        }
      },
      { $match: matchQuery },
      { $sort: Object.keys(sortQuery).length ? sortQuery : { createdAt: -1 } },
      { $skip: start },
      { $limit: size },
      {
        $project: {
          id: "$_id", // Needed for MRT getRowId
          name: 1,
          slug: 1,
          mrp: 1,
          sellingPrice: 1,
          discountPercentage: 1,
          category: "$categoryData.name",
          deletedAt: 1,
          createdAt: 1,
          updatedAt: 1,
        },
      },
    ];

    const getProduct = await ProductModel.aggregate(pipeline);
    const totalRowCount = await ProductModel.countDocuments(matchQuery);

    return NextResponse.json({
      success: true,
      data: getProduct,
      meta: { totalRowCount },
    });
  } catch (error) {
    return catchError(error);
  }
}
