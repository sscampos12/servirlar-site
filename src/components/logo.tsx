import { cn } from "@/lib/utils";
import React from "react";

export function Logo({ className, ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="40"
      height="40"
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn(className)}
      {...props}
    >
      <path
        d="M6.66667 16.6667L20 5L33.3333 16.6667V33.3333C33.3333 34.2538 32.9821 35.1373 32.357 35.7624C31.7319 36.3875 30.8484 36.7388 30 36.7388H10C9.15162 36.7388 8.26811 36.3875 7.64299 35.7624C7.01787 35.1373 6.66667 34.2538 6.66667 33.3333V16.6667Z"
        stroke="#468499"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15 36.6667V20H25V36.6667"
        stroke="#B5A281"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
