"use client";
import { Card, CardContent } from "@/components/ui/card";
import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { zSchema } from "@/lib/zodSchema";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import ButtonLoading from "@/components/ButtonLoading/ButtonLoading";
import z from "zod";
import { FaRegEyeSlash } from "react-icons/fa";
import { FaRegEye } from "react-icons/fa";
import Link from "next/link";
import {
  USER_DASHBOARD,
  WEBSITE_REGISTER,
  WEBSITE_RESETPASSWORD,
} from "@/app/routes/UserWebsite";
import { showToast } from "@/lib/showToast";
import axios from "axios";
import OTPVerifcation from "@/components/OTPVerifcation/OTPVerifcation";
import { useDispatch } from "react-redux";
import { login } from "@/store/reducer/authReducer";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { ADMIN_DASHBOARD } from "@/app/routes/AdminPanel";

const LoginPage = () => {
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [otpVerificationloading, setOtpVerificationloading] = useState(false);

  const [isTypePassword, setIsTypePassword] = useState(true);
  const [otpEmail, setOtpEmail] = useState("");

  const formSchema = zSchema.pick({ email: true }).extend({
    password: z.string().min(8, { message: "Password field is required" }),
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "", password: "" },
  });

  const handelLoginSubmit = async (values) => {
    try {
      setLoading(true);
      const { data: loginResponse } = await axios.post(
        `/api/auth/login`,
        values
      );

      if (!loginResponse.success) {
        throw new Error(loginResponse.message);
      }
      setOtpEmail(values.email);

      form.reset();
      showToast("success", loginResponse.message);
    } catch (error) {
      showToast("error", error?.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };
  // Otp Verification

  const handelOtpSubmit = async (values) => {
    try {
      setOtpVerificationloading(true);
      const { data: otpResponse } = await axios.post(
        `/api/auth/verify-otp`,
        values
      );

      if (!otpResponse.success) {
        throw new Error(otpResponse.message);
      }
      setOtpEmail("");

      form.reset();
      showToast("success", otpResponse.message);

      dispatch(login(otpResponse.data));
      if (searchParams.has("calback")) {
        router.push(searchParams.get("calback"));
      } else {
        otpResponse.data.role === "admin"
          ? router.push(ADMIN_DASHBOARD)
          : router.push(USER_DASHBOARD);
      }
    } catch (error) {
      showToast("error", error?.response?.data?.message || error.message);
    } finally {
      setOtpVerificationloading(false);
    }
  };

  return (
    <Card className="w-[400px]">
      <CardContent>
        <div className="flex justify-center">
          <img
            src="/assets/images/logo-black.png"
            width="150px"
            height="150px"
            alt="Logo"
            className="max-w-[200px]"
          />
        </div>
        {!otpEmail ? (
          <>
            {" "}
            <div className="text-center">
              <h1 className="text-3xl font-bold"> Login Into Account </h1>
              <p> Login into your account by filling in the form below </p>
            </div>
            <div className="mt-5">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(handelLoginSubmit)}
                  className="space-y-8"
                >
                  <div className="mb-5">
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
                  </div>
                  <div className="mb-5">
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                type={isTypePassword ? "password" : "text"}
                                placeholder="********"
                                {...field}
                              />
                              <button
                                type="button"
                                onClick={() =>
                                  setIsTypePassword(!isTypePassword)
                                }
                                className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
                              >
                                {isTypePassword ? (
                                  <FaRegEyeSlash />
                                ) : (
                                  <FaRegEye />
                                )}
                              </button>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="mb-4">
                    <ButtonLoading
                      loading={loading}
                      type="submit"
                      text="Login"
                      className="w-full"
                    />
                  </div>
                  <div className="text-center">
                    <div className="flex justify-center items-center gap-1">
                      <p>Don't have an account?</p>
                      <Link
                        href={WEBSITE_REGISTER}
                        className="text-primary underline"
                      >
                        {" "}
                        Create Account{" "}
                      </Link>
                    </div>
                    <div className="mt-3">
                      <Link
                        href={WEBSITE_RESETPASSWORD}
                        className="text-primary underline"
                      >
                        {" "}
                        Forgot Password?{" "}
                      </Link>
                    </div>
                  </div>
                </form>
              </Form>
            </div>
          </>
        ) : (
          <OTPVerifcation
            email={otpEmail}
            onSubmit={handelOtpSubmit}
            loading={otpVerificationloading}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default LoginPage;
