"use client";

import Image from "next/image";
import React from "react";
import { ShoppingCart } from "lucide-react";
import Link from "next/link";
import { WEBSITE_PRODUCT_DETAILS } from "@/app/routes/UserWebsite";

const ProductBox = ({ product }) => {
  const image = product?.media?.[0];

  return (
    <div className="group relative bg-white border rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
     <Link href={WEBSITE_PRODUCT_DETAILS(product.slug)}>
      {/* Discount Badge */}
      {product?.discountPercentage > 0 && (
        <span className="absolute top-3 left-3 z-10 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
          {product.discountPercentage}% OFF
        </span>
      )}

      {/* Image */}
      <div className="relative overflow-hidden">
        <Image
          src={image?.secure_url || "/assets/images/img-placeholder.webp"}
          width={400}
          height={400}
          alt={image?.alt || product?.name}
          title={image?.title || product?.name}
          className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
        />
      </div>

      {/* Content */}
      <div className="p-4 space-y-2">
        <h4 className="font-semibold text-gray-800 line-clamp-1">
          {product?.name}
        </h4>

        {/* Price */}
        <div className="flex items-center gap-2">
          <span className="text-sm line-through text-gray-400">
            {product?.mrp?.toLocaleString("en-PK", {
              style: "currency",
              currency: "PKR",
            })}
          </span>

          <span className="text-lg font-semibold">
            {product?.sellingPrice?.toLocaleString("en-PK", {
              style: "currency",
              currency: "PKR",
            })}
          </span>
        </div>

        {/* CTA (optional)
        <button className="mt-3 w-full flex items-center justify-center gap-2 rounded-xl bg-black text-white py-2 text-sm font-medium transition-all hover:bg-gray-800">
          <ShoppingCart size={16} />
          Add to Cart
        </button>
        */}
      </div>
     </Link> 
    </div>
  );
};

export default ProductBox;
