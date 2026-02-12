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
import { useSearchParams } from "next/navigation";
import axios from "axios";
import { useInfiniteQuery } from "@tanstack/react-query";
import ProductBox from "@/components/website/ProductBox";
import ButtonLoading from "@/components/ButtonLoading/ButtonLoading";

const breadcrumb = {
  title: "Shop",
  links: [{ label: "Shop", href: WEBSITE_SHOP }],
};

const Shop = () => {
  const searchParams = useSearchParams().toString();
  const [limit, setLimit] = useState(9);
  const [sorting, setSorting] = useState("default_sorting");
  const [isMoblieFilter, setMoblieFilter] = useState(false);

  const windowSize = useWindowSize();
  const isDesktop = windowSize?.width >= 1024;

  const fetchProduct = async (pageParam) => {
    const { data: getProduct } = await axios.get(
      `/api/shop?page=${pageParam}&limit=${limit}&sort=${sorting}&${searchParams}`,
    
    );
   
    if (!getProduct.success) {
      return;
    }
    return getProduct.data;
  };
  const { error, data, isFetching, fetchNextPage, hasNextPage } =
    useInfiniteQuery({
      queryKey: ["products", limit, sorting, searchParams],
      queryFn: async ({ pageParam }) => await fetchProduct(pageParam),
      initialPageParam: 0,
      getNextPageParam: (lastPage) => {
        return lastPage?.nextPage;
      },
    });
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
          {isFetching && (
            <div className="p-3 font-semibold text-center ">Loading...</div>
          )}
          {error && (
            <div className="p-3 font-semibold text-center ">
              {error.message}
            </div>
          )}

          <div className="grid lg:grid-cols-3 grid-cols-2 lg:gap-10 gap-5">
            {data &&
              data.pages.map((page) =>
                page.products.map((product) => (
                  <ProductBox key={product._id} product={product} />
                )),
              )}
          </div>
          {/* Load more button */}
           <div className="flex justify-center mt-10">
            {hasNextPage?
             <ButtonLoading type= "button" loading={isFetching} text="load More" onClick={fetchNextPage}/>
             :
             <>
                 {!isFetching && <p className="font-semibold">No More Product Found</p>}
             </>

            }

           </div>
        </div>
      </section>
    </div>
  );
};

export default Shop;

