"use client";

import axios from 'axios'

import { zSchema } from '@/lib/zodSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Form, FormItem, FormField, FormLabel, FormControl, FormMessage } from '../ui/form'
import { InputOTP, InputOTPGroup, InputOTPSlot } from '../ui/input-otp'
import ButtonLoading from '../ButtonLoading/ButtonLoading'
import { showToast } from '@/lib/showToast'

const OTPVerifcation = ({email, onSubmit, loading}) => {

  const [isResendingOtp, setIsResendingOtp] = useState(false)
  const formSchema = zSchema.pick({
    otp: true,
    email: true 
  })
const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: { 
      otp: "",
       email: email },
  })

  const handleOtpVerification =async (values)=>{
   onSubmit(values)
  }

  const resendOtp = async ()=>{
     try {
                setIsResendingOtp(true);
                const { data: registerResponse } = await axios.post(`/api/auth/resend-otp`, { email });
    
                if (!registerResponse.success) {
                  throw new Error(registerResponse.message);
                }
                
                showToast("success", registerResponse.message);
              } catch (error) {
                  showToast("error", error?.response?.data?.message || error.message);
                } finally {
                setIsResendingOtp(false);
              }
  }
  return (
    <div>
        <Form {...form}>
      <form onSubmit={form.handleSubmit(handleOtpVerification)} className="space-y-8">
        <h1 className='text-2xl font-bold justify-center flex' >Please enter your OTP</h1>
        <p className='text-md justify-center flex'>An OTP has been sent to your email address {email} OTP valid for 10 minutes</p>
        <div className='mb-5 mt-5 flex justify-center'>
        <FormField
  control={form.control}
  name="otp"
  render={({ field }) => (
    <FormItem>
      <FormLabel className="semibold">One Time Password (OTP)</FormLabel>
      <FormControl>
        <InputOTP maxLength={6} {...field}>
          <InputOTPGroup>
            <InputOTPSlot className="text-xl size-10" index={0} />
            <InputOTPSlot className="text-xl size-10"index={1} />
            <InputOTPSlot className="text-xl size-10"index={2} />
            <InputOTPSlot className="text-xl size-10"index={3} />
            <InputOTPSlot className="text-xl size-10"index={4} />
            <InputOTPSlot className="text-xl size-10"index={5} />
          </InputOTPGroup>
        </InputOTP>
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>
        </div>
        
        <div className='mb-4'>
          <ButtonLoading
           loading={loading}
           type="submit"
           text="Verify"
           className="w-full"
           />
           <div className='text-center mt-5'>
            {
              !isResendingOtp ?
              <button 
            onClick={resendOtp}
            type='button' className='text-blue-500 cursor-pointer hover:underline'>
              Resend OTP
            </button>
              : 
              <span>Resending...</span>
            }
            
           </div>
        </div>
        
      </form>
    </Form>
    </div>
  )
}

export default OTPVerifcation
