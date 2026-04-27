import type { FC, JSX, PropsWithChildren } from "hono/jsx";
import { cn } from "@/lib/utils";

// Sizing cascades from the parent ToggleGroup via descendant selectors so
// consumers only need to pass `size` once (on the group). The group's size
// variant styles its child `[data-toggle-item]` elements directly.
export const toggleGroupVariants = {
  variant: {
    default: "bg-muted text-foreground-muted",
    outline: "bg-card ring ring-border text-foreground-muted",
  },
  size: {
    default:
      "h-9 p-0.5 [&_[data-toggle-item]]:h-8 [&_[data-toggle-item]]:min-w-7 [&_[data-toggle-item]]:px-3",
    sm: "h-8 p-0.5 [&_[data-toggle-item]]:h-7 [&_[data-toggle-item]]:min-w-7 [&_[data-toggle-item]]:px-2.5 [&_[data-toggle-item]]:rounded-md",
  },
};

export const toggleGroupItemVariants = {
  variant: {
    default:
      "data-[state=on]:bg-card data-[state=on]:text-foreground data-[state=on]:shadow-xs " +
      "data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow",
    outline:
      "data-[state=on]:bg-secondary data-[state=on]:text-foreground " +
      "data-[state=active]:bg-secondary data-[state=active]:text-foreground",
  },
};

type ToggleGroupVariant = keyof typeof toggleGroupVariants.variant;
type ToggleGroupSize = keyof typeof toggleGroupVariants.size;
type ToggleGroupItemVariant = keyof typeof toggleGroupItemVariants.variant;

export const getToggleGroupClasses = (
  variant: ToggleGroupVariant = "default",
  size: ToggleGroupSize = "default",
) =>
  cn(
    "inline-flex items-center justify-center gap-1 rounded-lg",
    toggleGroupVariants.variant[variant],
    toggleGroupVariants.size[size],
  );

export const getToggleGroupItemClasses = (
  variant: ToggleGroupItemVariant = "default",
) =>
  cn(
    "inline-flex items-center justify-center gap-2 rounded-md border border-transparent text-sm font-medium",
    "transition-colors outline-none",
    "hover:bg-secondary hover:text-foreground",
    "focus-visible:border-ring focus-visible:ring-ring/20 focus-visible:ring-[3px]",
    "disabled:pointer-events-none disabled:opacity-50",
    "[&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
    toggleGroupItemVariants.variant[variant],
  );

type ToggleGroupProps = PropsWithChildren<{
  type?: "single" | "multiple";
  variant?: ToggleGroupVariant;
  size?: ToggleGroupSize;
  class?: string;
}>;

type ToggleGroupItemProps = JSX.IntrinsicElements["button"] & {
  value: string;
  variant?: ToggleGroupItemVariant;
};

export const ToggleGroup: FC<ToggleGroupProps> = ({
  type = "single",
  variant = "default",
  size = "default",
  class: className,
  children,
}) => (
  <div
    data-toggle-group
    data-toggle-type={type}
    role="group"
    class={cn(getToggleGroupClasses(variant, size), className)}
    data-variant={variant}
    data-size={size}
  >
    {children}
  </div>
);

export const ToggleGroupItem: FC<ToggleGroupItemProps> = ({
  value,
  variant = "default",
  class: className,
  children,
  ...props
}) => (
  <button
    data-toggle-item={value}
    data-state="off"
    aria-pressed="false"
    class={cn(getToggleGroupItemClasses(variant), className)}
    {...props}
  >
    {children}
  </button>
);
