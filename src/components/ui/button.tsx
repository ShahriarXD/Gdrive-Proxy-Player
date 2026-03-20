import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-2xl text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-[linear-gradient(135deg,rgba(90,103,255,1),rgba(80,145,255,0.94))] text-primary-foreground shadow-[0_22px_60px_-26px_rgba(63,91,255,0.72)] hover:-translate-y-0.5 hover:brightness-110",
        secondary:
          "border border-white/70 bg-white/90 text-secondary-foreground shadow-[0_14px_40px_-26px_rgba(74,88,138,0.3)] hover:bg-white",
        ghost: "text-foreground hover:bg-slate-100/80",
        outline:
          "border border-border bg-white/78 text-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.65)] hover:bg-white",
      },
      size: {
        default: "h-11 px-4.5",
        sm: "h-9 px-3.5 text-xs",
        lg: "h-12 px-5.5",
        icon: "size-11 rounded-2xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

type ButtonProps = React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  };

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
