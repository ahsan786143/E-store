import { WEBSITE_HOME } from '@/app/routes/UserWebsite'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const Footer = () => {
  return (
    <footer className='bg-gray border-t'>
      <div className='grid lg:grid-cols-5 md:grid-cols-2 grid-cols-1 gap-10 py-10 lg:px-32 px-4'>
       <div className='lg:col-span-1 md:col-span-2 col-span-1'>
          <Link href={WEBSITE_HOME}>
          <Image
            src="/assets/images/logo-black.png"
            width={150}
            height={150}
            alt="Logo"
            className="lg:w-32 w-24 mb-2"
          />
        </Link>
        <p className='text-gray-500 text-sm'>
          E-store is your trusted online destination for a wide range of products,Offering a convenient and secure shopping experience.
        </p>

       </div>

       <div className='mb'>

       </div>
      </div>
    </footer>
  )
}

export default Footer
