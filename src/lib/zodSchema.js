import { z } from "zod";

export const zSchema = z.object({
  name: z.string()
    .nonempty({ message: "Name is required" })
    .min(3, { message: "Name must be at least 3 characters long" }),

  email: z.string()
    .nonempty({ message: "Email is required" })
    .email({ message: "Please enter a valid email address" })
    .regex(/^[a-zA-Z0-9._%+-]+@gmail\.com$/, {
      message: "Only gmail.com addresses are allowed",
    }),

  password: z.string()
    .nonempty({ message: "Password is required" })
    .min(8, { message: "Password must be at least 8 characters long" })
    .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
    .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
    .regex(/\d/, { message: "Password must contain at least one number" })
    .regex(/[^A-Za-z0-9]/, {
      message: "Password must contain at least one special character",
    }),

  confirmPassword: z.string().nonempty({ message: "Please confirm your password" }),

  otp: z.string().regex(/^\d{6}$/, { message: "OTP must be 6 digits" }),

  // MEDIA FIELDS
  _id: z.string().min(3, "ID is required"),
  alt: z.string().min(3, "Alt is required"),
  title: z.string().min(3, "Title is required"),
  slug: z.string().min(3, "Slug is required"),

  category: z.string().min(3, "Category is required"),
  mrp: z.union([ 
    z.number().positive("Expected positive Value, received negative"),
    z.string().transform((val)=> Number(val)).refine((val)=>!isNaN(val )&& val>= 0, "Please enter a valid number"),

  ]),
  sellingPrice: z.union([ 
    z.number().positive("Expected positive Value, received negative"),
    z.string().transform((val)=> Number(val)).refine((val)=>!isNaN(val )&& val>= 0, "Please enter a valid number"),

  ]),
  discountPercentage: z.union([ 
    z.number().positive("Expected positive Value, received negative"),
    z.string().transform((val)=> Number(val)).refine((val)=>!isNaN(val )&& val>= 0, "Please enter a valid number"),

  ]),
  description: z.string().min(3, "Description is required"),
  media:z.array(z.string()),
  product:z.string().min(3, "Product is required"),
  color:z.string().min(3, "Color is required"),
  size:z.string().min(1, "Size is required"),
  sku:z.string().min(3, "Sku is required"),
  code:z.string().min(3, "Code is required"),
  discountPercentage: z.union([ 
    z.number().positive("Expected positive Value, received negative"),
    z.string().transform((val)=> Number(val)).refine((val)=>!isNaN(val )&& val>= 0, "Please enter a valid number"),
  ]),
  minShoppingAmount: z.union([ 
    z.number().positive("Expected positive Value, received negative"),
    z.string().transform((val)=> Number(val)).refine((val)=>!isNaN(val )&& val>= 0, "Please enter a valid number"),
  ]),
  validity:z.coerce.date()

})
.refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});
