import { cn } from "@/lib/utils";
import React from "react";

export function Logo({ className, ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="150"
      height="32"
      viewBox="0 0 150 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn(className)}
      {...props}
    >
      {/* Icon */}
      <g>
        <path
          d="M23.5 4.5L12.5 11.5L4 7.5L0 11V27C0 28.1046 0.89543 29 2 29H28C29.1046 29 30 28.1046 30 27V11L23.5 4.5Z"
          fill="hsl(var(--primary))"
        />
        <path
          d="M9.5 19L13.5 23L21.5 15"
          stroke="hsl(var(--primary-foreground))"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      {/* Text */}
      <text 
        x="38" 
        y="22" 
        fontFamily="'PT Sans', sans-serif" 
        fontSize="18" 
        fontWeight="bold" 
        fill="hsl(var(--primary))">
        Ajuda
      </text>
      <text 
        x="95" 
        y="22" 
        fontFamily="'PT Sans', sans-serif" 
        fontSize="18" 
        fontWeight="bold" 
        fill="hsl(var(--muted-foreground))">
        em Casa
      </text>
    </svg>
  );
}
