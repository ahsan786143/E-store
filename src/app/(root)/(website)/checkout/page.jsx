"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowRight,
  ShoppingBag,
  X,
  Tag,
  ChevronRight,
  CheckCircle,
  Package,
} from "lucide-react";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import WebsiteBreadcrumb from "@/components/website/WebsiteBreadcrumb";
import { showToast } from "@/lib/showToast";
import useFetch from "@/hooks/useFetch";
import { addIntoCart, clearCart } from "@/store/reducer/cartReducer";
import { WEBSITE_SHOP } from "@/app/routes/UserWebsite";
import { useRouter } from "next/navigation";

const breadcrumb = {
  title: "Checkout",
  links: [{ label: "Checkout", href: "/checkout" }],
};

const OrderFormSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  email: z.string().email("Enter a valid email"),
  phone: z.string().min(10, "Enter a valid phone number"),
  address: z.string().min(5, "Address is required"),
  city: z.string().min(2, "City is required"),
  postalCode: z.string().min(4, "Postal code is required"),
  country: z.string().min(2, "Country is required"),
  ordernote: z.string().optional(),
});

export default function BillingPage() {
  const cart = useSelector((store) => store.cartStore);
  const dispatch = useDispatch();
  const router = useRouter();

  const [couponCode, setCouponCode] = useState("");
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [isCouponApplied, setIsCouponApplied] = useState(false);
  const [couponLoading, setCouponLoading] = useState(false);
  const [orderLoading, setOrderLoading] = useState(false);
  const [placedOrder, setPlacedOrder] = useState(null);

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role !== "user") router.push("/auth/login");
  }, [router]);

  const { data: verifiedResponse } = useFetch(
    cart.products?.length ? "/api/cart-verification" : null,
    "POST",
    cart.products
  );

  useEffect(() => {
    if (verifiedResponse?.success) {
      dispatch(clearCart());
      verifiedResponse.data.forEach((item) => dispatch(addIntoCart(item)));
    }
  }, [verifiedResponse, dispatch]);

  const subtotal = cart.products.reduce(
    (sum, p) => sum + p.sellingPrice * p.qty,
    0
  );
  const discount = cart.products.reduce(
    (sum, p) => sum + ((p.mrp || p.sellingPrice) - p.sellingPrice) * p.qty,
    0
  );
  const total = Math.max(subtotal - couponDiscount, 0);

  const formatPKR = (amount) =>
    new Intl.NumberFormat("en-PK", {
      style: "currency",
      currency: "PKR",
      minimumFractionDigits: 0,
    }).format(amount);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(OrderFormSchema) });

  const onSubmit = async (data) => {
    try {
      setOrderLoading(true);
      const productsWithTotal = cart.products.map((p) => ({
        ...p,
        total: p.sellingPrice * p.qty,
      }));
      const response = await axios.post("/api/order", {
        ...data,
        products: productsWithTotal,
        subtotal,
        discount,
        couponDiscount,
        total,
      });
      if (!response.data.success) throw new Error(response.data.message);
      setPlacedOrder(response.data.data);
      dispatch(clearCart());
      setCouponDiscount(0);
      setIsCouponApplied(false);
      setCouponCode("");
    } catch (error) {
      showToast("error", error.response?.data?.message || error.message);
    } finally {
      setOrderLoading(false);
    }
  };

  const applyCoupon = async () => {
    if (!couponCode) {
      showToast("error", "Enter coupon code");
      return;
    }
    try {
      setCouponLoading(true);
      const { data } = await axios.post("/api/coupon/apply", {
        code: couponCode,
        minShoppingAmount: subtotal,
      });
      if (!data.success) throw new Error(data.message);
      const discountAmount = (subtotal * data.data.discountPercentage) / 100;
      setCouponDiscount(discountAmount);
      setIsCouponApplied(true);
      showToast("success", "Coupon applied!");
    } catch (error) {
      showToast("error", error.response?.data?.message || error.message);
    } finally {
      setCouponLoading(false);
    }
  };

  const removeCoupon = () => {
    setCouponDiscount(0);
    setCouponCode("");
    setIsCouponApplied(false);
  };

  /* SUCCESS SCREEN */
  if (placedOrder) {
    return (
      <div>
        <WebsiteBreadcrumb props={breadcrumb} />
        <div className="min-h-[70vh] flex items-center justify-center px-4 py-20">
          <div className="bg-white border ml-2 rounded-2xl shadow-sm p-10 max-w-md w-full text-center space-y-6">
            <div className="flex justify-center">
              <div className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center">
                <CheckCircle className="w-10 h-10 text-green-500" />
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Order Placed!</h2>
              <p className="text-gray-500 mt-1 text-sm">
                Thank you{" "}
                <span className="font-medium text-gray-700">{placedOrder.fullName}</span>, your order has been received.
              </p>
            </div>

            {/* ✅ FIXED: Order ID display with .toString() fallback */}
            <div className="bg-gray-50 border rounded-xl px-5 py-4 text-left space-y-1">
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Package size={13} />
                <span>Order ID</span>
              </div>
              <p className="font-mono text-sm font-semibold text-gray-800 break-all">
                #{placedOrder._id?.toString() || placedOrder.id}
              </p>
            </div>

            <div className="text-left border rounded-xl overflow-hidden">
              <div className="bg-gray-50 px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Summary
              </div>
              <div className="px-4 py-3 space-y-2 text-sm">
                {placedOrder.products?.map((p, i) => (
                  <div key={i} className="flex justify-between">
                    <span className="text-gray-600 truncate max-w-[60%]">
                      {p.name} × {p.qty}
                    </span>
                    <span className="font-medium">{formatPKR(p.total)}</span>
                  </div>
                ))}
                <div className="border-t pt-2 mt-2 space-y-1">
                  <div className="flex justify-between text-gray-500">
                    <span>Subtotal</span>
                    <span>{formatPKR(placedOrder.subtotal)}</span>
                  </div>
                  {placedOrder.discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount</span>
                      <span>-{formatPKR(placedOrder.discount)}</span>
                    </div>
                  )}
                  {placedOrder.couponDiscount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Coupon</span>
                      <span>-{formatPKR(placedOrder.couponDiscount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-bold text-base pt-1 border-t">
                    <span>Total</span>
                    <span>{formatPKR(placedOrder.total)}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <Button onClick={() => router.push("/orders")} className="w-full gap-2">
                View My Orders <ArrowRight size={16} />
              </Button>
              <Link href={WEBSITE_SHOP}>
                <Button variant="outline" className="w-full">
                  Continue Shopping
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* CHECKOUT PAGE */
  return (
    <div>
      <WebsiteBreadcrumb props={breadcrumb} />

      {cart.count === 0 ? (
        <div className="min-h-[60vh] flex flex-col items-center justify-center text-center mt-10 mb-10 px-4">
          <ShoppingBag className="w-12 h-12 text-gray-400 mb-4" />
          <h2 className="text-2xl font-semibold">Your Cart is Empty</h2>
          <p className="text-gray-500 mt-2">
            Looks like you haven't added anything yet.
          </p>
          <Link href={WEBSITE_SHOP}>
            <Button className="mt-6 gap-2">
              Continue Shopping <ArrowRight size={16} />
            </Button>
          </Link>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-8 my-10 lg:my-20 px-4 lg:px-32">

          {/* LEFT — BILLING FORM */}
          <div className="lg:flex-1 w-full">
            <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6 bg-white rounded-2xl shadow-sm">
              <h3 className="text-lg font-semibold border-b pb-3">Billing Information</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

                {/* Full Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    {...register("fullName")}
                    placeholder="Enter your full name"
                    className={`w-full border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black/10 transition ${errors.fullName ? "border-red-400" : "border-gray-300"}`}
                  />
                  {errors.fullName && <p className="text-xs text-red-500 mt-1">{errors.fullName.message}</p>}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    {...register("email")}
                    placeholder="Enter your email"
                    className={`w-full border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black/10 transition ${errors.email ? "border-red-400" : "border-gray-300"}`}
                  />
                  {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    {...register("phone")}
                    placeholder="03XX-XXXXXXX"
                    className={`w-full border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black/10 transition ${errors.phone ? "border-red-400" : "border-gray-300"}`}
                  />
                  {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone.message}</p>}
                </div>

                {/* Country */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Country <span className="text-red-500">*</span>
                  </label>
                  <input
                    {...register("country")}
                    placeholder="e.g. Pakistan"
                    className={`w-full border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black/10 transition ${errors.country ? "border-red-400" : "border-gray-300"}`}
                  />
                  {errors.country && <p className="text-xs text-red-500 mt-1">{errors.country.message}</p>}
                </div>

                {/* City */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City <span className="text-red-500">*</span>
                  </label>
                  <input
                    {...register("city")}
                    placeholder="e.g. Lahore"
                    className={`w-full border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black/10 transition ${errors.city ? "border-red-400" : "border-gray-300"}`}
                  />
                  {errors.city && <p className="text-xs text-red-500 mt-1">{errors.city.message}</p>}
                </div>

                {/* Postal Code */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Postal Code <span className="text-red-500">*</span>
                  </label>
                  <input
                    {...register("postalCode")}
                    placeholder="e.g. 54000"
                    className={`w-full border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black/10 transition ${errors.postalCode ? "border-red-400" : "border-gray-300"}`}
                  />
                  {errors.postalCode && <p className="text-xs text-red-500 mt-1">{errors.postalCode.message}</p>}
                </div>

                {/* Address */}
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Street Address <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    {...register("address")}
                    placeholder="House #, Street, Area"
                    rows={2}
                    className={`w-full border rounded-lg px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-black/10 transition ${errors.address ? "border-red-400" : "border-gray-300"}`}
                  />
                  {errors.address && <p className="text-xs text-red-500 mt-1">{errors.address.message}</p>}
                </div>

                {/* Order Note */}
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Order Note
                  </label>
                  <textarea
                    {...register("ordernote")}
                    placeholder="Any special instructions (optional)"
                    rows={2}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-black/10 transition"
                  />
                </div>

              </div>

              <Button disabled={orderLoading} type="submit" className="w-full h-12 gap-2 text-base">
                {orderLoading ? "Placing Order..." : "Place Order"} <ChevronRight size={18} />
              </Button>
            </form>
          </div>

          {/* RIGHT — ORDER SUMMARY */}
          <div className="lg:w-[360px] w-full mt-8 lg:mt-0">
            <div className="rounded-2xl bg-white border p-5 sticky top-5 space-y-5">
              <h4 className="text-lg font-semibold">Order Summary</h4>

              <div className="space-y-4 max-h-64 overflow-y-auto pr-1">
                {cart.products.map((product) => (
                  <div key={product.variantId} className="flex items-start gap-3">
                    <img src={product.media || "/placeholder.png"} alt={product.name} className="w-16 h-16 object-cover rounded-lg border" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{product.name}</p>
                      <div className="flex gap-2 mt-1 text-xs text-gray-500">
                        {product.size && <span className="border px-2 py-0.5 rounded">Size: {product.size}</span>}
                        {product.color && <span className="border px-2 py-0.5 rounded">Color: {product.color}</span>}
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {product.qty} × {formatPKR(product.sellingPrice)}
                      </p>
                    </div>
                    <p className="text-sm font-semibold">{formatPKR(product.qty * product.sellingPrice)}</p>
                  </div>
                ))}
              </div>

              {/* Coupon */}
              <div className="border-t pt-4">
                <h4 className="flex items-center gap-2 mb-3 text-sm font-medium text-gray-700">
                  <Tag size={14} /> Coupon Code
                </h4>
                {!isCouponApplied ? (
                  <div className="flex gap-2">
                    <input
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                      placeholder="Enter coupon code"
                      className="flex-1 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black/10 bg-white"
                    />
                    <Button type="button" onClick={applyCoupon} disabled={couponLoading} size="sm">
                      {couponLoading ? "..." : "Apply"}
                    </Button>
                  </div>
                ) : (
                  <div className="flex justify-between items-center bg-green-50 border border-green-200 px-4 py-3 rounded-lg">
                    <span className="text-green-700 text-sm font-medium">
                      ✓ {couponCode} — {formatPKR(couponDiscount)} off
                    </span>
                    <button onClick={removeCoupon} className="text-gray-500 hover:text-red-500 transition">
                      <X size={16} />
                    </button>
                  </div>
                )}
              </div>

              {/* Price Breakdown */}
              <div className="border-t pt-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span>{formatPKR(subtotal)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>-{formatPKR(discount)}</span>
                  </div>
                )}
                {couponDiscount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Coupon ({couponCode})</span>
                    <span>-{formatPKR(couponDiscount)}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-base border-t pt-3">
                  <span>Total</span>
                  <span>{formatPKR(total)}</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}