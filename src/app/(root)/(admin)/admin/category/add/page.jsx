"use client";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useForm } from "react-hook-form";

import { ADMIN_CATEGORY_SHOW, ADMIN_DASHBOARD } from "@/app/routes/AdminPanel";
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
import slugify from "slugify";
import { showToast } from "@/lib/showToast";
import axios from "axios";

const breadcrumbData = [
  { href: ADMIN_DASHBOARD, label: "Home" },
  { href: ADMIN_CATEGORY_SHOW, label: "Category" },
  { href: "", label: "Add Category" },
];

const AddCategory = () => {
  const [isLoading, setIsLoading] = useState(false);
  const formSchema = zSchema.pick({
    name: true,
    slug: true,
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      slug: "",
    },
  })

  useEffect(() => {
    const name = form.getValues("name");
    if (name) {
      form.setValue("slug", slugify(name).toLowerCase());
    }
  }, [form.watch("name")]);
  const onSubmit = async (values) => {
    try {
      const { data: respones } = await axios.post(
        `/api/category/create`,
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
          <h4 className="text-x1 font-semibold">Add Category</h4>
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
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Enter Category"
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
                      <FormLabel>Slug</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Enter Slug"
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
                text=" Add Category"
              />
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddCategory;
