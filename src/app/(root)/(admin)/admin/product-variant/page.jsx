"use client";

import { ADMIN_PRODUCT_EDIT,  ADMIN_DASHBOARD, ADMIN_PRODUCT_, ADMIN_PRODUCT_EDITSHOW, ADMIN_TRASH, ADMIN_PRODUCT_ADD, ADMIN_PRODUCT_SHOW, ADMIN_PRODUCT_VARIANT_SHOW, ADMIN_PRODUCT_VARIANT_EDIT, ADMIN_PRODUCT_VARIANT_ADD } from '@/app/routes/AdminPanel';
import BreadCrumb from '@/components/admin/BreadCrumb';
import DatatableWrapper from '@/components/admin/DatatableWrapper';
import DeleteAction from '@/components/admin/DeleteAction';
import EditAction from '@/components/admin/EditAction';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { DT_PRODUCT_VARIANT_COLUMN } from '@/lib/column';
import { columnConfig } from '@/lib/helperFunction';
import Link from 'next/link';
import React, { useCallback, useMemo } from 'react'
import { FiPlus } from 'react-icons/fi';

const breadcrumbData = [
  { href: ADMIN_DASHBOARD, label: "Home" },
  { href: ADMIN_PRODUCT_VARIANT_SHOW, label: "Product Variant" },

];
const ProductVariant = () => {
  const columns = useMemo(() => {
    return columnConfig(DT_PRODUCT_VARIANT_COLUMN);
    
  }, []);
  const action = useCallback((row, deleteType, handleDelete ) => {
    let actionMenu =[]
    actionMenu.push(<EditAction key="edit"  href={ADMIN_PRODUCT_VARIANT_EDIT(row.original._id)}/>)
    actionMenu.push(<DeleteAction key="delete" row={row} deleteType={deleteType} handleDelete={handleDelete}/>)
    return actionMenu

  } , []);
  return (
    <div>
      <BreadCrumb breadcrumbData={breadcrumbData} />
      <Card className="py-0 rounded shadow-sm">
        <CardHeader className="pt-3 px-3 border-b">
          
         
           <div className='flex justify-between  item-center gap-0'>
            <h4 className="text-x1 font-semibold"> Show All Product Varinat </h4>
            <Button>
            <FiPlus/>
            <Link href={ADMIN_PRODUCT_VARIANT_ADD}> New Varinat </Link>
          </Button>
           </div>
          
        </CardHeader>

        <CardContent className="px-0 pt-0">
          <DatatableWrapper 
          queryKey="product-variant-data"
          fetchUrl="/api/product-variant"
          initialPageSize={10}
          columnsConfig={columns}
          exportEndPoint="/api/product-variant/export"
          deleteEndPoint ="/api/product-variant/delete"
          deleteType="SD"
          trashView={`${ADMIN_TRASH}?trashof=product-variant`}
          createAction={action}
          />
         
        </CardContent>
      </Card>
    </div>
  )
}

export default ProductVariant 
