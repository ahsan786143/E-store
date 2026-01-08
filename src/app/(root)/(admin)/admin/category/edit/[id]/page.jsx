"use client";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useForm } from "react-hook-form";

import { ADMIN_CATEGORY_SHOW, ADMIN_DASHBOARD } from "@/app/routes/AdminPanel";
import BreadCrumb from "@/components/admin/BreadCrumb";
import React, { use, useEffect, useState } from "react";
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
import slugify from "slugify";
import { showToast } from "@/lib/showToast";
import axios from "axios";
import useFetch from "@/hooks/useFetch";

const breadcrumbData = [
  { href: ADMIN_DASHBOARD, label: "Home" },
  { href: ADMIN_CATEGORY_SHOW, label: "Category" },
  { href: "", label: "Edit Category" },
];

const EditCategory = ({ params}) => {
   const {id} = use(params)
   const {data: categoryData}= useFetch(`/api/category/get/${id}`)

  const [isLoading, setIsLoading] = useState(false);
  const formSchema = zSchema.pick({
    _id: true, 
    name: true,
    slug: true,
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      _id: id,
      name: "",
      slug: "",
    },
  });

  useEffect(() => {
    if(categoryData && categoryData.success){
      const  data = categoryData.data
      form.reset({
        _id: data?._id,
        name: data?.name,
        slug: data?.slug
      })
    }
    
  },[categoryData])

  useEffect(() => {
    const name = form.getValues("name");
    if (name) {
      form.setValue("slug", slugify(name).toLowerCase());
    }
  }, [form.watch("name")]);
  const onSubmit = async (values) => {
    try {
      const { data: respones } = await axios.put(
        `/api/category/update`,
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
          <h4 className="text-x1 font-semibold">Edit Category</h4>
        </CardHeader>

        <CardContent className="pb-3">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {/* hidden ID field */}
              <FormField
                control={form.control}
                name="_id"
                render={({ field }) => <input type="hidden" {...field} />}
              />

              <div className="mb-5">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category Name</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder=" Category Name"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="mb-5">
                <FormField
                  control={form.control}
                  name="slug"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Slug Name</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder=" Slug Name"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <ButtonLoading
                loading={isLoading}
                type="submit"
                text=" Update Category"
              />
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default EditCategory;
