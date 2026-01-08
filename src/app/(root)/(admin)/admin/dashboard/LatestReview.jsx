import React from 'react'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Avatar, AvatarImage } from '@/components/ui/avatar'
import { IoStar } from 'react-icons/io5'
const truncateText = (text, maxLength = 12) => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + ".......";
};

const LatestReview = () => {
  return (
      <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Product</TableHead>
          <TableHead>Rating</TableHead>
          
          
        </TableRow>
      </TableHeader>
      <TableBody>
        {Array.from({ length: 10 }).map((_, i) => (
          
          <TableRow key={i}>
            <TableCell className="flex items-center gap-3" >
              <Avatar>
                <AvatarImage src="/assets/images/img-placeholder.webp" />
              </Avatar>
             <span className="text-sm font-medium">
  {truncateText("Product Of the Year")}
</span>

            </TableCell>
            <TableCell >
              <div className='flex item-center'>
                {Array.from({ length: 5 }).map((_, i) => (

                  <span key={i}>
                    <IoStar className='text-yellow-500'/>
                  </span>
                ))

                }

              </div>
            </TableCell>
           
           
          </TableRow>
        ))}
      </TableBody>
    
    </Table>
  )
}

export default LatestReview
