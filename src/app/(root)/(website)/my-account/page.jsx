"use client"
import { USER_DASHBOARD, WEBSITE_ORDER_DETAILS } from '@/app/routes/UserWebsite';
import UserPanelLayout from '@/components/website/UserPanelLayout';
import WebsiteBreadcrumb from '@/components/website/WebsiteBreadcrumb';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react'
import { HiOutlineShoppingBag } from 'react-icons/hi';
import { FaShoppingCart, FaUser } from "react-icons/fa";
import useFetch from '@/hooks/useFetch';
import { useSelector } from 'react-redux';
import Link from 'next/link';

const breadcrumb = {
  title: "Dashboard",
  links: [{ label: "Dashboard", href: USER_DASHBOARD }],
};

const page = () => {
  const router = useRouter();

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role !== "user") {
      router.push("/auth/login");
    }
  }, [router]);

  const { data: dasboardData } = useFetch(`/api/dashboard/user`);
  const cartStore = useSelector(store => store.cartStore);
  const recentOrders = dasboardData?.data?.recentOrders || [];

  return (
    <div>
      <WebsiteBreadcrumb props={breadcrumb} />
      <UserPanelLayout>
        <div className='shadow rounded overflow-hidden'>

          {/* Header */}
          <div className='p-4 text-lg font-semibold border-b bg-gray-50'>
            Dashboard
          </div>

          {/* ✅ Compact Stat Cards — 3 columns */}
          <div className='p-4'>
            <div className='grid grid-cols-1 sm:grid-cols-3 gap-3'>

              {/* Total Orders */}
              <div className='flex items-center gap-3 border rounded-lg p-3 hover:shadow transition-shadow'>
                <div className="w-10 h-10 bg-primary rounded-lg flex justify-center items-center shrink-0">
                  <HiOutlineShoppingBag size={20} className='text-white' />
                </div>
                <div>
                  <p className='text-xs text-gray-400'>Total Orders</p>
                  <h3 className='text-lg font-bold text-gray-700 leading-tight'>
                    {dasboardData?.data?.totalOrder || 0}
                  </h3>
                </div>
              </div>

              {/* Cart Items */}
              <div className='flex items-center gap-3 border rounded-lg p-3 hover:shadow transition-shadow'>
                <div className="w-10 h-10 bg-orange-500 rounded-lg flex justify-center items-center shrink-0">
                  <FaShoppingCart size={18} className='text-white' />
                </div>
                <div>
                  <p className='text-xs text-gray-400'>Items In Cart</p>
                  <h3 className='text-lg font-bold text-gray-700 leading-tight'>
                    {cartStore?.count || 0}
                  </h3>
                </div>
              </div>

              {/* Profile */}
              <div className='flex items-center gap-3 border rounded-lg p-3 hover:shadow transition-shadow'>
                <div className="w-10 h-10 bg-green-500 rounded-lg flex justify-center items-center shrink-0">
                  <FaUser size={16} className='text-white' />
                </div>
                <div>
                  <p className='text-xs text-gray-400'>Profile</p>
                  <h3 className='text-sm font-bold text-gray-700 leading-tight'>
                    My Account
                  </h3>
                </div>
              </div>

            </div>
          </div>

          {/* Recent Orders Table */}
          <div className='px-4 pb-4'>
            <h4 className='text-base font-semibold mb-3'>Recent Orders</h4>

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
                  {recentOrders.length > 0 ? (
                    recentOrders.map((order, i) => (
                      <tr key={order._id} className='border-b last:border-b-0 hover:bg-gray-50 transition-colors'>

                        <td className='px-3 py-2 text-xs text-gray-400'>
                          {i + 1}
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
                    <tr>
                      <td colSpan={5} className='text-center text-gray-400 py-8 text-sm'>
                        No Order Found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </UserPanelLayout>
    </div>
  )
}

export default page