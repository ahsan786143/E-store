"use client";

import React, { use, useEffect, useState } from "react";
import useFetch from "@/hooks/useFetch";
import { ADMIN_DASHBOARD, ADMIN_MEDIA_SHOW } from "@/app/routes/AdminPanel";
import BreadCrumb from "@/components/admin/BreadCrumb";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Form, FormControl, FormField, FormItem,
  FormLabel, FormMessage
} from "@/components/ui/form";
import ButtonLoading from "@/components/ButtonLoading/ButtonLoading";
import { useForm } from "react-hook-form";
import { zSchema } from "@/lib/zodSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { showToast } from "@/lib/showToast";
import axios from "axios";

const breadcrumbData = [
  { href: ADMIN_DASHBOARD, label: "Home" },
  { href: ADMIN_MEDIA_SHOW, label: "Media" },
  { href: "", label: "Edit Media" },
];

const EditMedia = ({ params }) => {
  const { id: rawId } = use(params);
  const id = rawId.trim();
  const encodedId = encodeURIComponent(id);

  const { data: mediaData } = useFetch(`/api/media/get/${encodedId}`);
  const [loading, setLoading] = useState(false);

  const formSchema = zSchema.pick({
    _id: true,
    alt: true,
    title: true,
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      _id: "",
      alt: "",
      title: "",
    },
  });

  useEffect(() => {
    if (mediaData?.success) {
      const data = mediaData.data;
      form.reset({
        _id: data._id,
        alt: data.alt,
        title: data.title,
      });
    }
  }, [mediaData]);

  const onSubmit = async (values) => {
    try {
      setLoading(true);
      const { data: response } = await axios.put(`/api/media/update`, values);

      if (!response.success) {
        throw new Error(response.message);
      }

      showToast("success", response.message);

    } catch (error) {
      showToast("error", error?.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <BreadCrumb breadcrumbData={breadcrumbData} />
      <Card className="py-0 rounded shadow-sm">
        <CardHeader className="pt-3 px-3 border-b">
          <h4 className="text-x1 font-semibold">Edit Media</h4>
        </CardHeader>

        <CardContent className="pb-3">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

              <div className="mb-5">
                <Image
                  src={mediaData?.data?.secure_url || "/assets/images/img-placeholder.webp"}
                  alt={mediaData?.data?.alt || "Image"}
                  width={150}
                  height={150}
                />
              </div>

              {/* hidden ID field */}
              <FormField
                control={form.control}
                name="_id"
                render={({ field }) => (
                  <input type="hidden" {...field} />
                )}
              />

              <div className="mb-5">
                <FormField
                  control={form.control}
                  name="alt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Alt</FormLabel>
                      <FormControl>
                        <Input type="text" placeholder="Enter alt" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="mb-5">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input type="text" placeholder="Enter title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <ButtonLoading
                loading={loading}
                type="submit"
                text="Update Media"
              />
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default EditMedia;
