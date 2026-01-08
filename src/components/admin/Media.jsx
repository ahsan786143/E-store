"use client";

import React from "react";
import Image from "next/image";
import { Checkbox } from "../ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "../ui/dropdown-menu";
import { BsThreeDotsVertical } from "react-icons/bs";
import { MdOutlineEdit } from "react-icons/md";
import { IoIosLink } from "react-icons/io";
import { LuTrash } from "react-icons/lu";
import Link from "next/link";
import { showToast } from "@/lib/showToast";
import { ADMIN_MEDIA_EDIT } from "@/app/routes/AdminPanel";

const Media = ({
  media,
  handleDelete,
  deleteType,
  selectedMedia,
  setSelectedMedia,
}) => {
  // Toggle checkbox selection
  const handleCheck = () => {
    if (selectedMedia.includes(media._id)) {
      setSelectedMedia(selectedMedia.filter((id) => id !== media._id));
    } else {
      setSelectedMedia([...selectedMedia, media._id]);
    }
  };

  // Copy media URL to clipboard
  const handleCopy = async (url) => {
    try {
      await navigator.clipboard.writeText(url);
      showToast("success", "Link Copied");
    } catch (err) {
      showToast("error", "Failed to copy");
    }
  };

  // Determine correct delete type for this card
  const getDeleteType = () => {
    if (deleteType === "SD") return "SD"; // Move to Trash
    if (deleteType === "TRASH") return "PD"; // Permanent Delete
    return deleteType;
  };

  return (
    <div className="border border-gray-200 dark:border-gray-800 relative group rounded overflow-hidden">
      {/* Media Image */}
      <Image
        src={media?.secure_url}
        alt={media?.alt || "Media"}
        width={300}
        height={300}
        className="object-cover w-full sm:h-[200px] h-[150px]"
      />

      {/* Top-Right Dropdown */}
      <div className="absolute top-2 right-2 z-20">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="w-7 h-7 flex items-center justify-center rounded-full bg-black/50">
              <BsThreeDotsVertical color="white" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            {/* Show Edit & Copy only in SD (active media) */}
            {deleteType === "SD" && (
              <>
                <DropdownMenuItem asChild>
                  <Link
                    href={ADMIN_MEDIA_EDIT(media._id)}
                    className="flex items-center gap-2"
                  >
                    <MdOutlineEdit />
                    Edit
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleCopy(media?.secure_url)}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <IoIosLink />
                  Copy Link
                </DropdownMenuItem>
              </>
            )}

            {/* Trash / Delete Permanently */}
            <DropdownMenuItem
              onClick={() => handleDelete([media._id], getDeleteType())}
              className="flex items-center gap-2 cursor-pointer"
            >
              <LuTrash color="red" />
              {deleteType === "SD" ? "Move to Trash" : "Delete Permanently"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Top-Left Checkbox */}
      <div className="absolute top-2 left-2 z-20">
        <Checkbox
          checked={selectedMedia.includes(media._id)}
          onCheckedChange={handleCheck}
          className="cursor-pointer border-primary"
        />
      </div>

      {/* Hover Overlay */}
      <div className="w-full h-full absolute top-0 left-0 z-10 transition-all duration-150 ease-in group-hover:bg-black/30" />
    </div>
  );
};

export default Media;
