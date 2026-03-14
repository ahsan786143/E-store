"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  Package,
  MapPin,
  CreditCard,
  Clock,
  CheckCircle2,
  XCircle,
  Truck,
  ShoppingBag,
  ChevronRight,
  Phone,
  Mail,
} from "lucide-react";

import WebsiteBreadcrumb from "@/components/website/WebsiteBreadcrumb";
import { USER_ORDERS } from "@/app/routes/UserWebsite";


// ---------------- Breadcrumb ----------------
const breadcrumb = {
  title: "Order Details",
  links: [
    { label: "Home", href: "/" },
    { label: "My Orders", href: USER_ORDERS },
    { label: "Order Details", href: "#" },
  ],
};


// ---------------- Status Config ----------------
const statusConfig = {
  pending: {
    label: "Pending",
    icon: Clock,
    color: "text-amber-600 bg-amber-50 border-amber-200",
  },
  confirmed: {
    label: "Confirmed",
    icon: CheckCircle2,
    color: "text-emerald-600 bg-emerald-50 border-emerald-200",
  },
  shipped: {
    label: "Shipped",
    icon: Truck,
    color: "text-blue-600 bg-blue-50 border-blue-200",
  },
  delivered: {
    label: "Delivered",
    icon: CheckCircle2,
    color: "text-green-600 bg-green-50 border-green-200",
  },
  cancelled: {
    label: "Cancelled",
    icon: XCircle,
    color: "text-red-600 bg-red-50 border-red-200",
  },
};


// ---------------- Helpers ----------------
const formatDate = (dateStr) => {
  if (!dateStr) return "—";

  return new Date(dateStr).toLocaleDateString("en-PK", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const formatPKR = (amount) =>
  Number(amount || 0).toLocaleString("en-PK", {
    style: "currency",
    currency: "PKR",
    maximumFractionDigits: 0,
  });


// ---------------- Status Badge ----------------
const StatusBadge = ({ status }) => {
  const cfg = statusConfig[status?.toLowerCase()] || statusConfig.pending;
  const Icon = cfg.icon;

  return (
    <div
      className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-semibold ${cfg.color}`}
    >
      <Icon size={14} />
      {cfg.label}
    </div>
  );
};


// ---------------- Page ----------------
const OrderDetailsPage = () => {

  const params = useParams();
  const orderid = params.orderid;

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);


  const getOrder = async () => {
    try {

      const res = await axios.get(`/api/order/get/${orderid}`);

      if (res.data.success) {
        setOrder(res.data.data);
      }

    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    if (orderid) getOrder();
  }, [orderid]);


  if (loading)
    return (
      <div className="flex justify-center py-20">
        <p className="text-gray-400">Loading order...</p>
      </div>
    );


  if (!order)
    return (
      <div>
        <WebsiteBreadcrumb props={breadcrumb} />

        <div className="text-center py-20">
          <XCircle className="mx-auto text-red-400 mb-3" size={40} />
          <p>Order not found</p>
        </div>
      </div>
    );


  const subtotal = order.subtotal ?? 0;
  const discount = order.discount ?? 0;
  const total = order.total ?? 0;


  return (

    <div className="min-h-screen bg-gray-50">

      {/* Breadcrumb */}
      <WebsiteBreadcrumb props={breadcrumb} />

      <div className="max-w-6xl mx-auto px-4 py-10">

        {/* Header */}
        <div className="flex justify-between items-center mb-8">

          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Order Details
            </h1>

            <p className="text-gray-400 text-sm">
              Order ID #{order._id?.slice(-8)}
            </p>
          </div>

          <StatusBadge status={order.status} />

        </div>



        {/* ---------------- 4 CARDS ---------------- */}

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">


          {/* Order Card */}
          <div className="bg-white p-5 rounded-2xl shadow-sm border">

            <div className="flex items-center gap-2 mb-3">
              <ShoppingBag size={18} />
              <p className="font-semibold">Order Info</p>
            </div>

            <p className="text-sm text-gray-500">
              Date
            </p>

            <p className="font-semibold mb-3">
              {formatDate(order.createdAt)}
            </p>

            <p className="text-sm text-gray-500">
              Items
            </p>

            <p className="font-semibold">
              {order.products?.length} products
            </p>

          </div>


          {/* Payment Card */}
          <div className="bg-white p-5 rounded-2xl shadow-sm border">

            <div className="flex items-center gap-2 mb-3">
              <CreditCard size={18} />
              <p className="font-semibold">Payment</p>
            </div>

            <p className="text-sm text-gray-500">
              Method
            </p>

            <p className="font-semibold mb-3">
              {order.paymentMethod}
            </p>

            <p className="text-sm text-gray-500">
              Status
            </p>

            <p className="font-semibold">
              {order.isPaid ? "Paid" : "Unpaid"}
            </p>

          </div>


          {/* Address Card */}
          <div className="bg-white p-5 rounded-2xl shadow-sm border">

            <div className="flex items-center gap-2 mb-3">
              <MapPin size={18} />
              <p className="font-semibold">Address</p>
            </div>

            <p className="font-semibold">
              {order.fullName}
            </p>

            <p className="text-sm text-gray-500">
              {order.address}
            </p>

            <p className="text-sm text-gray-500">
              {order.city}
            </p>

            <p className="text-sm text-gray-500">
              {order.country}
            </p>

          </div>


          {/* Total Card */}
          <div className="bg-white p-5 rounded-2xl shadow-sm border">

            <div className="flex items-center gap-2 mb-3">
              <Package size={18} />
              <p className="font-semibold">Total</p>
            </div>

            <p className="text-sm text-gray-500">
              Subtotal
            </p>

            <p className="font-semibold mb-3">
              {formatPKR(subtotal)}
            </p>

            <p className="text-sm text-gray-500">
              Total
            </p>

            <p className="text-xl font-bold text-red-500">
              {formatPKR(total)}
            </p>

          </div>

        </div>



        {/* ---------------- Products ---------------- */}

        <div className="bg-white rounded-2xl shadow-sm border">

          <div className="p-5 border-b flex items-center gap-2">

            <Package size={18} />

            <p className="font-semibold">
              Ordered Products
            </p>

          </div>


          {order.products?.map((item, index) => {

            const image =
              item.media ||
              item.variantId?.media ||
              "/assets/images/img-placeholder.webp";

            return (

              <div
                key={index}
                className="flex items-center gap-4 p-5 border-b hover:bg-gray-50 transition"
              >

                <img
                  src={image}
                  className="w-20 h-20 rounded-xl object-cover border"
                />

                <div className="flex-1">

                  <h3 className="font-semibold">
                    {item.productId?.name}
                  </h3>

                  <p className="text-sm text-gray-400">
                    Qty: {item.qty}
                  </p>

                </div>


                <div className="font-bold">
                  {formatPKR(item.qty * item.sellingPrice)}
                </div>

              </div>

            );
          })}

        </div>


        {/* ---------------- Order Summary ---------------- */}

        <div className="bg-white rounded-2xl shadow-sm border p-6 mt-8 max-w-md ml-auto">

          <h3 className="font-semibold mb-4">
            Order Summary
          </h3>

          <div className="space-y-2 text-sm">

            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>{formatPKR(subtotal)}</span>
            </div>

            {discount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Discount</span>
                <span>-{formatPKR(discount)}</span>
              </div>
            )}

            <div className="border-t pt-2 flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>{formatPKR(total)}</span>
            </div>

          </div>

        </div>


      </div>

    </div>

  );
};

export default OrderDetailsPage;