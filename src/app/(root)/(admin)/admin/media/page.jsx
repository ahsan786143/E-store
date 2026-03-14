"use client";

import { ADMIN_DASHBOARD, ADMIN_MEDIA_SHOW } from "@/app/routes/AdminPanel";
import BreadCrumb from "@/components/admin/BreadCrumb";
import Media from "@/components/admin/Media";
import UploadMedia from "@/components/admin/UploadMedia";
import ButtonLoading from "@/components/ButtonLoading/ButtonLoading";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import useDeleteMutation from "@/hooks/useDeleteMutation";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import React, { useState, useEffect, Suspense } from "react";

const breadcrumbData = [
  { href: ADMIN_DASHBOARD, label: "Home" },
  { href: "", label: "Media" },
];

// Fix 2: Isolated into its own component so Suspense can wrap useSearchParams
const MediaPageInner = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [deleteType, setDeleteType] = useState("SD");
  const [selectedMedia, setSelectedMedia] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams) {
      const trashof = searchParams.get("trashof");
      setSelectedMedia([]);
      setSelectAll(false);
      setDeleteType(trashof ? "TRASH" : "SD");
    }
  }, [searchParams]);

  // Fix 3: Added withCredentials so cookies (auth token) are sent with request
  const fetchMedia = async (page, deleteType) => {
    const { data: response } = await axios.get(
      `/api/media?page=${page}&limit=10&deleteType=${deleteType}`,
      { withCredentials: true } // FIXED: was missing, caused 401 auth errors
    );
    return response;
  };

  const { data, error, fetchNextPage, hasNextPage, isFetching, status } =
    useInfiniteQuery({
      queryKey: ["media-data", deleteType],
      queryFn: async ({ pageParam = 0 }) =>
        await fetchMedia(pageParam, deleteType === "TRASH" ? "PD" : "SD"),
      initialPageParam: 0,
      getNextPageParam: (lastPage, pages) =>
        lastPage.hasMore ? pages.length : undefined,
    });

  const deleteMutation = useDeleteMutation("/api/media/delete", ["media-data"]);

  const handleDelete = (ids, type) => {
    let confirmDelete = true;
    if (type === "PD") {
      confirmDelete = confirm("Are you sure you want to delete permanently?");
    }
    if (confirmDelete) {
      deleteMutation.mutate({ ids, deleteType: type });
    }
    setSelectAll(false);
    setSelectedMedia([]);
  };

  // Fix 4: selectAll now only runs when explicitly toggled, not on every data change
  const handleSelectAll = () => {
    const next = !selectAll;
    setSelectAll(next);
    if (next) {
      const ids = data?.pages.flatMap((p) => p.mediaData.map((m) => m._id));
      setSelectedMedia(ids || []);
    } else {
      setSelectedMedia([]);
    }
  };

  // Sync selectedMedia if new pages load while selectAll is active
  useEffect(() => {
    if (selectAll && data) {
      const ids = data.pages.flatMap((p) => p.mediaData.map((m) => m._id));
      setSelectedMedia(ids);
    }
  }, [data]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div>
      <BreadCrumb breadcrumbData={breadcrumbData} />
      <Card className="py-0 rounded shadow-sm">
        <CardHeader className="pt-3 px-3 border-b">
          <div className="flex justify-between items-center">
            <h4 className="font-semibold text-xl uppercase">
              {deleteType === "SD" ? "Media" : "Media Trash"}
            </h4>

            <div className="flex items-center gap-5">
              {deleteType === "SD" && (
                <UploadMedia isMultiple={true} queryClient={queryClient} />
              )}

              {/*  Fix 5: Use router.push instead of Link inside Button to avoid nested <a> */}
              {deleteType === "SD" ? (
                <Button
                  variant="destructive"
                  onClick={() => router.push(`${ADMIN_MEDIA_SHOW}?trashof=media`)}
                >
                  Trash
                </Button>
              ) : (
                <Button onClick={() => router.push(ADMIN_MEDIA_SHOW)}>
                  Back To Media
                </Button>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="pb-3">
          {selectedMedia.length > 0 && (
            <div className="py-2 px-3 bg-violet-200 mb-2 rounded flex justify-between items-center">
              <Label className="flex items-center gap-2 cursor-pointer">
                <Checkbox
                  checked={selectAll}
                  onCheckedChange={handleSelectAll}
                  className="border-primary"
                />
                Select All
              </Label>

              <div className="flex gap-2">
                {deleteType === "SD" ? (
                  <Button
                    variant="destructive"
                    onClick={() => handleDelete(selectedMedia, "SD")}
                  >
                    Move To Trash
                  </Button>
                ) : (
                  <>
                    <Button
                      className="bg-green-500 hover:bg-green-600"
                      onClick={() => handleDelete(selectedMedia, "RESTORE")}
                    >
                      Restore
                    </Button>

                    <Button
                      variant="destructive"
                      onClick={() => handleDelete(selectedMedia, "PD")}
                    >
                      Delete Permanently
                    </Button>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Fix 1: "pending" instead of "loading" for TanStack Query v5 */}
          {status === "pending" ? (
            <span className="font-semibold text-lg">Loading...</span>
          ) : status === "error" ? (
            <div className="text-red-500 text-sm">{error.message}</div>
          ) : (
            <>
              {data?.pages &&
                data.pages.flatMap((page) => page.mediaData).length === 0 && (
                  <div className="text-sm mb-4">No Media Found</div>
                )}
              <div className="grid lg:grid-cols-5 sm:grid-cols-3 grid-cols-2 gap-2 mb-5">
                {data?.pages?.map((page, index) => (
                  <React.Fragment key={index}>
                    {page.mediaData.map((m) => (
                      <Media
                        key={m._id}
                        media={m}
                        handleDelete={handleDelete}
                        deleteType={deleteType}
                        selectedMedia={selectedMedia}
                        setSelectedMedia={setSelectedMedia}
                      />
                    ))}
                  </React.Fragment>
                ))}
              </div>
            </>
          )}

          {hasNextPage && (
            <ButtonLoading
              type="button"
              loading={isFetching}
              onClick={() => fetchNextPage()}
              text="Load More"
              className="cursor-pointer"
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

const MediaPage = () => {
  return (
    <Suspense fallback={<div className="p-4 font-semibold">Loading...</div>}>
      <MediaPageInner />
    </Suspense>
  );
};

export default MediaPage;