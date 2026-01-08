"use client"
import React from 'react'
import ThemeSwitch from './ThemeSwitch'
import UserDropdowm from './UserDropdowm'
import { Button } from '../ui/button'
import { RiMenuFill } from 'react-icons/ri'
import { useSidebar } from '../ui/sidebar'
import AdminSearch from './AdminSearch'
import AdminMoblieSearch from './AdminMoblieSearch'

const Topbar = () => {
 
     const {toggleSidebar} = useSidebar()
  return (
    <div className=' fixed border h-14 w-full top-0 left-0 z-30 md:ps-72 md:pe-8 px-5 flex justify-between item-center bg-white dark:bg-card'>
        <div className='flex item-center md:hidden'>
         <img
            src="/assets/images/logo-black.png"
            width="150"
            height="150"
            alt="Logo dark"
            className="max-w-[100px] block dark:hidden"
          />

          {/* Dark Logo */}
          <img
            src="/assets/images/logo-white.png"
            width="150"
            height="150"
            alt="Logo light"
            className="max-w-[100px] hidden dark:block"
          />
       
        </div>
       <div className='pt-2 md:block hidden'>
         <AdminSearch/>
       </div>

       <div className=' flex items-center gap-2'>
           <AdminMoblieSearch/>
           <ThemeSwitch/>
           <UserDropdowm/>
           <Button 
            onClick ={toggleSidebar}
           type="button" size="icon" className="ms-2 md:hidden">
            <RiMenuFill/>
           </Button>


       </div>
    </div>
  )
}

export default Topbar
