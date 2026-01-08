"use client";

import React, { useCallback, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import {
  ADMIN_DASHBOARD,
  ADMIN_TRASH,
} from "@/app/routes/AdminPanel";
import DatatableWrapper from "@/components/admin/DatatableWrapper";
import DeleteAction from "@/components/admin/DeleteAction";
import { Card, CardHeader } from "@/components/ui/card";
import { DT_CATEGORY_COLUMN, DT_COUPON_COLUMN, DT_CUSTOMER_COLUMN, DT_PRODUCT_VARIANT_COLUMN, DT_REVIEW_COLUMN } from "@/lib/column";
import { columnConfig } from "@/lib/helperFunction";
import BreadCrumb from "@/components/admin/BreadCrumb";

// ------------------ BreadCrumb Component ------------------
const breadcrumbData = [
  { href: ADMIN_DASHBOARD, label: "Home" },
  { href: ADMIN_TRASH, label: "Trash" },
];


const TRASH_CONFIG = {
  category: {
    title: "Category Trash",
    columns: DT_CATEGORY_COLUMN,
    fetchUrl: "/api/category",
    exportUrl: "/api/category/export",
    deleteUrl: "/api/category/delete",
  },
  product: {
    title: "Product Trash",
    columns: DT_CATEGORY_COLUMN,
    fetchUrl: "/api/product",
    exportUrl: "/api/product/export",
    deleteUrl: "/api/product/delete",
  },
  "product-variant": {
    title: "Product Variant Trash",
    columns: DT_PRODUCT_VARIANT_COLUMN,
    fetchUrl: "/api/product-variant",
    exportUrl: "/api/product-variant/export",
    deleteUrl: "/api/product-variant/delete",
  },
  coupon: {
    title: "Coupon Trash",
    columns: DT_COUPON_COLUMN,
    fetchUrl: "/api/coupon",
    exportUrl: "/api/coupon/export",
    deleteUrl: "/api/coupon/delete",
  },
  customers: {
    title: "Customers Trash",
    columns: DT_CUSTOMER_COLUMN,
    fetchUrl: "/api/customers",
    exportUrl: "/api/customers/export",
    deleteUrl: "/api/customers/delete",
  },
  review: {
    title: "Review Trash",
    columns: DT_REVIEW_COLUMN,
    fetchUrl: "/api/review",
    exportUrl: "/api/review/export",
    deleteUrl: "/api/review/delete",
  },
};

// ------------------ Trash Page ------------------
const Trash = () => {
  const searchParams = useSearchParams();
  const trashof = searchParams.get("trashof");

  const config = TRASH_CONFIG[trashof];

  if (!config) return <div className="p-5">Invalid Trash Type</div>;

  // Column config with Deleted At
  const columns = useMemo(() => columnConfig(config.columns, false, false, true), [config]);

  // Row actions
 const action = useCallback((row, deleteType, handleDelete) => {
  return [
    <DeleteAction
      key="delete"
      row={row}
      deleteType={deleteType}
      handleDelete={handleDelete}
    />,
  ];
  
});


  return (
    <div>
      {/* Breadcrumb */}
      <BreadCrumb breadcrumbData={breadcrumbData} />

      {/* Card Wrapper */}
      <Card className="py-0 rounded shadow-sm">
        <CardHeader className="pt-3 px-3 border-b">
          <div className="flex justify-between items-center gap-0">
            <h4 className="text-xl font-semibold">{config.title}</h4>
          </div>
        </CardHeader>

        {/* Datatable */}
        <DatatableWrapper
          queryKey={`${trashof}-data-deleted`}
          fetchUrl={config.fetchUrl}
          initialPageSize={10}
          columnsConfig={columns}
          exportEndPoint={config.exportUrl}
          deleteEndPoint={config.deleteUrl}
          deleteType={"PD"}
          createAction={action}
        />
      </Card>
    </div>
  );
};

export default Trash;
