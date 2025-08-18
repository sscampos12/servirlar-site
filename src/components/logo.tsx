
import { cn } from "@/lib/utils";
import React from "react";

export function Logo({ className, ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="160" // Adjusted width to fit the text
      height="40"
      viewBox="0 0 160 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn(className)}
      {...props}
    >
      {/* Icon Path */}
      <path
        d="M6.66667 16.6667L20 5L33.3333 16.6667V33.3333C33.3333 34.2538 32.9821 35.1373 32.357 35.7624C31.7319 36.3875 30.8484 36.7388 30 36.7388H10C9.15162 36.7388 8.26811 36.3875 7.64299 35.7624C7.01787 35.1373 6.66667 34.2538 6.66667 33.3333V16.6667Z"
        stroke="hsl(var(--primary))"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15 36.6667V20H25V36.6667"
        stroke="hsl(var(--accent))"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Text Elements */}
      <text x="45" y="26" fontFamily="'Poppins', sans-serif" fontSize="20" fontWeight="bold" fill="hsl(var(--primary))">
        Ajuda
      </text>
      <text x="100" y="26" fontFamily="'Poppins', sans-serif" fontSize="20" fontWeight="bold" fill="hsl(var(--secondary-foreground))">
        em
      </text>
      <text x="125" y="26" fontFamily="'Poppins', sans-serif" fontSize="20" fontWeight="bold" fill="hsl(var(--primary))">
        Casa
      </text>
    </svg>
  );
}
