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
import axios from "axios";
import { showToast } from "@/lib/showToast";
import { useRouter } from "next/navigation";
import { WEBSITE_LOGIN } from "@/app/routes/UserWebsite";

const UpdatePassword = ({ email }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // pick fields from Zod schema
  const formSchema = zSchema.pick({
    email: true,
    password: true,
    confirmPassword: true,
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: email || "", 
      password: "",
      confirmPassword: "",
    },
  });

  const handlePasswordUpdate = async (values) => {
    try {
      setLoading(true);

      const { data } = await axios.post(`/api/auth/rest-password/update-password/`,values
      );

      if (!data.success) {
        throw new Error(data.message);
      }

      showToast("success", data.message);
      form.reset();
      router.push(WEBSITE_LOGIN);
    } catch (error) {
      showToast("error", error?.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
         <div>
        <div className="text-center mt-4">
          <h1 className="text-3xl font-bold">Update Password</h1>
          <p className="text-gray-600 text-sm">
            Create a new password and confirm it below.
          </p>
        </div>

        <div className="mt-5">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handlePasswordUpdate)}
              className="space-y-5"
            >
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

              {/* Submit Button */}
              <ButtonLoading
                loading={loading}
                type="submit"
                text="Update Password"
                className="w-full"
              />
            </form>
          </Form>
        </div>
        </div>
  );
};

export default UpdatePassword;
