"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { WEBSITE_LOGIN, WEBSITE_REGISTER } from "@/app/routes/UserWebsite";

const EmailVerification = ({ params }) => {
  const { token } = React.use(params);

  console.log("Token:", token);

  const [isVerified, setIsVerified] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;

    const verifyEmail = async () => {
      try {
        const { data } = await axios.post("/api/auth/verify-email", { token });

        if (data.success) {
          setIsVerified(true);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    verifyEmail();
  }, [token]);

  return (
    <Card className="w-[400px] mx-auto mt-20">
      <CardContent className="p-6 text-center">
        {loading ? (
          <p>Verifying email, please wait...</p>
        ) : isVerified ? (
          <>
            <img src="/assets/images/verified.gif" width={150} className="mx-auto" />
            <h1 className="text-green-600 font-semibold mt-4">
              Email Verified Successfully
            </h1>
            <Button asChild className="mt-4">
              <Link href={WEBSITE_LOGIN}>Login</Link>
            </Button>
          </>
        ) : (
          <>
            <img
              src="/assets/images/verification-failed.gif"
              width={150}
              className="mx-auto"
            />
            <h1 className="text-red-600 font-semibold mt-4">
              Email Verification Failed
            </h1>
            <Button asChild variant="destructive" className="mt-4">
              <Link href={WEBSITE_REGISTER}>Register Again</Link>
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default EmailVerification;
