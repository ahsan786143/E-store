"use client";
import { USER_PROFILE } from '@/app/routes/UserWebsite';
import ButtonLoading from '@/components/ButtonLoading/ButtonLoading';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import UserPanelLayout from '@/components/website/UserPanelLayout';
import WebsiteBreadcrumb from '@/components/website/WebsiteBreadcrumb';
import useFetch from '@/hooks/useFetch';
import { zSchema } from '@/lib/zodSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useEffect, useState } from 'react'
;
import { useForm } from 'react-hook-form';
const breadcrumb = {
  title: "Profile",
  links: [{ label: "Profile", href: USER_PROFILE }],
};
const ProfilePage = () => {
  const {data: user}= useFetch("/api/profile/get");
  const [loading, setLoading] = useState(false)
  const formSchema = zSchema.pick({
    phone: true,
    name: true,
    address: true,
  })
  const form =useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  })

  useEffect(()=>{

    if(user && user.success){
      const userData = user.data;
      form.reset({
        name: userData?.name,
        phone: userData?.phone,
        address: userData?.address 
      })
    }
  },[user])

  const updateProfile = (values)=>{

  }
  return (
    <div>
      <WebsiteBreadcrumb props={breadcrumb} />
     <UserPanelLayout>
        <div className='shadow rounded'>
          <div className='p-5 text-xl font-semibold border-b'>
            Profile

          </div>
          <div className='p-5'>

          <Form {...form}>
            <form className=' grid md:grid-cols-2 grid-cols-1 gap-5' onSubmit={form.handleSubmit(updateProfile)}>
               <div className='md:col-span-2 col-span-1 flex justify-center items-center'>
                
               // 58:05
               
               </div>
               <div className='mb-5'>
                <FormField
                contorl={form.control}
                name="name"
                render={({field})=>(
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input  type='text' placeholder='Enter Your Name ' {...field}/>
                    </FormControl>
                    <FormMessage/>
                  </FormItem>
                )}
                />

               </div>
               <div className='mb-5'>
                <FormField
                contorl={form.control}
                name="phone"
                render={({field})=>(
                  <FormItem>
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <Input  type='number' placeholder='Enter Your Phone Number ' {...field}/>
                    </FormControl>
                    <FormMessage/>
                  </FormItem>
                )}
                />

               </div>
               <div className='mb-3 md:col-span-2 col-span-1'>
                <FormField
                contorl={form.control}
                name="address"
                render={({field})=>(
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Textarea placeholder='Enter Your Address' {...field}/>
                    </FormControl>
                    <FormMessage/>
                  </FormItem>
                )}
                />

               </div>
               <div className='mb-3 md:col-span-2 col-span-1'>
                <ButtonLoading loading={loading} type="submit" text="Update"  className=" cursor-pointer"/>

               </div>

            </form>
          </Form>
          </div>

        </div>
     </UserPanelLayout>
    </div>
  )
}

export default ProfilePage
