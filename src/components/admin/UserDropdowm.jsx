"use client";

import React from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useSelector } from 'react-redux'
import Link from 'next/link'
import { IoShirtOutline } from 'react-icons/io5'
import { MdOutlineShoppingBag } from 'react-icons/md'
import LogoutButton from './LogoutButton'

const UserDropdowm = () => {

  const auth = useSelector((store)=> store.authStore.auth)
  return (
    <DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Avatar>
  <AvatarImage src="https://github.com/shadcn.png" />
 
</Avatar>

  </DropdownMenuTrigger>
  <DropdownMenuContent className="me-5 w-44" >
    <DropdownMenuLabel>
      <p className='font-semibold'>{auth?.name}</p>
    </DropdownMenuLabel >
    <DropdownMenuSeparator />
    <DropdownMenuItem asChild >
      <Link href="#" className='cursor-pointer'>
      <IoShirtOutline className='mr-2'/>
      New Product
      </Link>
      </DropdownMenuItem>
    <DropdownMenuItem asChild >
      <Link href="#" className='cursor-pointer'>
      <MdOutlineShoppingBag className='mr-2'/>
      Order
       </Link>
      </DropdownMenuItem>

      <LogoutButton/>
    
  </DropdownMenuContent>
</DropdownMenu>
  )
}

export default UserDropdowm
