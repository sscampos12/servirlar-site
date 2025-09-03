import { cn } from "@/lib/utils";
import React from "react";
import Image from "next/image";

export function Logo({ className, ...props }: React.ImgHTMLAttributes<HTMLImageElement>) {
  return (
    <Image
      src="https://i.postimg.cc/dQWcQ6kF/logo-oficial-5.png"
      alt="ServirLar Logo"
      width={180}
      height={40}
      className={cn(className)}
      {...props}
      priority
    />
  );
}
