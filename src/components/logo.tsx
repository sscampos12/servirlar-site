import { cn } from "@/lib/utils";
import { Zap } from "lucide-react";
import React from "react";

export function Logo({ className, ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <Zap
      className={cn("text-primary", className)}
      {...props}
    />
  );
}
