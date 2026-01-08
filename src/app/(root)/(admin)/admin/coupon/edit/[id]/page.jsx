"use client";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useForm } from "react-hook-form";

import {
  ADMIN_CATEGORY_SHOW,
  ADMIN_COUPON_SHOW,
  ADMIN_DASHBOARD,
  ADMIN_PRODUCT_SHOW,
} from "@/app/routes/AdminPanel";
import BreadCrumb from "@/components/admin/BreadCrumb";
import React, { useEffect, useState } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import ButtonLoading from "@/components/ButtonLoading/ButtonLoading";
import { zSchema } from "@/lib/zodSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { showToast } from "@/lib/showToast";
import axios from "axios";
import useFetch from "@/hooks/useFetch";
import dayjs from "dayjs";

const breadcrumbData = [
  { href: ADMIN_DASHBOARD, label: "Home" },
  { href:ADMIN_COUPON_SHOW, label: "Coupon" },
  { href: "", label: "Edit Coupon" },
];

const EditCoupon = ({ params}) => {
  const{id}= React.use(params);
  const [isLoading, setIsLoading] = useState(false);
  const {data: getCouponData} = useFetch(`/api/coupon/get/${id}`);
 
  const formSchema = zSchema.pick({
    _id: true,
    code : true,
    discountPercentage: true,
    minShoppingAmount: true,
    validity: true

   
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: { 
    _id:id,
    code : "",
    discountPercentage: "",
    minShoppingAmount: "",
    validity: ""

    },
  });
 useEffect(() => {
  if(getCouponData && getCouponData.success){
    const coupon = getCouponData.data;
    form.reset({
     _id:coupon._id,
     code:coupon.code,
     discountPercentage:coupon.discountPercentage,
     minShoppingAmount:coupon.minShoppingAmount,
     validity:dayjs(coupon.validity).format("YYYY-MM-DD")
    })
    
    
  }
   
 }, [getCouponData]);


  const onSubmit = async (values) => {
    try {
      setIsLoading(true);
      
      const { data: respones } = await axios.put(
        `/api/coupon/update`,
        values
      );
      if (!respones.success) {
        throw new Error(respones.message);
      }
      showToast("success", respones.message);
    } catch (error) {
      showToast("error", error.message);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div>
      <BreadCrumb breadcrumbData={breadcrumbData} />
      <Card className="py-0 rounded shadow-sm">
        <CardHeader className="pt-3 px-3 border-b">
          <h4 className="text-x1 font-semibold">Edit Coupon</h4>
        </CardHeader>

        <CardContent className="pb-3 ">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-8  "

            >
               <div className="grid grid-cols-2 gap-3 ">

              {/* hidden ID field */}
            

              <div className="mb-2">
                <FormField
                  control={form.control}
                  name="code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Code <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Enter Code"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              
              
              
              
              <div className="mb-2">
                <FormField
                  control={form.control}
                  name="discountPercentage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Discount Percentage
                        <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          
                          placeholder="Enter Discount Percentage"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
             
              <div className="mb-2">
                <FormField
                  control={form.control}
                  name="minShoppingAmount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Min Shopping Amount
                        <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          
                          placeholder="Enter Min Shopping Amount"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="mb-2">
                <FormField
                  control={form.control}
                  name="validity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Validity
                        <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="date"
                          
                         
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
             
                
               </div>
                
              
               <div className="mt-5 ">
                <ButtonLoading
                loading={isLoading}
                type="submit"
                text="Update Coupon"
                className="cursor-pointer"
              />
               </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default EditCoupon;
