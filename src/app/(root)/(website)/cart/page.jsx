"use client";
import {
  WEBSITE_CART,
  WEBSITE_CHECKOUT,
  WEBSITE_PRODUCT_DETAILS,
  WEBSITE_SHOP,
} from "@/app/routes/UserWebsite";
import { Button } from "@/components/ui/button";
import WebsiteBreadcrumb from "@/components/website/WebsiteBreadcrumb";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShoppingBag,
  Sparkles,
} from "lucide-react";
import {
  descreaseQuantity,
  increaseQuantity,
  removeFromCart,
} from "@/store/reducer/cartReducer";
import { HiMinus, HiPlus } from "react-icons/hi";
import { BsCart2 } from "react-icons/bs";
import { useRouter } from "next/navigation";

const breadcrumb = {
  title: "Cart",
  links: [{ label: "Cart", href: WEBSITE_CART }],
};

const formatPKR = (amount) =>
  amount.toLocaleString("en-PK", { style: "currency", currency: "PKR" });

const CartPage = () => {
  const dispatch = useDispatch();
  const cart = useSelector((store) => store.cartStore);
  const router = useRouter();

  const cartTotal =
    cart?.products?.reduce((sum, p) => sum + p.sellingPrice * p.qty, 0) ?? 0;

  const handleIncrease = (product) => {
    dispatch(
      increaseQuantity({
        productId: product.productId,
        variantId: product.variantId,
      }),
    );
  };

  const handleDecrease = (product) => {
    if (product.qty <= 1) return;
    dispatch(
      descreaseQuantity({
        productId: product.productId,
        variantId: product.variantId,
      }),
    );
  };

  const handleRemove = (product) => {
    dispatch(
      removeFromCart({
        productId: product.productId,
        variantId: product.variantId,
      }),
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <WebsiteBreadcrumb props={breadcrumb} />

      {/* Header */}
      <div className="relative mb-6 md:mb-10 px-4 md:px-0">
        <div className="absolute inset-0 bg-gradient-to-r from-red-50 to-orange-50 rounded-2xl z-10 " />

        <div className="flex items-center justify-between p-4 md:px-6 md:py-5 rounded-2xl border border-red-100 shadow-sm bg-white">
          <div className="flex items-center gap-3 md:gap-4">
            <div className="relative">
              <div className="absolute inset-0 bg-red-400 rounded-xl blur-md opacity-30" />
              <div className="relative bg-gradient-to-br from-red-500 to-orange-500 p-2.5 md:p-3 rounded-xl shadow-md">
                <ShoppingCart className="w-5 h-5 md:w-6 md:h-6 " />
              </div>
            </div>

            <div>
              <h1 className="text-xl md:text-3xl font-extrabold text-gray-900">
                Shopping Cart
              </h1>
              <p className="text-xs md:text-sm text-gray-500">
                {cart.count > 0
                  ? `${cart.count} item${cart.count > 1 ? "s" : ""} ready for checkout`
                  : "Your cart is empty"}
              </p>
            </div>
          </div>

          {cart.count > 0 && (
            <div className="hidden sm:flex items-center gap-1.5 bg-white border border-red-200 rounded-full px-4 py-1.5 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-orange-400" />
              <span className="text-sm font-semibold text-red-500">
                {cart.count} Items
              </span>
            </div>
          )}
        </div>
      </div>

      {/* EMPTY STATE */}
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
          <div className="h-full flex flex-col justify-center items-center text-gray-400">
            <Image
              src="/assets/images/cartempty.png"
              alt="Empty Cart"
              width={140}
              height={140}
              className="opacity-70"
            />
          </div>

          <Button
            asChild
            className="bg-red-500 hover:bg-red-600 text-white px-6 py-2.5 rounded-xl mb-10 mt-5"
          >
            <Link href={WEBSITE_SHOP}>
              Continue Shopping
              <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </Button>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-6 px-4 md:px-0">
          {/* PRODUCTS */}
          <div className="flex-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              {/* Desktop Table */}
              <div className="hidden md:block">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-gray-50">
                      <th className="text-left px-6 py-4 ">Product</th>
                      <th className="text-center px-4 py-4 ">Price</th>
                      <th className="text-center px-4 py-4 ">Qty</th>
                      <th className="text-center px-4 py-4 ">Total</th>
                      <th className="text-center px-4 py-4 ">Remove</th>
                      <th />
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {cart.products.map((product) => (
                      <tr key={product.variantId}>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-4">
                            {/* Product Image */}
                            <div className="relative w-16 h-16 rounded-xl overflow-hidden border">
                              <Image
                                src={
                                  product.media ||
                                  "/assets/images/img-placeholder.webp"
                                }
                                fill
                                alt={product.name}
                                className="object-cover"
                              />
                            </div>

                            {/* Product Info */}
                            <div className="flex flex-col">
                              <Link
                                href={WEBSITE_PRODUCT_DETAILS(product.url)}
                                className="text-sm font-semibold hover:text-red-500"
                              >
                                {product.name}
                              </Link>

                              <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                                {product.color && (
                                  <span className="text-xs text-gray-400">
                                    Color: {product.color}
                                  </span>
                                )}
                                {product.color && product.size && (
                                  <span className="text-xs text-gray-300">
                                    ·
                                  </span>
                                )}
                                {product.size && (
                                  <span className="text-xs text-gray-400">
                                    Size: {product.size}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </td>

                        <td className="text-center">
                          {formatPKR(product.sellingPrice)}
                        </td>

                        <td>
                          <div className="flex justify-center cursor-pointer">
                            <div className="flex items-center h-10 border rounded-full w-fit overflow-hidden">
                              <button
                                onClick={() => handleDecrease(product)}
                                disabled={product.qty <= 1}
                                 className="h-full w-10 flex items-center justify-center hover:bg-gray-100"
                              >
                                <HiMinus className=" cursor-pointer" />
                              </button>

                              <span className="w-10 text-center">
                                {product.qty}
                              </span>

                              <button
                                onClick={() => handleIncrease(product)}
                                disabled={product.qty >= 99}
                                 className="h-full w-10 flex items-center justify-center hover:bg-gray-100"
                              >
                                <HiPlus className=" cursor-pointer" />
                              </button>
                            </div>
                          </div>
                        </td>

                        <td className="text-center font-bold">
                          {formatPKR(product.sellingPrice * product.qty)}
                        </td>

                        <td className="text-center ">
                          <button onClick={() => handleRemove(product)}>
                            <Trash2 className="w-4 h-4 text-red-500 cursor-pointer" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="md:hidden divide-y">
                {cart.products.map((product) => (
                  <div
                    key={product.variantId}
                    className="p-4 flex gap-3 relative"
                  >
                    {/* Remove Button (top-right) */}
                    <button
                      onClick={() => handleRemove(product)}
                      className="absolute top-4 right-4 flex items-center gap-1 text-xs text-red-500 hover:text-red-600 hover:scale-110 transition"
                    >
                      Remove{" "}
                      <Trash2 className="w-4 h-4 text-red-500 hover:scale-110 transition" />
                    </button>

                    {/* Image */}
                    <div className="flex items-start">
                      <Image
                        src={
                          product.media || "/assets/images/img-placeholder.webp"
                        }
                        width={64}
                        height={64}
                        alt={product.name}
                        className="rounded-md border shrink-0"
                      />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0 pr-6">
                      <Link
                        href={WEBSITE_PRODUCT_DETAILS(product.url)}
                        className="text-sm font-semibold line-clamp-2"
                      >
                        {product.name}
                      </Link>

                      {/* Color & Size */}
                      <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                        {product.color && (
                          <span className="text-xs text-gray-400">
                            Color: {product.color}
                          </span>
                        )}
                        {product.color && product.size && (
                          <span className="text-xs text-gray-300">·</span>
                        )}
                        {product.size && (
                          <span className="text-xs text-gray-400">
                            Size: {product.size}
                          </span>
                        )}
                      </div>

                      {/* Price */}
                      <div className="text-xs text-gray-500 mt-1">
                        {formatPKR(product.sellingPrice)}
                      </div>

                      {/* Quantity + Total */}
                      <div className="mt-2 flex items-center justify-between">
                        {/* Qty Controls */}
                        <div className="flex items-center h-10 border rounded-full w-fit overflow-hidden">
                          <button
                            onClick={() => handleDecrease(product)}
                            disabled={product.qty <= 1}
                            className="h-full w-10 flex items-center justify-center hover:bg-gray-100"
                          >
                            <HiMinus className="cursor-pointer" />
                          </button>

                          <span className="w-8 text-center text-sm">
                            {product.qty}
                          </span>

                          <button
                            onClick={() => handleIncrease(product)}
                            disabled={product.qty >= 99}
                            className="h-full w-10 flex items-center justify-center hover:bg-gray-100"
                          >
                            <HiPlus className="cursor-pointer" />
                          </button>
                        </div>

                        {/* Total Price */}
                        <div className="text-sm font-bold">
                          {formatPKR(product.sellingPrice * product.qty)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* SUMMARY */}
          <div className="lg:w-80">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sticky top-4">
              <h3 className="text-lg font-bold mb-4">Order Summary</h3>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{formatPKR(cartTotal)}</span>
                </div>
                <div className="flex justify-between text-green-600">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                <div className="border-t pt-2 flex justify-between font-bold">
                  <span>Total</span>
                  <span>{formatPKR(cartTotal)}</span>
                </div>
              </div>

              <div className="mt-6 space-y-3 ">
                {/* Checkout Button */}
                <button className="w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded-xl font-semibold transition cursor-pointer"
                 onClick={() => router.push(WEBSITE_CHECKOUT

                 )}
                >
                  <BsCart2 className="w-5 h-5 inline-block mr-2" />
                  
                  Proceed to Checkout
                </button>

                {/* Continue Shopping */}
                <Link
                  href={WEBSITE_SHOP}
                  className="block text-center text-sm text-gray-500 hover:text-red-500 transition"
                >
                  ← Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
