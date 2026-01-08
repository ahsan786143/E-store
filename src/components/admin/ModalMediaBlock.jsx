import React from 'react'
import { Checkbox } from '../ui/checkbox'
import Image from 'next/image'

const ModalMediaBlock = ({ media, selectedMedia, setSelectedMedia, isMultiple }) => {
  const handleCheck = () => {
    let newSelectedMedia = [];
    const isSelected = selectedMedia.find(m => m._id === media._id) ? true : false;

    if (isMultiple) {
      // Multiple selection
      if (isSelected) {
        newSelectedMedia = selectedMedia.filter(m => m._id !== media._id);
      } else {
        newSelectedMedia = [
          ...selectedMedia,
          {
            _id: media._id,
            url: media.secure_url,
          },
        ];
      }
      setSelectedMedia(newSelectedMedia);
    } else {
      // Single selection
      setSelectedMedia([
        {
          _id: media._id,
          url: media.secure_url,
        },
      ]);
    }
  };
  return (
     <label  htmlFor={media._id} className='border border-gray-200 dark:border-gray-800 relative group rounded overflow-hidden'>
      <div className='absolute top-2 left-2 z-20'>
        <Checkbox
        id={media._id}
        checked = {selectedMedia.find(m => m._id === media._id) ? true: false}
        onCheckedChange = {handleCheck}
        />

      </div>
      <div className='size-full relative '>
        <Image 
        src={media.secure_url}
        alt={media.alt || ""}
        width = {200}
        height = {200}
        className="object-cover md:h-[100px] h-[100px]"
        
        />

      </div>
     </label>
  )
}

export default ModalMediaBlock
