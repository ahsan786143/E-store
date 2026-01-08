"use client";
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
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
import { FaRegEyeSlash, FaRegEye } from "react-icons/fa";
import Link from "next/link";
import axios from "axios";
import { WEBSITE_LOGIN } from "@/app/routes/UserWebsite";
import { showToast } from "@/lib/showToast";

const RegisterPage = () => {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // pick fields from Zod schema
  const formSchema = zSchema.pick({
    name: true,
    email: true,
    password: true,
    confirmPassword: true,
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const handleRegisterSubmit = async (values) => {
    try {
      setLoading(true);
      const { data: registerResponse } = await axios.post(`/api/auth/register`, values);

      if (!registerResponse.success) {
        throw new Error(registerResponse.message);
      }

      form.reset();
      showToast("success", registerResponse.message);
    } catch (error) {
      showToast("error", error?.response?.data?.message || error.message);    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-[400px] mx-auto mt-10 shadow-xl rounded-2xl">
      <CardContent>
        {/* Logo */}
        <div className="flex justify-center mt-6">
          <img
            src="/assets/images/logo-black.png"
            width="150"
            height="150"
            alt="Logo"
            className="max-w-[200px]"
          />
        </div>

        <div className="text-center mt-4">
          <h1 className="text-3xl font-bold">Create Account</h1>
          <p className="text-gray-600 text-sm">
            Create a new account by filling out the form below.
          </p>
        </div>

        <div className="mt-5">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleRegisterSubmit)} className="space-y-5">
              {/* Name */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input type="text" placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Email */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="example@gmail.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Password */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="********"
                          {...field}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
                        >
                          {showPassword ? <FaRegEye /> : <FaRegEyeSlash />}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Confirm Password */}
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showConfirm ? "text" : "password"}
                          placeholder="********"
                          {...field}
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirm(!showConfirm)}
                          className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
                        >
                          {showConfirm ? <FaRegEye /> : <FaRegEyeSlash />}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Submit */}
              <ButtonLoading loading={loading} type="submit" text="Register" className="w-full" />

              {/* Links */}
              <div className="text-center text-sm">
                <div className="flex justify-center items-center gap-1">
                  <p>Already have an account?</p>
                  <Link href={WEBSITE_LOGIN} className="text-primary underline">
                    Login
                  </Link>
                </div>
                <div className="mt-3">
                  <Link href="#" className="text-primary underline">
                    Forgot Password?
                  </Link>
                </div>
              </div>
            </form>
          </Form>
        </div>
      </CardContent>
    </Card>
  );
};

export default RegisterPage;
