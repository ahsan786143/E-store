"use client"
import { USER_ORDERS, WEBSITE_ORDER_DETAILS } from '@/app/routes/UserWebsite';
import UserPanelLayout from '@/components/website/UserPanelLayout';
import WebsiteBreadcrumb from '@/components/website/WebsiteBreadcrumb';
import useFetch from '@/hooks/useFetch';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import React from 'react';

const breadcrumb = {
  title: "Orders",
  links: [{ label: "Orders", href: USER_ORDERS }],
};

const page = () => {
  const router       = useRouter();
  const searchParams = useSearchParams();
  const currentPage  = Math.max(1, parseInt(searchParams.get("page") || "1"));

  const { data: ordersData, loading } = useFetch(`/api/user-order?page=${currentPage}&limit=15`);

  const orders     = ordersData?.data?.orders     || [];
  const pagination = ordersData?.data?.pagination || {};

  const goToPage = (p) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", p);
    router.push(`${USER_ORDERS}?${params.toString()}`);
  };

  return (
    <div>
      <WebsiteBreadcrumb props={breadcrumb} />
      <UserPanelLayout>
        <div className='shadow rounded overflow-hidden'>

          <div className='p-4 text-lg font-semibold border-b bg-gray-50'>
            Orders
          </div>

          <div className='px-4 pb-4 pt-4'>
            <div className='overflow-x-auto border rounded-lg'>
              <table className='w-full min-w-[500px]'>
                <thead>
                  <tr className='bg-gray-50'>
                    <th className='text-start px-3 py-2 text-xs border-b text-gray-500 font-medium'>#</th>
                    <th className='text-start px-3 py-2 text-xs border-b text-gray-500 font-medium'>Order ID</th>
                    <th className='text-start px-3 py-2 text-xs border-b text-gray-500 font-medium'>Items</th>
                    <th className='text-start px-3 py-2 text-xs border-b text-gray-500 font-medium'>Amount</th>
                    <th className='text-start px-3 py-2 text-xs border-b text-gray-500 font-medium'>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {loading && (
                    <tr>
                      <td colSpan={5} className='text-center text-gray-400 py-8 text-sm'>
                        Loading...
                      </td>
                    </tr>
                  )}

                  {!loading && orders.length > 0 ? (
                    orders.map((order, i) => (
                      <tr key={order._id} className='border-b last:border-b-0 hover:bg-gray-50 transition-colors'>
                        <td className='px-3 py-2 text-xs text-gray-400'>
                          {(currentPage - 1) * 15 + i + 1}
                        </td>
                        <td className='px-3 py-2 text-xs'>
                          <Link
                            href={WEBSITE_ORDER_DETAILS(order._id)}
                            className='text-primary font-medium hover:underline'
                          >
                            #{order._id?.slice(-6).toUpperCase()}
                          </Link>
                        </td>
                        <td className='px-3 py-2 text-xs text-gray-500'>
                          {order.products?.length || 0}
                        </td>
                        <td className='px-3 py-2 text-xs text-gray-500'>
                          Rs. {order.total || 0}
                        </td>
                        <td className='px-3 py-2 text-xs'>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium
                            ${order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                              order.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                              order.status === 'processing' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-blue-100 text-blue-700'}`}>
                            {order.status || 'pending'}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    !loading && (
                      <tr>
                        <td colSpan={5} className='text-center text-gray-400 py-8 text-sm'>
                          No Order Found
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            {!loading && pagination.totalPages > 1 && (
              <div className='flex items-center justify-between mt-4'>
                <p className='text-xs text-gray-500'>
                  Showing {(currentPage - 1) * 15 + 1}–{Math.min(currentPage * 15, pagination.totalOrders)} of {pagination.totalOrders} orders
                </p>
                <div className='flex items-center gap-2'>
                  <button
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={!pagination.hasPrevPage}
                    className='px-3 py-1.5 text-xs border rounded hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed'
                  >
                    Prev
                  </button>

                  {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                    .filter(p => p === 1 || p === pagination.totalPages || Math.abs(p - currentPage) <= 1)
                    .reduce((acc, p, idx, arr) => {
                      if (idx > 0 && p - arr[idx - 1] > 1) acc.push('...');
                      acc.push(p);
                      return acc;
                    }, [])
                    .map((p, idx) =>
                      p === '...' ? (
                        <span key={`dot-${idx}`} className='text-xs text-gray-400 px-1'>...</span>
                      ) : (
                        <button
                          key={p}
                          onClick={() => goToPage(p)}
                          className={`px-3 py-1.5 text-xs border rounded ${
                            p === currentPage
                              ? 'bg-primary text-white border-primary'
                              : 'hover:bg-gray-50'
                          }`}
                        >
                          {p}
                        </button>
                      )
                    )
                  }

                  <button
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={!pagination.hasNextPage}
                    className='px-3 py-1.5 text-xs border rounded hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed'
                  >
                    Next
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      </UserPanelLayout>
    </div>
  );
};

export default page;