"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";

const ButtonLoading = ({ type = "button", text, loading , className, onClick, ...props }) => {
  return (
    <Button
      size="lg"
      variant="default" //  "primary", "outline"
      type={type}
      disabled={loading}
      onClick={onClick}
      className={cn("", className)}
      {...props}
      
    >
      {loading && <Spinner className="animate-spin" />}
      {text}
    </Button>
  );
};

export default ButtonLoading;
