import Category from "@/app/(root)/(admin)/admin/category/page";
import connectToDatabase from "@/lib/db";
import { catchError } from "@/lib/helperFunction";
import ProductVariantModel from "@/models/ProductVariantModel";
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
        { color: { $regex: globalFilter, $options: "i" } },
        { size: { $regex: globalFilter, $options: "i" } },
        { sku: { $regex: globalFilter, $options: "i" } },
        {"productData.name": { $regex: globalFilter, $options: "i" }},
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
    }) 

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
          from: "products",
          localField: "product",
          foreignField: "_id",
          as: "productData",
        },
      },
      {
        $unwind:{
          path: "$productData",
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
          product: "$productData.name",
          color: 1,
          size: 1,
          sku: 1,
          mrp: 1,
          sellingPrice: 1,
          discountPercentage: 1,
          deletedAt: 1,
          createdAt: 1,
          updatedAt: 1,
        },
      },
    ];

    const getproductvariant = await ProductVariantModel.aggregate(pipeline);
    const totalRowCount = await ProductVariantModel.countDocuments(matchQuery);

    return NextResponse.json({
      success: true,
      data: getproductvariant,
      meta: { totalRowCount },
    });
  } catch (error) {
    return catchError(error);
  }
}
