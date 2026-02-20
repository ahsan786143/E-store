"use client";
import Image from "next/image";
import WebsiteBreadcrumb from "@/components/website/WebsiteBreadcrumb";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { ArrowRight, ShoppingBag, Trash2, Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WEBSITE_SHOP } from "@/app/routes/UserWebsite";
import Link from "next/link";

const breadcrumb = {
  title: "Checkout",
  links: [{ label: "Checkout", href: "/checkout" }],
};

const BillingPage = () => {
  const cart = useSelector((store) => store.cartStore);

  const [billingInfo, setBillingInfo] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    country: "",
    postalCode: "",
  });

  const handleChange = (e) => {
    setBillingInfo({ ...billingInfo, [e.target.name]: e.target.value });
  };

  const formatPKR = (amount) =>
    new Intl.NumberFormat("en-PK", {
      style: "currency",
      currency: "PKR",
      minimumFractionDigits: 0,
    }).format(amount);

  const cartTotal = cart.products.reduce(
    (acc, item) => acc + item.sellingPrice * item.qty,
    0
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    // Submit billing info + cart for payment
    console.log("Billing Info:", billingInfo);
    alert("Billing info submitted! (Implement payment integration)");
  };

  return (
    <div className="container mx-auto px-4 md:px-6 py-8">
      <WebsiteBreadcrumb props={breadcrumb} />

      {cart.count === 0 ? (
        <div className="flex flex-col items-center justify-center bg-white rounded-2xl shadow-sm border border-gray-100 py-16 md:py-24 px-6 text-center ">
          <div className="bg-red-50 rounded-full p-6 mb-6">
            <ShoppingBag className="w-12 h-12 md:w-14 md:h-14 text-red-400" />
          </div>
          <h4 className="text-xl md:text-3xl font-bold text-gray-800 mb-2">
            Your Cart is Empty
          </h4>
          <p className="text-sm text-gray-500 mb-7">
            Explore our store and find something you love!
          </p>
          <Image
            src="/assets/images/cartempty.png"
            alt="Empty Cart"
            width={140}
            height={140}
            className="opacity-70 mb-7"
          />
          <Button
            asChild
            className="bg-red-500 hover:bg-red-600 text-white px-6 py-2.5 rounded-xl"
          >
            <Link href={WEBSITE_SHOP}>
              Continue Shopping
              <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </Button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-8">
          {/* Billing Form */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-xl font-semibold mb-6">Billing Information</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                name="fullName"
                placeholder="Full Name"
                value={billingInfo.fullName}
                onChange={handleChange}
                required
                className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              />
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={billingInfo.email}
                onChange={handleChange}
                required
                className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              />
              <input
                type="tel"
                name="phone"
                placeholder="Phone Number"
                value={billingInfo.phone}
                onChange={handleChange}
                required
                className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              />
              <input
                type="text"
                name="address"
                placeholder="Address"
                value={billingInfo.address}
                onChange={handleChange}
                required
                className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              />
              <div className="flex gap-4">
                <input
                  type="text"
                  name="city"
                  placeholder="City"
                  value={billingInfo.city}
                  onChange={handleChange}
                  required
                  className="flex-1 border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                />
                <input
                  type="text"
                  name="postalCode"
                  placeholder="Postal Code"
                  value={billingInfo.postalCode}
                  onChange={handleChange}
                  required
                  className="w-32 border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
              <input
                type="text"
                name="country"
                placeholder="Country"
                value={billingInfo.country}
                onChange={handleChange}
                required
                className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              />
              <Button
                type="submit"
                className="w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded-xl font-semibold"
              >
                Submit Billing Info
              </Button>
            </form>
          </div>

          {/* Cart Summary */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-xl font-semibold mb-6">Order Summary</h3>
            <div className="divide-y max-h-[500px] overflow-y-auto">
              {cart.products.map((product) => (
                <div key={product.variantId} className="flex justify-between py-4">
                  <div className="flex items-center gap-3">
                    <div className="relative w-16 h-16 rounded-lg overflow-hidden border">
                      <Image
                        src={product.media || "/assets/images/img-placeholder.webp"}
                        fill
                        alt={product.name}
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <div className="text-sm font-semibold">{product.name}</div>
                      <div className="text-xs text-gray-400">
                        {product.color && `Color: ${product.color}`}
                        {product.size && ` • Size: ${product.size}`}
                      </div>
                    </div>
                  </div>
                  <div className="text-sm font-bold">{formatPKR(product.sellingPrice * product.qty)}</div>
                </div>
              ))}
            </div>
            <div className="mt-6 text-lg font-semibold flex justify-between">
              <span>Total:</span>
              <span>{formatPKR(cartTotal)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BillingPage;