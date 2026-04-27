import type { FC, JSX } from "hono/jsx";
import { cn } from "@/lib/utils";

const badgeVariants = {
  variant: {
    default:
      "border border-primary/20 bg-primary-soft text-primary [a&]:hover:bg-primary-soft/80",
    secondary:
      "border border-subtle bg-secondary text-secondary-foreground [a&]:hover:bg-secondary-hover",
    destructive:
      "border border-destructive/20 bg-destructive-soft text-destructive [a&]:hover:bg-destructive-soft/80",
    success:
      "border border-success/20 bg-success-soft text-success [a&]:hover:bg-success-soft/80",
    warning:
      "border border-warning/20 bg-warning-soft text-warning-foreground [a&]:hover:bg-warning-soft/80",
    outline:
      "border border-border bg-background-raised text-foreground [a&]:hover:bg-background-subtle [a&]:hover:text-foreground",
    "outline-primary": "border border-border text-primary",
    "outline-destructive": "border border-border text-destructive",
    "outline-success": "border border-border text-success",
    "outline-warning": "border border-border text-warning",
    "outline-info": "border border-border text-info",
  },
};

type BadgeProps = JSX.IntrinsicElements["span"] & {
  variant?: keyof typeof badgeVariants.variant;
};

export const Badge: FC<BadgeProps> = ({
  variant = "default",
  class: className,
  children,
  ...props
}) => (
  <span
    data-slot="badge"
    class={cn(
      "inline-flex items-center justify-center rounded-md px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0",
      "[&>svg]:size-3 gap-1 [&>svg]:pointer-events-none",
      "focus-visible:border-ring focus-visible:ring-ring/20 focus-visible:ring-[3px]",
      "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
      "transition-[color,box-shadow] overflow-hidden",
      badgeVariants.variant[variant],
      className,
    )}
    {...props}
  >
    {children}
  </span>
);
