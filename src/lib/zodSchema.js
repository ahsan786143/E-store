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
color: z
  .string()
  .min(3, "Color is required")
  .transform((val) => {
    const trimmed = val.trim().toLowerCase();
    return trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
  }),  size:z.string().min(1, "Size is required"),
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
  validity:z.coerce.date(),

  userId:z.string().min(3, "User Id is required"),
  rating: z.union([ 
    z.number().positive("Expected positive Value, received negative"),
    z.string().transform((val)=> Number(val)).refine((val)=>!isNaN(val )&& val>= 0, "Please enter a valid number"),
  ]),
  review:z.string().min(3, "Review is required"),
  code:z.string().min(3, "Coupon is required"),
   phone: z
    .string()
    .min(1, "Phone is required")
    .transform((val) => val.replace(/\s|-/g, ""))
    .refine((val) => /^(?:\+92|0)3\d{9}$/.test(val), {
      message: "Invalid Pakistani phone number",
    }),
    address: z
    .string()
    .trim()
    .min(5, "Address must be at least 5 characters")
    .max(200, "Address too long"),

  city: z
    .string()
    .trim()
    .min(2, "City is required")
    .max(50, "City too long")
    .refine((val) => /^[a-zA-Z\s'-]+$/.test(val), {
      message: "City must contain only letters",
    }),

  postalCode: z
    .string()
    .trim()
    .refine((val) => /^\d{5}$/.test(val), {
      message: "Postal code must be 5 digits",
    }),

  country: z
    .string()
    .trim()
    .min(2, "Country is required")
    .max(56, "Country name too long"),
    userId: z.string().optional(), // optional for guest checkout

  products: z
    .array(
      z.object({
        variantId: z.string(),
        name: z.string(),
        sellingPrice: z.number(),
        mrp: z.number().optional(),
        qty: z.number().int().positive(),
        media: z.string().optional(),
        color: z.string().optional(),
        size: z.string().optional(),
      })
    )
    .min(1, "Cart cannot be empty"),

  subtotal: z.number().min(0),
  discount: z.number().min(0),
  couponDiscount: z.number().min(0),
  total: z.number().min(0),
  fullName: z
    .string()
    .min(3, "Full name must be at least 3 characters"),

    ordernote: z.string().optional(),
})



.refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});
