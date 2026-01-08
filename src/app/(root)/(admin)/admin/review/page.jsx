"use client";

import {   ADMIN_DASHBOARD, ADMIN_TRASH, ADMIN_COUPON_ADD } from '@/app/routes/AdminPanel';
import BreadCrumb from '@/components/admin/BreadCrumb';
import DatatableWrapper from '@/components/admin/DatatableWrapper';
import DeleteAction from '@/components/admin/DeleteAction';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { DT_REVIEW_COLUMN } from '@/lib/column';
import { columnConfig } from '@/lib/helperFunction';
import React, { useCallback, useMemo } from 'react'

const breadcrumbData = [
  { href: ADMIN_DASHBOARD, label: "Home" },
  { href: "", label: "Reviwes" },

];
const ShowReview = () => {
  const columns = useMemo(() => {
    return columnConfig(DT_REVIEW_COLUMN);
    
  }, []);
  const action = useCallback((row, deleteType, handleDelete ) => {
    let actionMenu =[]
    actionMenu.push(<DeleteAction key="delete" row={row} deleteType={deleteType} handleDelete={handleDelete}/>)
    return actionMenu

  } , []);
  return (
    <div>
      <BreadCrumb breadcrumbData={breadcrumbData} />
      <Card className="py-0 rounded shadow-sm">
        <CardHeader className="pt-3 px-3 border-b">
          
         
           <div className='flex justify-between  item-center gap-0'>
            <h4 className="text-x1 font-semibold"> Reviwes</h4>
            
           </div>
          
        </CardHeader>

        <CardContent className="px-0 pt-0">
          <DatatableWrapper 
          queryKey="review-data"
          fetchUrl="/api/review"
          initialPageSize={10}
          columnsConfig={columns}
          exportEndPoint="/api/review/export"
          deleteEndPoint ="/api/review/delete"
          deleteType="SD"
          trashView={`${ADMIN_TRASH}?trashof=review`}
          createAction={action}
          />
         
        </CardContent>
      </Card>
    </div>
  )
}

export default ShowReview; 
