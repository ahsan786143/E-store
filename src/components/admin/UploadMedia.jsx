"use client";

import { CldUploadWidget } from "next-cloudinary";
import { FiPlus } from "react-icons/fi";
import { Button } from "../ui/button";
import { showToast } from "@/lib/showToast";
import axios from "axios";

const UploadMedia = ({ isMultiple, queryClient}) => {
  const handleOnError=(error)=>{
    console.error("Cloudinary Upload Error:", error);
    showToast("error", error?.message || "Upload failed");

  }
const handleOnQueuesEnd=async(results)=>{
    const files = results.info.files
    const uploaded = files.filter(file => file.uploadInfo).map(file => ({
      asset_id: file.uploadInfo.asset_id,
      public_id: file.uploadInfo.public_id,
      secure_url: file.uploadInfo.secure_url,
      path: file.uploadInfo.url, 
      thumbnail_url: file.uploadInfo.secure_url, 
    }));
   if(uploaded.length>0){
     try {
       const { data: response } = await axios.post("/api/media/create", uploaded);
        if (!response.success) {
          throw new Error(response.message);
        }
      queryClient.invalidateQueries({ queryKey: ["media-data"], exact: false });
        showToast("success", response.message);
    
     } catch (error) {
      showToast("error", error?.message || "Upload failed");
     }
   }
}
return(
  <CldUploadWidget
  signatureEndpoint="/api/cloudinary-signature"
  uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
  onError={handleOnError}
  onQueuesEnd={handleOnQueuesEnd}

  config={{
    
         cloudName:process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
         apikey:process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY
  }}
  options={{
    cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    multiple: isMultiple,
    sources: ["local", "url", "unsplash", "google_drive"],
  }}
>
  {({ open }) => (
    <Button type="button" onClick={() => open()} className="flex items-center gap-2">
      <FiPlus />
      <span>Upload</span>
    </Button>
  )}
</CldUploadWidget>
)



//   const handleOnError = (error) => {
//     console.error("Cloudinary Upload Error:", error);
//     showToast("error", error?.message || "Upload failed");
//   };

// const handleOnSuccess = async (result) => {
//   const files = result?.info?.files || [];

//   const uploaded = files
//     .filter(file => file.uploadInfo)
//     .map(file => ({
//       asset_id: file.uploadInfo.asset_id,
//       public_id: file.uploadInfo.public_id,
//       secure_url: file.uploadInfo.secure_url,
//       path: file.uploadInfo.url, // FIXED
//       thumbnail_url: file.uploadInfo.secure_url, // FIXED
//     }));

//   if (uploaded.length > 0) {
//     try {
//       const { data } = await axios.post("/api/media/create", { items: uploaded });

//       if (!data.success) throw new Error(data.message);

//       showToast("success", data.message);

//     } catch (error) {
//       showToast("error", error.message);
//     }
//   }
// };

  

//   return (
//     <CldUploadWidget
//       signatureEndpoint="/api/cloudinary-signature"
//       uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
//       onError={handleOnError}
//       onSuccess={handleOnSuccess}
//       config={{
//         cloud :{
//           cloudName:process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
//         apiKey: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,

//         }
        

//       }}
//       options={{
//         cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
//         multiple: isMultiple,
//         sources: ["local", "url", "unsplash", "google_drive"],
//       }}
//     >
//       {({ open }) => (
//         <Button type="button" onClick={() => open()} className="flex items-center gap-2">
//           <FiPlus /> Upload Media
//         </Button>
//       )}
//     </CldUploadWidget>
//   );
};

export default UploadMedia;
