import { cn } from "@/lib/utils";
import React from "react";

export function Logo({ className, ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("text-primary", className)}
      {...props}
    >
        <path d="M27 12.15V26.312C27 26.6963 26.6963 27 26.312 27H5.688C5.30375 27 5 26.6963 5 26.312V12.15L16 4L27 12.15Z" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round"/>
        <path d="M11.5 17.5L15 21L21.5 14.5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
