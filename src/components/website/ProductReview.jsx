import React, { useEffect, useState } from "react";
import { IoStar } from "react-icons/io5";
import { Progress } from "../ui/progress";
import { Button } from "../ui/button";
import { useForm } from "react-hook-form";
import { FormField, FormItem, FormMessage, Form } from "../ui/form";
import { Rating } from "@mui/material";
import { zSchema } from "@/lib/zodSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSelector } from "react-redux";
import { Textarea } from "../ui/textarea";
import ButtonLoading from "../ButtonLoading/ButtonLoading";
import { Input } from "../ui/input";
import axios from "axios";
import Link from "next/link";
import { WEBSITE_LOGIN } from "@/app/routes/UserWebsite";
import { showToast } from "@/lib/showToast";
import { useInfiniteQuery } from "@tanstack/react-query";
import ReviewList from "./ReviewList";
import useFetch from "@/hooks/useFetch";

const ProductReview = ({ productId }) => {
  const auth = useSelector((store) => store.authStore.auth);

  const [loading, setLoading] = useState(false);
  const [currentUrl, setCurrentUrl] = useState("");
  const [isReviewed, setIsReviewed] = useState(false);
  const [reviewCount, setReviewCount] = useState();

  /*  Fetch rating summary */
  const { data: reviewDetails } = useFetch(
    `/api/review/details?productId=${productId}`
  );

  useEffect(() => {
    if (reviewDetails?.success) {
      setReviewCount(reviewDetails.data);
    }
  }, [reviewDetails]);

  /*  Capture current URL */
  useEffect(() => {
    if (typeof window !== "undefined") {
      setCurrentUrl(window.location.href);
    }
  }, []);

  /*  Form schema */
  const formSchema = zSchema.pick({
    product: true,
    userId: true,
    rating: true,
    review: true,
    title: true,
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      product: productId,
      userId: auth?._id,
      rating: 0,
      review: "",
      title: "",
    },
  });

  /*  Update userId when auth changes */
  useEffect(() => {
    form.setValue("userId", auth?._id);
  }, [auth, form]);

  /*  Submit Review */
  const handleReviewSubmit = async (values) => {
    setLoading(true);
    try {
      const { data: response } = await axios.post(
        "/api/review/create",
        values
      );

      if (!response.success) {
        throw new Error(response.message);
      }

      form.reset();
      showToast("success", response.message);
    } catch (error) {
      showToast(
        "error",
        error?.response?.data?.message || error.message
      );
    } finally {
      setLoading(false);
    }
  };

  /* Fetch reviews */
  const fetchReview = async (pageParam) => {
    const { data } = await axios.get(
      `/api/review/get?productId=${productId}&page=${pageParam}`
    );

    if (!data.success) {
      throw new Error(data.message);
    }

    return data.data;
  };

  /*Infinite Query */
  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["product-review", productId],
    queryFn: ({ pageParam }) => fetchReview(pageParam),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage?.nextPage,
  });

  return (
    <div className="shadow rounded-lg border bg-white">
      {/* Header */}
      <div className="p-4 md:p-6 bg-gray-50 border-b">
        <h2 className="font-semibold text-2xl">Rating & Reviews</h2>
      </div>

      <div className="p-4 md:p-6 space-y-10">
        {/* Rating Summary */}
        <div className="flex flex-wrap items-center justify-between gap-6">
          <div className="w-full md:w-1/2 flex flex-col md:flex-row gap-8">
            {/* Average Rating */}
            <div className="w-full md:w-[200px] text-center">
              <h4 className="text-5xl md:text-7xl font-bold text-gray-800">
                {reviewCount?.averageRating || 0}
              </h4>

              <div className="flex justify-center gap-1 mt-2 text-xl text-yellow-500">
                {[...Array(5)].map((_, i) => (
                  <IoStar key={i} />
                ))}
              </div>

              <p className="mt-2 text-sm text-gray-500">
                ({reviewCount?.totalReview || 0} Ratings & Reviews)
              </p>
            </div>

            {/* Rating Bars */}
            <div className="flex-1 flex items-center">
              <div className="w-full space-y-3">
                {[5, 4, 3, 2, 1].map((rating) => (
                  <div key={rating} className="flex items-center gap-3">
                    <div className="flex items-center gap-1 w-12 text-sm font-medium text-gray-700">
                      <span>{rating}</span>
                      <IoStar />
                    </div>

                    <Progress
                      value={reviewCount?.percentage?.[rating] || 0}
                      className="flex-1"
                    />

                    <span className="text-sm text-gray-500 w-6 text-right">
                      {reviewCount?.rating?.[rating] || 0}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Write Review Button */}
          <Button
            onClick={() => setIsReviewed(!isReviewed)}
            variant="outline"
            className="px-8"
          >
            Write Review
          </Button>
        </div>

        {/* Write Review Section */}
        {isReviewed && (
          <>
            <h4 className="text-xl font-semibold">Write a Review</h4>

            {!auth ? (
              <>
                <p>You must be logged in to write a review.</p>
                <Button asChild>
                  <Link href={`${WEBSITE_LOGIN}?callback=${currentUrl}`}>
                    Login
                  </Link>
                </Button>
              </>
            ) : (
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(handleReviewSubmit)}
                  className="space-y-6"
                >
                  <FormField
                    control={form.control}
                    name="rating"
                    render={({ field }) => (
                      <FormItem>
                        <Rating
                          size="large"
                          value={field.value}
                          onChange={(_, value) =>
                            field.onChange(value)
                          }
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <Input placeholder="Review title" {...field} />
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="review"
                    render={({ field }) => (
                      <FormItem>
                        <Textarea
                          placeholder="Write your review..."
                          {...field}
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <ButtonLoading
                    loading={loading}
                    type="submit"
                    text="Submit Review"
                  />
                </form>
              </Form>
            )}
          </>
        )}

        {/* Reviews List */}
        <div>
          <div className="flex items-center justify-between border-b pb-4 mb-4">
            <h5 className="text-2xl font-bold">
              {data?.pages[0]?.totalReview || 0} Reviews
            </h5>

            <span className="px-4 py-1.5 text-sm font-medium text-blue-600 bg-blue-50 border rounded-full">
              {data?.pages[0]?.totalReview || 0} Total
            </span>
          </div>

          <div className="space-y-6">
            {data?.pages.map((page) =>
              page.reviews.map((review) => (
                <ReviewList key={review._id} review={review} />
              ))
            )}

            {hasNextPage && (
              <ButtonLoading
                text="Load More"
                loading={isFetchingNextPage}
                onClick={fetchNextPage}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductReview;
