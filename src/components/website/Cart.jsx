"use client";

import React, { useEffect, useState } from "react";
import { BsCart2 } from "react-icons/bs";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { useDispatch, useSelector } from "react-redux";
import Image from "next/image";
import { Button } from "../ui/button";
import Link from "next/link";
import { WEBSITE_CART, WEBSITE_CHECKOUT } from "@/app/routes/UserWebsite";
import { removeFromCart } from "@/store/reducer/cartReducer";
import { showToast } from "@/lib/showToast";

const Cart = () => {
  const [subtotal, setSubtotal] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [open, setOpen] = useState(false);

  const cart = useSelector((store) => store.cartStore);
  const dispatch = useDispatch();

  useEffect(() => {
    const cartProducts = cart.products || [];
    const totalAmount = cartProducts.reduce(
      (sum, product) => sum + product.sellingPrice * product.qty,
      0
    );
    const totalDiscount = cartProducts.reduce(
      (sum, product) => sum + (product.mrp - product.sellingPrice) * product.qty,
      0
    );
    setSubtotal(totalAmount);
    setDiscount(totalDiscount);
  }, [cart.products]);

  const total = subtotal;

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      {/* Cart Icon */}
      <SheetTrigger className="relative">
        <BsCart2
          size={28}
          className="text-gray-600 hover:text-primary transition duration-300"
        />
        {cart.count > 0 && (
          <span className="absolute top-0 right-0 -translate-x-1/2 -translate-y-1/2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full shadow-lg animate-pulse">
            {cart.count}
          </span>
        )}
      </SheetTrigger>

      {/* Cart Sheet */}
      <SheetContent className="flex flex-col bg-gray-50 w-[350px] md:w-[400px] p-4">
        <SheetHeader>
          <SheetTitle className="text-xl font-bold text-gray-800">
            Your Shopping Cart
          </SheetTitle>
        </SheetHeader>

        {/* Cart Body */}
        <div className="flex-1 overflow-hidden flex flex-col mt-2">
          {/* Product List */}
          <div className="flex-1 overflow-auto pr-2 space-y-3">
            {cart.count === 0 ? (
              <div className="h-full flex flex-col justify-center items-center text-gray-400">
                <Image
                  src="/assets/images/cartempty.png"
                  alt="Empty Cart"
                  width={140}
                  height={140}
                  className="opacity-70"
                />
                <p className="mt-3 text-sm font-medium">Your cart is empty</p>
              </div>
            ) : (
              cart.products?.map((product) => (
                <div
                  key={product.variantId}
                  className="flex gap-4 p-3 bg-white rounded-2xl border hover:shadow-lg transition-shadow duration-300"
                >
                  {/* Product Image */}
                  <Image
                    src={product?.media || "/assets/images/img-placeholder.webp"}
                    alt={product?.name}
                    width={90}
                    height={90}
                    className="w-24 h-24 object-cover rounded-xl border"
                  />

                  {/* Product Details */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="text-sm font-semibold text-gray-800 line-clamp-2">
                        {product.name}
                      </h4>
                      <p className="text-xs text-gray-500 mt-1">
                        Size: <span className="font-medium">{product.size}</span> |{" "}
                        Color: <span className="font-medium">{product.color}</span>
                      </p>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <p className="text-sm font-medium text-gray-700">
                        {product.qty} ×{" "}
                        {product.sellingPrice.toLocaleString("en-PK", {
                          style: "currency",
                          currency: "PKR",
                        })}
                      </p>
                      <button
                        type="button"
                        className="text-red-500 text-xs hover:text-red-600 hover:underline transition hover:cursor-pointer"
                        onClick={() =>
                          dispatch(
                            removeFromCart({
                              productId: product.productId,
                              variantId: product.variantId,
                            })
                          )
                        }
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Totals */}
          {cart.count > 0 && (
            <div className="border-t mt-4 pt-4 space-y-2 px-1">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Subtotal</span>
                <span className="font-medium">
                  {subtotal.toLocaleString("en-PK", {
                    style: "currency",
                    currency: "PKR",
                  })}
                </span>
              </div>
              <div className="flex justify-between text-sm text-green-600">
                <span>Discount</span>
                <span className="font-medium">
                  −{" "}
                  {discount.toLocaleString("en-PK", {
                    style: "currency",
                    currency: "PKR",
                  })}
                </span>
              </div>
              <div className="flex justify-between text-base font-semibold pt-2 text-gray-800">
                <span>Total</span>
                <span>
                  {total.toLocaleString("en-PK", {
                    style: "currency",
                    currency: "PKR",
                  })}
                </span>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 mt-5">
            <Button
              type="button"
              asChild
              variant="secondary"
              className="flex-1 h-12 font-medium"
              onClick={() => setOpen(false)}
            >
              <Link href={WEBSITE_CART}>View Cart</Link>
            </Button>

            <Button
              type="button"
              className={`flex-1 h-12 font-semibold ${
                cart.count === 0 ? "opacity-50 cursor-not-allowed" : ""
              }`}
              onClick={() => {
                if (cart.count > 0) setOpen(false);
                else showToast("error", "Cart is empty");
              }}
            >
              <Link href={cart.count > 0 ? WEBSITE_CHECKOUT : "#"}>Checkout</Link>
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default Cart;
