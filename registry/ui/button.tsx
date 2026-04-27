import type { FC, JSX } from "hono/jsx";
import { cn } from "@/lib/utils";

export const buttonVariants = {
  variant: {
    default: "bg-primary text-primary-foreground hover:bg-primary-hover",
    destructive:
      "bg-destructive text-destructive-foreground hover:bg-destructive-hover",
    outline:
      "border border-border bg-card hover:bg-secondary hover:text-foreground",
    secondary:
      "bg-secondary text-secondary-foreground hover:bg-secondary-hover",
    ghost: "text-foreground-muted hover:bg-foreground/5 hover:text-foreground",
    link: "text-primary underline-offset-4 hover:underline",
    "link-foreground":
      "text-foreground underline-offset-4 hover:underline",
    "link-muted":
      "text-foreground-muted underline-offset-4 hover:underline hover:text-foreground",
  },
  size: {
    default: "h-9 px-4 py-2 has-[>svg]:px-3",
    xs: "h-7 rounded-md gap-1 px-2.5 text-xs has-[>svg]:px-2 [&_svg:not([class*=size-])]:size-3.5",
    sm: "h-8 rounded-lg gap-1.5 px-3 has-[>svg]:px-2.5",
    lg: "h-10 rounded-lg px-6 has-[>svg]:px-4",
    icon: "size-9",
    iconSm: "size-8",
    iconXs: "size-7",
  },
};

export const buttonBaseStyles = cn(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg border border-transparent text-sm font-medium",
  "transition-all outline-none",
  "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/20",
  "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  "disabled:pointer-events-none disabled:opacity-50",
  '[&_svg]:pointer-events-none [&_svg:not([class*="size-"])]:size-4 shrink-0 [&_svg]:shrink-0',
);

export function getButtonClasses(
  variant: keyof typeof buttonVariants.variant = "default",
  size: keyof typeof buttonVariants.size = "default",
) {
  return cn(
    buttonBaseStyles,
    buttonVariants.variant[variant],
    buttonVariants.size[size],
  );
}

type ButtonProps = JSX.IntrinsicElements["button"] & {
  variant?: keyof typeof buttonVariants.variant;
  size?: keyof typeof buttonVariants.size;
};

export const Button: FC<ButtonProps> = ({
  variant = "default",
  size = "default",
  class: className,
  children,
  ...props
}) => (
  <button
    data-slot="button"
    class={cn(getButtonClasses(variant, size), className)}
    {...props}
  >
    {children}
  </button>
);
