"use client";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useForm } from "react-hook-form";

import {
  ADMIN_CATEGORY_SHOW,
  ADMIN_DASHBOARD,
  ADMIN_PRODUCT_SHOW,
  ADMIN_PRODUCT_VARIANT_SHOW,
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
  { href: ADMIN_PRODUCT_VARIANT_SHOW, label: "Products Variant" },
  { href: "", label: "Edit Product Variant" },
];

const EditProduct = ({ params }) => {
  const { id } = use(params);
  const [isLoading, setIsLoading] = useState(false);
  const [productOption, setProductOption] = useState([]);
  const { data: getproduct } = useFetch(
    `/api/product?deleteType=SD&&size=1000`
  );
  const { data: getProduct, loading: getProductLoading } = useFetch(
    `/api/product-variant/get/${id}`

  );

  console.log("getProduct", getProduct);
  // media model state

  const [open, setOpen] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState([]);

  useEffect(() => {
    if (getproduct && getproduct.success) {
      const data = getproduct.data;
      const options = data.map((item) => ({
        value: item._id,
        label: item.name,
      }));
      setProductOption(options);
    }
  }, [getproduct]);
  const formSchema = zSchema.pick({
   
        _id: true,
        product: true,
        sku: true,
        color: true,
        size: true,
        mrp: true,
        sellingPrice: true,
        discountPercentage: true,
        media: true,

  });     /// 9:05 mint ki 

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      _id: "",
        product: "",
        sku: "",
        color: "",
        size: "",
        mrp: "",
        sellingPrice: "",
        discountPercentage: "",

    },
  });

  useEffect(() => {
    if (getProduct && getProduct.success) {
      const product = getProduct.data;
      form.reset({
        _id: product?._id,
        product: product?.product,
        sku: product?.sku,
        color: product?.color,
        size: product?.size,
        mrp: product?.mrp,
        sellingPrice: product?.sellingPrice,
        discountPercentage: product?.discountPercentage,
      });
      if (product.media){
        const media = product.media.map((media)=>({_id:media._id, url:media.secure_url}))
        setSelectedMedia(media)
      }
    }
  }, [getProduct]);
  
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


  const onSubmit = async (values) => {
      setIsLoading(true); // 
    try {
      if (selectedMedia.length <= 0) {
        return showToast("error", "Please select at least one media");
      }
      const mediaIds = selectedMedia.map((media) => media._id);
      values.media = mediaIds;
      const { data: response  } = await axios.put(
        `/api/product-variant/update`,
        values
      );
      if (!response .success) {
        throw new Error(response .message);
      }
      showToast("success", response .message);
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
          <h4 className="text-x1 font-semibold">Edit Product Variant</h4>
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
                    name="product"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Product<span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Select
                            options={productOption}
                            selected={field.value}
                            setSelected={field.onChange}
                            isMulti={false}
                            placeholder="Select Product"
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
                    name="sku"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          SKU<span className="text-red-500">*</span>
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
                    name="size"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Size<span className="text-red-500">*</span>
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
                    name="color"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Color<span className="text-red-500">*</span>
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
                  <div className="flex justify-center items-center flex-wrap- mb-3">
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
