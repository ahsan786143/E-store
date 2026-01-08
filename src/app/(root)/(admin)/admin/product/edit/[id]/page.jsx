"use client";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useForm } from "react-hook-form";

import {
  ADMIN_CATEGORY_SHOW,
  ADMIN_DASHBOARD,
  ADMIN_PRODUCT_SHOW,
} from "@/app/routes/AdminPanel";
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
import Select from "@/components/Select";
import Editor from "@/components/admin/Editor";
import MediaModel from "@/components/admin/MediaModel";
import Image from "next/image";

const breadcrumbData = [
  { href: ADMIN_DASHBOARD, label: "Home" },
  { href: ADMIN_PRODUCT_SHOW, label: "Products" },
  { href: "", label: "Edit Product" },
];

const EditProduct = ({ params }) => {
  const { id } = use(params);
  const [isLoading, setIsLoading] = useState(false);
  const [categoryOption, setCategoryOption] = useState([]);
  const { data: getCategory } = useFetch(
    `/api/category?deleteType=SD&&size=1000`
  );
  const { data: getProduct, loading: getProductLoading } = useFetch(
    `/api/product/get/${id}`
  );
  // media model state

  const [open, setOpen] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState([]);

  useEffect(() => {
    if (getCategory && getCategory.success) {
      const data = getCategory.data;
      const options = data.map((item) => ({
        value: item._id,
        label: item.name,
      }));
      setCategoryOption(options);
    }
  }, [getCategory]);
  const formSchema = zSchema.pick({
   
    _id: true, 
    name: true,
    slug: true,
    category: true,
    mrp: true,
    sellingPrice: true,
    discountPercentage: true,
    description: true,
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      _id: id,
      name: "",
      slug: "",
      category: "",
      mrp: "",
      sellingPrice: "",
      discountPercentage: "0",
      description: "",
    },
  });

  useEffect(() => {
    if (getProduct && getProduct.success) {
      const product = getProduct.data;
      form.reset({
        _id: product?._id,
        name: product?.name,
        slug: product?.slug,
        category: product?.category,
        mrp: product?.mrp,
        sellingPrice: product?.sellingPrice,
        discountPercentage: product?.discountPercentage,
        description: product?.description,
      });
      if (product.media){
        const media = product.media.map((media)=>({_id:media._id, url:media.secure_url}))
        setSelectedMedia(media)
      }
    }
  }, [getProduct]);
  useEffect(() => {
    const name = form.getValues("name");
    if (name) {
      form.setValue("slug", slugify(name).toLowerCase());
    }
  }, [form.watch("name")]);

  // discountPercentage calculation
  useEffect(() => {
    const mrp = Number(form.getValues("mrp"));
    const sellingPrice = Number(form.getValues("sellingPrice"));

    if (!mrp || !sellingPrice || sellingPrice >= mrp) {
      form.setValue("discountPercentage", 0);
      return;
    }

    const discountPercentage = ((mrp - sellingPrice) / mrp) * 100;
    form.setValue("discountPercentage", Math.round(discountPercentage));
  }, [form.watch("mrp"), form.watch("sellingPrice")]);

  const editor = (event, editor) => {
    const data = editor.getData();
    form.setValue("description", data);
  };

  const onSubmit = async (values) => {
      setIsLoading(true); // <-- add this

    try {
      if (selectedMedia.length <= 0) {
        return showToast("error", "Please select at least one media");
      }
      const mediaIds = selectedMedia.map((media) => media._id);
      values.media = mediaIds;
      const { data: respones } = await axios.put(
        `/api/product/update`,
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
          <h4 className="text-x1 font-semibold">Edit Product</h4>
        </CardHeader>

        <CardContent className="pb-3 ">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-8  "
            >
              <div className="grid grid-cols-2 gap-3 ">
                {/* hidden ID field */}
                <FormField
                  control={form.control}
                  name="_id"
                  render={({ field }) => <input type="hidden" {...field} />}
                />

                <div className="mb-2">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Name <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            placeholder="Enter Product Name"
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
                    name="slug"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Slug<span className="text-red-500">*</span>
                        </FormLabel>
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

                <div className="mb-2">
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Category<span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Select
                            options={categoryOption}
                            selected={field.value}
                            setSelected={field.onChange}
                            isMulti={false}
                            placeholder="Select Category"
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
                    name="mrp"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          MRP<span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Enter MRP"
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
                    name="sellingPrice"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Selling Price<span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Enter Selling Price"
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
                            readOnly
                            placeholder="Enter Discount Percentage"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="mb-5 md:col-span-2">
                  <FormLabel className="mb-2">
                    Description <span className="text-red-500">*</span>
                  </FormLabel>
                  {!getProductLoading && <Editor onChange={editor}  initialData={form.getValues(`description`)} />}

                  <FormMessage></FormMessage>
                </div>
              </div>
              <div className="md:col-span-2 border border-dashed rounded p-5 text-center">
                <MediaModel
                  open={open}
                  setOpen={setOpen}
                  selectedMedia={selectedMedia}
                  setSelectedMedia={setSelectedMedia}
                  isMultiple={true}
                />

                {selectedMedia.length > 0 && (
                  <div className="flex justify-center item-center flex-wrap- mb-3">
                    {selectedMedia.map((media) => (
                      <div key={media._id} className="h-24 w-24 border">
                        <Image
                          src={media.url}
                          alt=""
                          width={100}
                          height={100}
                          className="size-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                )}

                <div
                  onClick={() => setOpen(true)}
                  className="bg-gray-50 dark:bg-card border w-[140px] mx-auto p-5 cursor-pointer"
                >
                  <span className="font-semibold">Select Media</span>
                </div>
              </div>

              <div className="mt-5 ">
                <ButtonLoading
                  loading={isLoading}
                  type="submit"
                  text="Save Changes"
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

export default EditProduct;
