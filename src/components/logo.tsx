import { cn } from "@/lib/utils";
import React from "react";

export function Logo({ className, ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="170"
      height="35"
      viewBox="0 0 170 35"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn(className)}
      {...props}
    >
      <path
        d="M29.9521 7.1527C31.5451 5.91836 33.6849 5.86804 35.3283 7.02613L45.8392 14.6468C46.8837 15.3942 47.5 16.5843 47.5 17.8597V30.5C47.5 32.7091 45.7091 34.5 43.5 34.5H9.5C7.29086 34.5 5.5 32.7091 5.5 30.5V17.8597C5.5 16.5843 6.11631 15.3942 7.16082 14.6468L17.6717 7.02613C19.3151 5.86804 21.4549 5.91836 23.0479 7.1527L26.5 10.0244"
        stroke="#A8E6CF"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M17.5 22.5L22.5 27.5L32.5 17.5"
        stroke="#A8E6CF"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <text
        x="55"
        y="26"
        fontFamily="'Poppins', sans-serif"
        fontSize="20"
        fontWeight="bold"
        fill="hsl(var(--primary))"
      >
        Ajuda
      </text>
      <text
        x="105"
        y="26"
        fontFamily="'Poppins', sans-serif"
        fontSize="20"
        fontWeight="bold"
        fill="#A8E6CF"
      >
        em
      </text>
      <text
        x="135"
        y="26"
        fontFamily="'Poppins', sans-serif"
        fontSize="20"
        fontWeight="bold"
        fill="hsl(var(--primary))"
      >
        Casa
      </text>
    </svg>
  );
}
