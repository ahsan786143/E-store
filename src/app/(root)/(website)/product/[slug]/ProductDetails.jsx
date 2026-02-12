"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { use, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { HiMinus } from "react-icons/hi";
import { HiPlus } from "react-icons/hi";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  WEBSITE_CART,
  WEBSITE_PRODUCT_DETAILS,
  WEBSITE_SHOP,
} from "@/app/routes/UserWebsite";
import { IoStar } from "react-icons/io5";
import ButtonLoading from "@/components/ButtonLoading/ButtonLoading";
import { useDispatch, useSelector } from "react-redux";
import { showToast } from "@/lib/showToast";
import { addIntoCart } from "@/store/reducer/cartReducer";
import { set } from "mongoose";
import { encode } from "entities";
import ProductReview from "@/components/website/ProductReview";

export default function ProductDetails({
  product,
  variant,
  colors,
  sizes,
  reviewCount,
}) {
  const dispatch = useDispatch();
  const cartStore = useSelector((state) => state.cartStore);
  const [activeThumb, setActiveThumb] = useState();
  const [qty, setQty] = useState(1);
  const [isAddedIntoCart, setIsAddedIntoCart] = useState(false);
  const [isProductLoading, setIsProductLoading] = useState(false);

  useEffect(() => {
    setActiveThumb(variant?.media?.[0]?.secure_url);
  }, [variant]);

  useEffect(() => {
    if (cartStore.count > 0) {
      const existingProduct = cartStore.products.findIndex(
        (cartProduct) =>
          cartProduct.productId === product._id &&
          cartProduct.variantId === variant._id,
      );

      if (existingProduct >= 0) {
        setIsAddedIntoCart(true);
      } else {
        setIsAddedIntoCart(false);
      }
    }
    setIsProductLoading(false);
  }, [cartStore, product, variant]);

  const handleQty = (actionType) => {
    if (actionType === "inc") {
      setQty((prev) => prev + 1);
    } else {
      if (qty !== 1) {
        setQty((prev) => prev - 1);
      }
    }
  };

  const handleAddToCart = () => {
    const cartProduct = {
      productId: product._id,
      variantId: variant._id,
      name: product.name,
      url: product.slug,
      size: variant.size,
      color: variant.color,
      mrp: variant.mrp,
      sellingPrice: variant.sellingPrice,
      media: variant?.media[0]?.secure_url,
      qty: qty,
    };

    dispatch(addIntoCart(cartProduct));
    setIsAddedIntoCart(true);
    showToast("success", "Product added into cart");
  };

  return (
    <div className="px-4 lg:px-28 pb-24">

      {
        isProductLoading &&
      <div className="fixed top-10 left-1/2 -translate-x-1/2 z-50">
        <Image src="/assets/images/loading.svg" width={80} height={80} alt="loader" />

      </div>
      }
      {/* Breadcrumb */}
      <div className="my-8">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href={WEBSITE_SHOP}>Shop</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{product.name}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="grid md:grid-cols-2 gap-10">
        {/* Image Gallery */}
        <div className="flex flex-col-reverse md:flex-row gap-4 md:sticky md:top-20">
          <div className="flex flex-row md:flex-col gap-3 overflow-auto md:max-h-[550px] pr-1">
            {variant?.media?.map((img) => (
              <motion.img
                key={img._id}
                src={img.secure_url}
                whileHover={{ scale: 1.08 }}
                onClick={() => setActiveThumb(img.secure_url)}
                className={`w-16 h-16 md:w-20 md:h-20 object-cover rounded-xl cursor-pointer border transition ${
                  activeThumb === img.secure_url
                    ? "border-primary shadow-md"
                    : "border-gray-200"
                }`}
              />
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-lg p-4 w-full"
          >
            <Image
              src={activeThumb || "/assets/images/img-placeholder.webp"}
              width={500}
              height={500}
              alt="product"
              className="rounded-xl object-contain w-full h-auto"
            />
          </motion.div>
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <h1 className="text-3xl font-semibold">{product.name}</h1>

          <div className="flex items-center gap-2 text-sm text-gray-500">
            {Array.from({ length: 5 }).map((_, i) => (
              <IoStar key={i} />
            ))}
            <span className="text-sm ps-2">({reviewCount} Reviews)</span>
          </div>

          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="font-bold text-2xl text-gray-900">
              {variant?.sellingPrice?.toLocaleString("en-PK", {
                style: "currency",
                currency: "PKR",
              })}
            </span>

            {variant?.mrp && (
              <span className="text-sm line-through text-gray-400">
                {variant.mrp.toLocaleString("en-PK", {
                  style: "currency",
                  currency: "PKR",
                })}
              </span>
            )}

            {variant?.discountPercentage > 0 && (
              <span className="bg-red-500 rounded-full px-3 py-1 text-white text-xs font-semibold">
                {variant.discountPercentage}% OFF
              </span>
            )}
          </div>

          <div
            className="line-c-4"
            dangerouslySetInnerHTML={{ __html: product.description }}
          ></div>

          {/* Colors */}
          <div>
            <h3 className="font-medium mb-2">Colors</h3>
            <span className="text-sm ">Select Color: {variant?.color}</span>
            <div className="flex gap-3 flex-wrap">
              {colors?.map((color) => (
                <div key={color} className="flex flex-col items-center gap-1">
                  {/* Color Circle */}
                  <Link
                    onClick={() => setIsProductLoading(true)}
                    href={`${WEBSITE_PRODUCT_DETAILS(product.slug)}?color=${color}&size=${variant?.size}`}
                    className={`w-8 h-8 rounded-full border shadow cursor-pointer block
          ${color === variant?.color ? "ring-2 ring-primary" : ""}
        `}
                    style={{ backgroundColor: color }}
                  />

                  {/* Color Name Box */}
                  <Link
                    onClick={() => setIsProductLoading(true)}
                    href={`${WEBSITE_PRODUCT_DETAILS(product.slug)}?color=${color}&size=${variant?.size}`}
                    className={`border px-3 py-1 rounded-md text-xs capitalize cursor-pointer transition
          hover:bg-primary hover:text-white
          ${color === variant?.color ? "bg-primary text-white" : ""}
        `}
                  >
                    {color}
                  </Link>
                </div>
              ))}
            </div>
          </div>
          {/* Sizes */}
          <div>
            <h3 className="font-medium mb-2">Sizes</h3>
            <span className="text-sm ">Select Size: {variant?.size}</span>
            <div className="flex gap-3 flex-wrap">
              {sizes?.map((size) => (
                <div key={size} className="flex flex-col items-center gap-1">
                  <Link
                    onClick={() => setIsProductLoading(true)}
                    href={`${WEBSITE_PRODUCT_DETAILS(product.slug)}?color=${variant?.color}&size=${size}`}
                    className={`border px-3 py-1 rounded-md text-xs capitalize cursor-pointer transition
          hover:bg-primary hover:text-white
          ${size === variant?.size ? "bg-primary text-white" : ""}
        `}
                  >
                    {size}
                  </Link>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-5">
            <p className="font-bold mb-2">Quantity</p>

            <div className="flex items-center h-10 border rounded-full w-fit overflow-hidden">
              <button
                type="button"
                onClick={() => handleQty("desc")}
                className="h-full w-10 flex items-center justify-center hover:bg-gray-100"
              >
                <HiMinus />
              </button>

              <input
                type="text"
                value={qty}
                readOnly
                className="w-14 text-center border-0 outline-none font-medium"
              />

              <button
                type="button"
                onClick={() => handleQty("inc")}
                className="h-full w-10 flex items-center justify-center hover:bg-gray-100"
              >
                <HiPlus />
              </button>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-5">
            {!isAddedIntoCart ? (
              <ButtonLoading
                type="button"
                text="Add To Cart"
                className="w-full rounded-full py-6 text-md cursor-pointer"
                onClick={handleAddToCart}
              />
            ) : (
              <Button
                className="w-full rounded-full py-6 text-md cursor-pointer"
                type="button"
                asChild
              >
                <Link href={WEBSITE_CART}>Go To Cart</Link>
              </Button>
            )}
          </div>
        </div>
      </div>


      <div className="mb-20 mt-6">
  <div className="shadow rounded border">
    <div className="p-3 bg-gray-50 border-b">
      <h2 className="font-semibold text-2xl">Product Description</h2>
    </div>

    <div className="p-3">
      <div
        dangerouslySetInnerHTML={{
          __html: encode(product?.description),
        }}
      />
    </div>
  </div>
</div>

<ProductReview productId={product?._id} />


    </div>
  );
}
