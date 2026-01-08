import connectToDatabase from "@/lib/db";
import { catchError } from "@/lib/helperFunction";
import { NextResponse } from "next/server";
import UserModel from "@/models/UserSignUp";


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
        { role: { $regex: globalFilter, $options: "i" } },
        { email: { $regex: globalFilter, $options: "i" } },
        { phone: { $regex: globalFilter, $options: "i" } },
        { address: { $regex: globalFilter, $options: "i" } },
        { isEmailVerified: { $regex: globalFilter, $options: "i" } },
        
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
          role: 1,
          phone: 1,
          email: 1,
          address: 1,
          isEmailVerified: 1,
          avatar: 1,
          deletedAt: 1,
          createdAt: 1,
          updatedAt: 1,
        },
      },
    ];

    const getCustomer = await UserModel.aggregate(pipeline);
    const totalRowCount = await UserModel.countDocuments(matchQuery);

    return NextResponse.json({
      success: true,
      data: getCustomer,
      meta: { totalRowCount },
    });
  } catch (error) {
    return catchError(error);
  }
}
