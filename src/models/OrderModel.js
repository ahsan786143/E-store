// models/Order.js
// ──────────────────────────────────────
// Mongoose schema for Order

import mongoose from "mongoose";

const ProductItemSchema = new mongoose.Schema(
  {
    productId:    { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    variantId:    { type: String },
    name:         { type: String, required: true },
    media:        { type: String },
    qty:          { type: Number, required: true, min: 1 },
    sellingPrice: { type: Number, required: true },
    mrp:          { type: Number },
    total:        { type: Number, required: true },
  },
  { _id: false }
);

const OrderSchema = new mongoose.Schema(
  {
    /* ── Customer Info ── */
    userId:     { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    fullName:   { type: String, required: true, trim: true },
    email:      { type: String, required: true, trim: true, lowercase: true },
    phone:      { type: String, required: true, trim: true },

    /* ── Shipping Address ── */
    address:    { type: String, required: true },
    city:       { type: String, required: true },
    postalCode: { type: String, required: true },
    country:    { type: String, required: true },
    ordernote:  { type: String, default: "" },

    /* ── Order Items ── */
    products:   { type: [ProductItemSchema], required: true },

    /* ── Pricing ── */
    subtotal:       { type: Number, required: true },
    discount:       { type: Number, default: 0 },
    couponDiscount: { type: Number, default: 0 },
    total:          { type: Number, required: true },

    /* ── Status ── */
    status: {
      type: String,
      enum: ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"],
      default: "pending",
    },

    /* ── Payment ── */
    paymentMethod: { type: String, default: "COD" },
    isPaid:        { type: Boolean, default: false },
  },
  {
    timestamps: true, // createdAt & updatedAt auto add hoga
  }
);

// ✅ toJSON override: _id ko automatically string mein convert karo
// Yeh ensure karta hai ke API response mein _id hamesha plain string ho
OrderSchema.set("toJSON", {
  virtuals: true,
  transform: (doc, ret) => {
    ret._id = ret._id?.toString();   // ObjectId → string
    delete ret.__v;                  // __v (version key) remove karo
    return ret;
  },
});

const Order = mongoose.models.Order || mongoose.model("Order", OrderSchema);

export default Order;