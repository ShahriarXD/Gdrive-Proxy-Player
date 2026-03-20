import * as React from "react";

import { cn } from "@/lib/utils";

function Input({ className, type = "text", ...props }: React.ComponentProps<"input">) {
  return (
    <input
      className={cn(
        "flex h-11 w-full rounded-xl border border-border bg-white/75 px-4 text-sm text-foreground shadow-sm outline-none transition focus-visible:ring-4 focus-visible:ring-ring",
        className
      )}
      type={type}
      {...props}
    />
  );
}

export { Input };
