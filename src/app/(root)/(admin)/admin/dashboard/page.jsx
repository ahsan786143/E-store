"use client";

import React, { useEffect } from "react";
import CountOverview from "./CountOverview";
import QuickAdd from "./QuickAdd";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { OrderOverview } from "./OrderOverview";
import { OrderStatus } from "./OrderSatus";
import LatestOrder from "./LatestOrder";
import LatestReview from "./LatestReview";
import { useRouter } from "next/navigation";

const AdminDashboard = () => {
  const router = useRouter();
  useEffect(() => {
    const role = localStorage.getItem("role");

    if (role !== "admin") {
      router.push("/auth/login");
    }
  }, [router]);

  return (
    <div className="pt-5">
      <CountOverview />
      <QuickAdd />

      <div className="mt-10 flex lg:flex-nowrap flex-wrap gap-10">
        <Card className="rounded-lg lg:w-[70%] w-full p-0">
          <CardHeader className="py-3 border-b">
            <div className="flex justify-between items-center">
              <span className="font-semibold">Order Overview</span>
              <Button asChild>
                <Link href="/dashboard/orders">View All</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <OrderOverview />
          </CardContent>
        </Card>

        <Card className="rounded-lg lg:w-[30%] w-full p-0">
          <CardHeader className="py-3 border-b">
            <div className="flex justify-between items-center">
              <span className="font-semibold">Order Status</span>
              <Button asChild>
                <Link href="/dashboard/orders">View All</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <OrderStatus />
          </CardContent>
        </Card>
      </div>

      <div className="mt-10 flex lg:flex-nowrap flex-wrap gap-10">
        <Card className="rounded-lg lg:w-[70%] w-full p-0 block">
          <CardHeader className="py-3 border-b">
            <div className="flex justify-between items-center">
              <span className="font-semibold">Latest Order</span>
              <Button asChild>
                <Link href="/dashboard/orders">View All</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-3 lg:h-[350px] overflow-auto">
            <LatestOrder />
          </CardContent>
        </Card>

        <Card className="rounded-lg lg:w-[30%] w-full p-0">
          <CardHeader className="py-3 border-b">
            <div className="flex justify-between items-center">
              <span className="font-semibold">Latest Review</span>
              <Button asChild>
                <Link href="/dashboard/reviews">View All</Link>
              </Button>
            </div>
          </CardHeader>

          <CardContent className="pt-3 lg:h-[350px] overflow-auto">
            <LatestReview />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;