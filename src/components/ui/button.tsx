import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "hover-sheen inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-2xl text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "border border-white/30 bg-[linear-gradient(180deg,rgba(98,113,255,0.96),rgba(92,162,255,0.88))] text-primary-foreground shadow-[0_18px_44px_-22px_rgba(63,91,255,0.48),inset_0_1px_0_rgba(255,255,255,0.28)] hover:-translate-y-0.5 hover:shadow-[0_22px_52px_-24px_rgba(63,91,255,0.56)]",
        secondary:
          "glass-pill text-secondary-foreground hover:-translate-y-0.5 hover:bg-white/88",
        ghost: "text-foreground hover:bg-slate-100/80",
        outline:
          "glass-pill text-foreground hover:-translate-y-0.5 hover:bg-white/86",
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
