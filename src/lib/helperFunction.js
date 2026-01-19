//  help for the NextRespones
import { jwtVerify } from "jose";
import { NextResponse } from "next/server"



export const response= (success, statusCode, message, data={}) => {
  return NextResponse.json({
    success,
    statusCode,
    message,
    data
  })
}

export const catchError = (error, customMessage) => {
  // Handle duplicate key error
 if (error.code === 11000) {
  const keys = Object.keys(error.keyPattern);

  if (keys.includes("product") && keys.includes("size")) {
    error.message = "This size already exists for the selected product.";
  } else {
    error.message = `Duplicate field(s): ${keys.join(", ")}. These fields must be unique.`;
  }
}


  // Default error object
  let errorObj = {};

  if (process.env.NODE_ENV === "development") {
    errorObj = {
      message: error.message,
       error
    };
  } else {
    errorObj = {
      message: customMessage || "Internal Server Error",
    };
  }
   return response(false, error.code || 500, errorObj.message, errorObj.error);
};


export const generateOTP =()=>{
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  return otp
}

// export const isAuthenticated = async (role) => {
//   try {
//     const cookieStore = await cookies(); // Note: cookies() is async in newer Next.js versions
//     const access_token = cookieStore.get("access_token");

//     if (!access_token?.value) {
//       return { isAuth: false };
//     }

//     const secret = new TextEncoder().encode(process.env.SECRET_KEY);
//     const { payload } = await jwtVerify(access_token.value, secret);

//     if (role && payload.role !== role) {
//       return { isAuth: false };
//     }

//     return {
//       isAuth: true,
//       userId: payload._id,
//       role: payload.role,
//     };
//   } catch (error) {
//     console.error("Auth Error:", error.message);
//     return { isAuth: false };
//   }
// };
export const columnConfig = (column, isCreatedAt = false, isUpdatedAt = false, isDeletedAt = false) => {
  const newColumn = [...column];

  if (isCreatedAt) {
    newColumn.push({
      accessorKey: "createdAt",
      header: "Created At",
      Cell: ({ renderedCellValue }) =>
        new Date(renderedCellValue).toLocaleString(),
    });
  }

  if (isUpdatedAt) {
    newColumn.push({
      accessorKey: "updatedAt",
      header: "Updated At",
      Cell: ({ renderedCellValue }) =>
        new Date(renderedCellValue).toLocaleString(),
    });
  }

  if (isDeletedAt) {
    newColumn.push({
      accessorKey: "deletedAt",
      header: "Deleted At",
      Cell: ({ renderedCellValue }) =>
        new Date(renderedCellValue).toLocaleString(),
    });
  }

  return newColumn;
};
