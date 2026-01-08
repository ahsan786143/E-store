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

const breadcrumbData = [
  { href: ADMIN_DASHBOARD, label: "Home" },
  { href:ADMIN_COUPON_SHOW, label: "Coupon" },
  { href: "", label: "Add Coupon" },
];

const AddCoupon = () => {
  const [isLoading, setIsLoading] = useState(false);
  
 
  const formSchema = zSchema.pick({
    
    code : true,
    discountPercentage: true,
    minShoppingAmount: true,
    validity: true

   
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: { 
    code : "",
    discountPercentage: "",
    minShoppingAmount: "",
    validity: ""

    },
  });



  const onSubmit = async (values) => {
    try {
      setIsLoading(true);
      
      const { data: respones } = await axios.post(
        `/api/coupon/create`,
        values
      );
      if (!respones.success) {
        throw new Error(respones.message);
      }
      showToast("success", respones.message);
      form.reset();
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
          <h4 className="text-x1 font-semibold">Add Coupon</h4>
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
                text=" Add Coupon"
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

export default AddCoupon;
