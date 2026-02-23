"use client";
import Image from "next/image";
import WebsiteBreadcrumb from "@/components/website/WebsiteBreadcrumb";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { ArrowRight, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WEBSITE_SHOP } from "@/app/routes/UserWebsite";
import Link from "next/link";
import { showToast } from "@/lib/showToast";

const breadcrumb = {
  title: "Checkout",
  links: [{ label: "Checkout", href: "/checkout" }],
};

const BillingPage = () => {
  const cart = useSelector((store) => store.cartStore);

  const [subtotal, setSubtotal] = useState(0);
  const [discount, setDiscount] = useState(0);

  const [billingInfo, setBillingInfo] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    country: "",
    postalCode: "",
  });

  const [couponCode, setCouponCode] = useState("");
  const [couponDiscount, setCouponDiscount] = useState(0);

  const handleChange = (e) => {
    setBillingInfo({ ...billingInfo, [e.target.name]: e.target.value });
  };

  const formatPKR = (amount) =>
    new Intl.NumberFormat("en-PK", {
      style: "currency",
      currency: "PKR",
      minimumFractionDigits: 0,
    }).format(amount);

  // Calculate pricing safely
  useEffect(() => {
    const cartProducts = cart.products || [];

    const totalAmount = cartProducts.reduce(
      (sum, product) => sum + product.sellingPrice * product.qty,
      0,
    );

    const totalDiscount = cartProducts.reduce(
      (sum, product) =>
        sum +
        ((product.mrp || product.sellingPrice) - product.sellingPrice) *
          product.qty,
      0,
    );

    setSubtotal(totalAmount);
    setDiscount(totalDiscount);
  }, [cart.products]);

  const total = subtotal - discount - couponDiscount;
  const finalTotal = Math.max(total, 0);

  const applyCoupon = () => {
    if (!couponCode.trim()) {
      showToast("Enter a coupon code");
      return;
    }

    if (couponCode.toLowerCase() === "save10") {
      const discountValue = subtotal * 0.1;
      setCouponDiscount(discountValue);
      showToast("Coupon applied: 10% OFF");
    } else if (couponCode.toLowerCase() === "flat500") {
      setCouponDiscount(500);
      showToast("Coupon applied: PKR 500 OFF");
    } else {
      setCouponDiscount(0);
      showToast("Invalid coupon");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Billing Info:", billingInfo);
    showToast("Billing info submitted (Integrate payment)");
  };

  return (
    <div className="container mx-auto px-4 md:px-6 py-8">
      <WebsiteBreadcrumb props={breadcrumb} />

      {cart.count === 0 ? (
        <div className="flex flex-col items-center justify-center bg-white rounded-2xl shadow-sm border border-gray-100 py-16 px-6 text-center">
          <div className="bg-red-50 rounded-full p-6 mb-6">
            <ShoppingBag className="w-12 h-12 text-red-400" />
          </div>

          <h4 className="text-2xl font-bold text-gray-800 mb-2">
            Your Cart is Empty
          </h4>

          <p className="text-sm text-gray-500 mb-6">
            Explore our store and find something you love!
          </p>

          <Image
            src="/assets/images/cartempty.png"
            alt="Empty Cart"
            width={140}
            height={140}
            className="opacity-70 mb-6"
          />

          <Button asChild className="bg-red-500 hover:bg-red-600 text-white">
            <Link href={WEBSITE_SHOP}>
              Continue Shopping
              <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </Button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-8">
          {/* Billing Form */}
          <div className="bg-white rounded-xl shadow-sm border p-6 mt-10">
            <h3 className="text-xl font-semibold mb-6">Billing Information</h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              {[
                { name: "fullName", placeholder: "Full Name", type: "text" },
                { name: "email", placeholder: "Email Address", type: "email" },
                { name: "phone", placeholder: "Phone Number", type: "tel" },
                { name: "address", placeholder: "Address", type: "text" },
              ].map((field) => (
                <input
                  key={field.name}
                  type={field.type}
                  name={field.name}
                  placeholder={field.placeholder}
                  value={billingInfo[field.name]}
                  onChange={handleChange}
                  required
                  className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-red-500 mb-1 mt-5"
                />
              ))}

              <div className="flex gap-4">
                <input
                  type="text"
                  name="city"
                  placeholder="City"
                  value={billingInfo.city}
                  onChange={handleChange}
                  required
                  className="flex-1 border p-3 rounded-lg focus:ring-2 focus:ring-red-500 mb-3 mt-4"
                />

                <input
                  type="text"
                  name="postalCode"
                  placeholder="Postal Code"
                  value={billingInfo.postalCode}
                  onChange={handleChange}
                  required
                  className="w-32 border p-3 rounded-lg focus:ring-2 focus:ring-red-500 mb-3 mt-4"
                />
              </div>

              <input
                type="text"
                name="country"
                placeholder="Country"
                value={billingInfo.country}
                onChange={handleChange}
                required
                className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-red-500 mb-3"
              />

              <Button
                type="submit"
                className="w-full mt-6 bg-primary text-white py-3 rounded-lg font-medium hover:opacity-90 transition cursor-pointer"
              >
                Submit Billing Info
              </Button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-xl shadow-sm border p-6 mt-10">
            <h3 className="text-xl font-semibold mb-6">Order Summary</h3>

            <div className="divide-y max-h-[400px] overflow-y-auto">
              {(cart.products || []).map((product) => (
                <div
                  key={product.variantId}
                  className="flex justify-between py-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="relative w-16 h-16 rounded-lg overflow-hidden border">
                      <Image
                        src={
                          product.media || "/assets/images/img-placeholder.webp"
                        }
                        fill
                        alt={product.name}
                        className="object-cover"
                      />
                    </div>

                    <div>
                      <div className="text-sm font-semibold">
                        {product.name}
                      </div>

                      <div className="text-xs text-gray-400">
                        {product.color && `Color: ${product.color}`}
                        {product.size && ` • Size: ${product.size}`}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-xs text-gray-500">
                      {product.qty} × {formatPKR(product.sellingPrice)}
                    </div>
                    <div className="text-sm font-bold">
                      {formatPKR(product.sellingPrice * product.qty)}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pricing */}
            <div className="mt-6 space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatPKR(subtotal)}</span>
              </div>

              <div className="flex justify-between text-green-600">
                <span>Discount</span>
                <span>- {formatPKR(discount)}</span>
              </div>

              <div className="flex justify-between text-green-600">
                <span>Coupon Discount</span>
                <span>- {formatPKR(couponDiscount)}</span>
              </div>
            </div>

            <div className="border-t my-4" />

            <div className="flex justify-between text-lg font-semibold">
              <span>Total</span>
              <span>{formatPKR(finalTotal)}</span>
            </div>

            {/* Coupon */}
            <div className="mt-6">
              <label className="text-sm font-medium block mb-2">
                Apply Coupon
              </label>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  placeholder="Enter coupon code"
                  className="flex-1 border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-black"
                />

                <button
                  type="button"
                  onClick={applyCoupon}
                  className="px-4 py-2 bg-primary text-white text-sm rounded-lg cursor-pointer hover:opacity-90 transition"
                >
                  Apply
                </button>
              </div>
            </div>

            {/* Continue */}
            <button className="w-full mt-6 bg-primary text-white py-3 rounded-lg font-medium hover:opacity-90 transition cursor-pointer">
              Continue
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BillingPage;
