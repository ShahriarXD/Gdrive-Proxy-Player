import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-2xl text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-[linear-gradient(135deg,#5b67ff_0%,#649dff_100%)] text-primary-foreground shadow-[0_16px_40px_-22px_rgba(63,91,255,0.55)] hover:-translate-y-0.5 hover:shadow-[0_20px_46px_-24px_rgba(63,91,255,0.58)]",
        secondary:
          "border border-white/75 bg-white/92 text-secondary-foreground shadow-[0_10px_26px_-18px_rgba(74,88,138,0.18)] hover:bg-white",
        ghost: "text-foreground hover:bg-slate-100/80",
        outline:
          "border border-border bg-white/88 text-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.7)] hover:bg-white",
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
