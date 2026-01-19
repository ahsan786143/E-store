"use client";
import { WEBSITE_SHOP } from "@/app/routes/UserWebsite";
import Filter from "@/components/website/Filter";
import Sorting from "@/components/website/Sorting";
import WebsiteBreadcrumb from "@/components/website/WebsiteBreadcrumb";
import React, { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import useWindowSize from "@/hooks/useWindowSize";

const breadcrumb = {
  title: "Shop",
  links: [{ label: "Shop", href: WEBSITE_SHOP }],
};

const Shop = () => {
  const [limit, setLimit] = useState(9);
  const [sorting, setSorting] = useState("default_sorting");
  const [isMoblieFilter, setMoblieFilter] = useState(false);

  const windowSize = useWindowSize();
  const isDesktop = windowSize?.width >= 1024;

  return (
    <div>
      <WebsiteBreadcrumb props={breadcrumb} />

      <section className="lg:flex lg:px-32 px-4 my-20">
        {isDesktop ? (
          <div className="w-72 me-4">
            <div className="sticky top-0 bg-gray-50 p-4 rounded">
              <Filter />
            </div>
          </div>
        ) : (
          <Sheet open={isMoblieFilter} onOpenChange={setMoblieFilter}>
            <SheetContent side="left" className="block">
              <SheetHeader className="border-b">
                <SheetDescription></SheetDescription>
                <SheetTitle>Filter</SheetTitle>
              </SheetHeader>

              <div className="p-4 overflow-auto h-[calc(100vhpx)]">
                <Filter />
              </div>
            </SheetContent>
          </Sheet>
        )}

        <div className="lg:w-[calc(100%-18rem)]">
          <Sorting
            limit={limit}
            setLimit={setLimit}
            sorting={sorting}
            setSorting={setSorting}
            moblieFilterOpen={isMoblieFilter}
            setMoblieFilterOpen={setMoblieFilter}
          />
        </div>
      </section>
    </div>
  );
};

export default Shop;
