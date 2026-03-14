// Authentication 
import { cookies } from "next/headers";
import { jwtVerify } from "jose";

export const isAuthenticated = async (role) => {
  try {
   const cookieStore = await cookies();
    
    // 👇 Add these debug lines
    const allCookies = cookieStore.getAll();
    console.log("All cookies:", allCookies);
    
    const access_token = cookieStore.get("access_token");
    console.log("access_token cookie:", access_token);


    if (!access_token?.value) {
      return { isAuth: false };
    }

    // ✅ Use access_token.value, NOT a separate 'token' variable
    const secret = new TextEncoder().encode(process.env.SECRET_KEY);
    const { payload } = await jwtVerify(access_token.value, secret);

    if (role && payload.role !== role) {
      return { isAuth: false };
    }

    return {
      isAuth: true,
      userId: payload._id,
      role: payload.role,
    };
  } catch (error) {
    console.error("Auth Error:", error.message);
    return { isAuth: false };
  }
};s