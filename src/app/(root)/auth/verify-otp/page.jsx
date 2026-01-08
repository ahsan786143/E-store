"use client";
import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useSearchParams, useRouter } from "next/navigation";
import { showToast } from "@/lib/showToast";
import ButtonLoading from "@/components/ButtonLoading/ButtonLoading";

const OTP_LENGTH = 6;

export default function VerifyOtpPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const emailFromQuery = searchParams?.get("email") || "";
  const [email, setEmail] = useState(emailFromQuery);
  const [otpValues, setOtpValues] = useState(Array(OTP_LENGTH).fill(""));
  const inputsRef = useRef([]);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(30);

  useEffect(() => {
    inputsRef.current[0]?.focus();
  }, []);

  useEffect(() => {
    let t;
    if (resendCountdown > 0) {
      t = setTimeout(() => setResendCountdown(resendCountdown - 1), 1000);
    }
    return () => clearTimeout(t);
  }, [resendCountdown]);

  const handleChange = (e, idx) => {
    const val = e.target.value.replace(/\D/g, "").slice(0,1);
    const newArr = [...otpValues];
    newArr[idx] = val;
    setOtpValues(newArr);
    if (val && inputsRef.current[idx + 1]) inputsRef.current[idx + 1].focus();
  };

  const handleKeyDown = (e, idx) => {
    if (e.key === "Backspace" && !otpValues[idx] && inputsRef.current[idx - 1]) {
      inputsRef.current[idx - 1].focus();
    }
  };

  const submitOtp = async () => {
    const otp = otpValues.join("");
    if (otp.length !== OTP_LENGTH) return showToast("error", "Please enter full OTP");
    try {
      setLoading(true);
      const { data } = await axios.post("/api/auth/verify-otp", { email, otp });
      if (!data.success) throw new Error(data.message);
      showToast("success", data.message);
      // store token (localStorage here). If you prefer cookies, switch accordingly.
      localStorage.setItem("token", data.data.token);
      // redirect to dashboard or home
      router.push("/");
    } catch (err) {
      showToast("error", err?.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendCountdown > 0) return;
    try {
      setResendLoading(true);
      const { data } = await axios.post("/api/auth/resend-otp", { email });
      if (!data.success) throw new Error(data.message);
      showToast("success", data.message);
      setResendCountdown(30);
    } catch (err) {
      showToast("error", err?.response?.data?.message || err.message);
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-16 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-semibold text-center mb-4">Verify OTP</h2>
      <p className="text-center mb-4">Enter the 6-digit code sent to <strong>{email}</strong></p>

      <div className="flex justify-center gap-2 mb-4">
        {otpValues.map((val, idx) => (
          <input
            key={idx}
            ref={(el) => (inputsRef.current[idx] = el)}
            value={val}
            onChange={(e) => handleChange(e, idx)}
            onKeyDown={(e) => handleKeyDown(e, idx)}
            className="w-12 h-12 text-center border rounded text-lg"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={1}
          />
        ))}
      </div>

      <div className="mb-4">
        <ButtonLoading loading={loading} onClick={submitOtp} text="Verify OTP" className="w-full" />
      </div>

      <div className="text-center">
        <button
          onClick={handleResend}
          disabled={resendCountdown > 0 || resendLoading}
          className="underline text-primary"
        >
          {resendLoading ? "Resending..." : (resendCountdown > 0 ? `Resend OTP (${resendCountdown}s)` : "Resend OTP")}
        </button>
      </div>
    </div>
  );
}
