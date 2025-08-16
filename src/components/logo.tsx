import { cn } from "@/lib/utils";
import React from "react";

export function Logo({ className, ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 256 256"
      className={cn("text-primary", className)}
      {...props}
    >
      <g fill="currentColor">
        <path d="M222.8,83.27,144,24.18a24,24,0,0,0-28.16,0L37.19,83.27A24,24,0,0,0,24,103.82V200a24,24,0,0,0,24,24H208a24,24,0,0,0,24-24V103.82A24,24,0,0,0,222.8,83.27ZM208,200H48V103.82L128,44.73l80,59.09Z" />
        <path d="M111.44,168.56a8,8,0,0,1-11.32-11.32l32-32a8,8,0,0,1,11.32,0l48,48a8,8,0,0,1-11.32,11.32L128,141.32Z" />
      </g>
    </svg>
  );
}
