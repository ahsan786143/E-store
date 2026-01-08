"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { zodResolver } from "@hookform/resolvers/zod";
import { zSchema } from "@/lib/zodSchema";
import { useForm } from "react-hook-form";
import z from "zod";
import ButtonLoading from "@/components/ButtonLoading/ButtonLoading";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { WEBSITE_LOGIN } from "@/app/routes/UserWebsite";
import { showToast } from "@/lib/showToast";
import axios from "axios";
import UpdatePassword from "@/components/UpdatePassword/UpdatePassword";
import OTPVerifcation from "@/components/OTPVerifcation/OTPVerifcation";

const ResetPassword = () => {
  const [emailVerificationLoading, setEmailVerificationLoading] = useState(false);
  const [otpVerificationLoading, setOtpVerificationLoading] = useState(false);
  const [otpEmail, setOtpEmail] = useState("");
  const [isOtpVerified, setIsOtpVerified] = useState(false);

  const formSchema = zSchema.pick({
    email: true,
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  //  Handle Email Verification
  const handleEmailVerification = async (values) => {
    try {
      setEmailVerificationLoading(true);
const { data: sendOtpResponse } = await axios.post(`/api/auth/rest-password/send-otp`, values);
      if (!sendOtpResponse.success) {
        throw new Error(sendOtpResponse.message);
      }

      setOtpEmail(values.email);
      form.reset();
      showToast("success", sendOtpResponse.message);
    } catch (error) {
      showToast("error", error?.response?.data?.message || error.message);
    } finally {
      setEmailVerificationLoading(false);
    }
  };

  //  Handle OTP Verification
  const handleOtpSubmit = async (values) => {
    try {
      setOtpVerificationLoading(true);
      const { data: otpResponse } = await axios.post(`/api/auth/rest-password/verify-otp`, values);

      if (!otpResponse.success) {
        throw new Error(otpResponse.message);
      }

      showToast("success", otpResponse.message);
      setIsOtpVerified(true);
    } catch (error) {
      showToast("error", error?.response?.data?.message || error.message);
    } finally {
      setOtpVerificationLoading(false);
    }
  };

  return (
    <Card  className="w-[400px] mx-auto mt-20">
      <CardContent>
        <div className="flex justify-center">
          <img
            src="/assets/images/logo-black.png"
            width="150"
            height="150"
            alt="Logo"
            className="max-w-[200px]"
          />
        </div>

        {/* Step 1 — Email Form */}
        {!otpEmail ? (
          <>
            <div className="text-center">
              <h1 className="text-3xl font-bold">Reset Password</h1>
              <p>Enter your email to reset your password</p>
            </div>

            <div className="mt-5">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(handleEmailVerification)}
                  className="space-y-8"
                >
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="example@gmail.com"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <ButtonLoading
                    loading={emailVerificationLoading}
                    type="submit"
                    text="Send OTP"
                    className="w-full"
                  />

                  <div className="text-center">
                    <Link href={WEBSITE_LOGIN} className="text-primary underline">
                      Back to Login
                    </Link>
                  </div>
                </form>
              </Form>
            </div>
          </>
        ) : (
          // Step 2 & 3 — OTP or Update Password
          <>
            {!isOtpVerified ? (
              <OTPVerifcation
                email={otpEmail}
                onSubmit={handleOtpSubmit}
                loading={otpVerificationLoading}
              />
            ) : (
              <UpdatePassword email={otpEmail} />
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default ResetPassword;
