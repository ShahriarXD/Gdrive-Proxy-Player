import * as React from "react";

import { cn } from "@/lib/utils";

function Input({ className, type = "text", ...props }: React.ComponentProps<"input">) {
  return (
    <input
      className={cn(
        "flex h-12 w-full rounded-2xl border border-border bg-white/90 px-4 text-sm text-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.85),0_8px_20px_-18px_rgba(56,72,126,0.2)] outline-none transition focus-visible:ring-4 focus-visible:ring-ring",
        className
      )}
      type={type}
      {...props}
    />
  );
}

export { Input };
