
import { cn } from "@/lib/utils";
import React from "react";

export function Logo({ className, ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="200"
      height="40"
      viewBox="0 0 200 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn(className)}
      {...props}
    >
      {/* Icon Path */}
      <g>
        <path
          d="M28.45 6.36364L15.3 15.9091L8 10.9091L2 15V34C2 35.1046 2.89543 36 4 36H34C35.1046 36 36 35.1046 36 34V15L28.45 6.36364Z"
          fill="hsl(var(--secondary))"
          stroke="hsl(var(--secondary))"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M14.5 22L19 26.5L27.5 18"
          stroke="white"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      {/* Text Elements */}
      <text x="45" y="26" fontFamily="'Poppins', sans-serif" fontSize="20" fontWeight="bold" fill="hsl(var(--primary))">
        Ajuda
      </text>
      <text x="115" y="26" fontFamily="'Poppins', sans-serif" fontSize="20" fontWeight="bold" fill="hsl(var(--secondary))">
        em Casa
      </text>
    </svg>
  );
}
