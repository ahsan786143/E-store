"use client";

import {   ADMIN_DASHBOARD, ADMIN_TRASH, ADMIN_PRODUCT_ADD, ADMIN_PRODUCT_SHOW, ADMIN_COUPON_SHOW, ADMIN_COUPON_EDIT, ADMIN_COUPON_ADD } from '@/app/routes/AdminPanel';
import BreadCrumb from '@/components/admin/BreadCrumb';
import DatatableWrapper from '@/components/admin/DatatableWrapper';
import DeleteAction from '@/components/admin/DeleteAction';
import EditAction from '@/components/admin/EditAction';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import {  DT_COUPON_COLUMN } from '@/lib/column';
import { columnConfig } from '@/lib/helperFunction';
import Link from 'next/link';
import React, { useCallback, useMemo } from 'react'
import { FiPlus } from 'react-icons/fi';

const breadcrumbData = [
  { href: ADMIN_DASHBOARD, label: "Home" },
  { href: ADMIN_COUPON_SHOW, label: "Coupon" },

];
const showCoupon = () => {
  const columns = useMemo(() => {
    return columnConfig(DT_COUPON_COLUMN);
    
  }, []);
  const action = useCallback((row, deleteType, handleDelete ) => {
    let actionMenu =[]
    actionMenu.push(<EditAction key="edit"  href={ADMIN_COUPON_EDIT(row.original._id)}/>)
    actionMenu.push(<DeleteAction key="delete" row={row} deleteType={deleteType} handleDelete={handleDelete}/>)
    return actionMenu

  } , []);
  return (
    <div>
      <BreadCrumb breadcrumbData={breadcrumbData} />
      <Card className="py-0 rounded shadow-sm">
        <CardHeader className="pt-3 px-3 border-b">
          
         
           <div className='flex justify-between  item-center gap-0'>
            <h4 className="text-x1 font-semibold"> Show Coupon</h4>
            <Button>
            <FiPlus/>
            <Link href={ADMIN_COUPON_ADD}> New Coupon </Link>
          </Button>
           </div>
          
        </CardHeader>

        <CardContent className="px-0 pt-0">
          <DatatableWrapper 
          queryKey="coupon-data"
          fetchUrl="/api/coupon"
          initialPageSize={10}
          columnsConfig={columns}
          exportEndPoint="/api/coupon/export"
          deleteEndPoint ="/api/coupon/delete"
          deleteType="SD"
          trashView={`${ADMIN_TRASH}?trashof=coupon`}
          createAction={action}
          />
         
        </CardContent>
      </Card>
    </div>
  )
}

export default showCoupon; 
