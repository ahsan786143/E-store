import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Image from "next/image";
import React from "react";

dayjs.extend(relativeTime);

const ReviewList = ({ review }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border p-5 hover:shadow-lg transition-all duration-300">
      <div className="flex gap-4">
        {/* Avatar */}
        <div className="w-14 h-14 rounded-full p-[2px] bg-gradient-to-tr from-indigo-500 to-purple-500">
          <div className="relative w-full h-full rounded-full overflow-hidden bg-white">
            <Image
              src={review?.avatar?.url || "/assets/images/img-placeholder.webp"}
              alt={review.reviewedBy || "Anonymous"}
              fill
              className="object-cover"
            />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1">
          {/* Header: Name + Title + Time */}
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-md font-semibold text-gray-800">
                {review.reviewedBy || "Anonymous"}
              </h4>
              {review?.title && (
                <p className="text-sm text-gray-500">{review.title}</p>
              )}
            </div>
            <span className="text-xs text-gray-400">
              {dayjs(review?.createdAt).fromNow()}
            </span>
          </div>

          {/* Rating */}
          {review?.rating && (
            <div className="flex mt-1">
  {Array.from({ length: 5 }).map((_, i) => (
    <span
      key={i}
      className={`text-base ${
        i < review.rating ? "text-yellow-400" : "text-gray-300"
      }`}
    >
      ★
    </span>
  ))}
</div>
        
        
          )}

          {/* Review Text */}
          {review?.review && (
            <p className="mt-2 text-gray-600 text-sm leading-relaxed">
              {review.review}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReviewList;
