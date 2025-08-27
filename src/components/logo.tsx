import { cn } from "@/lib/utils";
import React from "react";

export function Logo({ className, ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="152"
      height="32"
      viewBox="0 0 152 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn(className)}
      {...props}
    >
      <g>
        {/* House Outline (Blue) */}
        <path 
          d="M17.4028 3.03361L30.9361 12.428V28H2V12.428L15.5334 3.03361C16.4429 2.38311 17.6521 2.38311 18.5616 3.03361H17.4028Z" 
          stroke="hsl(var(--primary))" 
          strokeWidth="3.5"
          strokeLinejoin="round"
        />
        {/* Checkmark (Green) */}
        <path 
          d="M6.5 17L13 23.5L26.5 10" 
          stroke="hsl(var(--accent))" 
          strokeWidth="4" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        />
      </g>
      {/* Text */}
      <text 
        x="40" 
        y="23" 
        fontFamily="'Poppins', sans-serif" 
        fontSize="20" 
        fontWeight="bold" 
        fill="hsl(var(--foreground))">
        Servir
      </text>
      <text 
        x="98" 
        y="23" 
        fontFamily="'Poppins', sans-serif" 
        fontSize="20" 
        fontWeight="bold" 
        fill="hsl(var(--accent))">
        Lar
      </text>
    </svg>
  );
}
