"use client";

import { ADMIN_CATEGORY_ADD, ADMIN_CATEGORY_EDIT, ADMIN_CATEGORY_SHOW, ADMIN_DASHBOARD, ADMIN_TRASH } from '@/app/routes/AdminPanel';
import BreadCrumb from '@/components/admin/BreadCrumb';
import DatatableWrapper from '@/components/admin/DatatableWrapper';
import DeleteAction from '@/components/admin/DeleteAction';
import EditAction from '@/components/admin/EditAction';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { DT_CATEGORY_COLUMN } from '@/lib/column';
import { columnConfig } from '@/lib/helperFunction';
import Link from 'next/link';
import React, { useCallback, useMemo } from 'react'
import { FiPlus } from 'react-icons/fi';

const breadcrumbData = [
  { href: ADMIN_DASHBOARD, label: "Home" },
  { href: ADMIN_CATEGORY_SHOW, label: "Category" },

];
const Category = () => {
  const columns = useMemo(() => {
    return columnConfig(DT_CATEGORY_COLUMN);
    
  }, []);
  const action = useCallback((row, deleteType, handleDelete ) => {
    let actionMenu =[]
    actionMenu.push(<EditAction key="edit"  href={ADMIN_CATEGORY_EDIT(row.original._id)}/>)
    actionMenu.push(<DeleteAction key="delete" row={row} deleteType={deleteType} handleDelete={handleDelete}/>)
    return actionMenu

  } , []);
  return (
    <div>
      <BreadCrumb breadcrumbData={breadcrumbData} />
      <Card className="py-0 rounded shadow-sm">
        <CardHeader className="pt-3 px-3 border-b">
          
         
           <div className='flex justify-between  item-center gap-0'>
            <h4 className="text-x1 font-semibold"> Show All Category</h4>
            <Button>
            <FiPlus/>
            <Link href={ADMIN_CATEGORY_ADD}> New Category </Link>
          </Button>
           </div>
          
        </CardHeader>

        <CardContent className="px-0 pt-0">
          <DatatableWrapper 
          queryKey="category-data"
          fetchUrl="/api/category"
          initialPageSize={10}
          columnsConfig={columns}
          exportEndPoint="/api/category/export"
          deleteEndPoint ="/api/category/delete"
          deleteType="SD"
          trashView={`${ADMIN_TRASH}?trashof=category`}
          createAction={action}
          />
         
        </CardContent>
      </Card>
    </div>
  )
}

export default Category
