import type { FC, JSX, PropsWithChildren } from "hono/jsx";
import { cn } from "@/lib/utils";

type DropdownMenuProps = PropsWithChildren<{
  class?: string;
}>;

type DropdownMenuTriggerProps = JSX.IntrinsicElements["div"] & {
  asChild?: boolean;
};
type DropdownMenuContentProps = JSX.IntrinsicElements["div"] & {
  align?: "start" | "end";
  side?: "bottom" | "top";
};
const dropdownMenuItemVariants = {
  variant: {
    default:
      "text-foreground hover:bg-secondary focus-visible:bg-secondary data-[highlighted=true]:bg-secondary",
    destructive:
      "text-destructive hover:bg-destructive-soft hover:text-destructive focus-visible:bg-destructive-soft focus-visible:text-destructive data-[highlighted=true]:bg-destructive-soft data-[highlighted=true]:text-destructive",
  },
  size: {
    default: "h-8",
    lg: "py-1.5",
  },
};

type DropdownMenuItemProps = JSX.IntrinsicElements["button"] & {
  variant?: keyof typeof dropdownMenuItemVariants.variant;
  size?: keyof typeof dropdownMenuItemVariants.size;
};
type DropdownMenuSeparatorProps = JSX.IntrinsicElements["div"];
type DropdownMenuLabelProps = JSX.IntrinsicElements["div"];

export const DropdownMenu: FC<DropdownMenuProps> = ({
  class: className,
  children,
}) => (
  <div data-dropdown class={cn("relative text-left", className)}>
    {children}
  </div>
);

/**
 * Renders a wrapper `<div data-dropdown-trigger>` around its children. The
 * enhance module sets `aria-expanded` on this wrapper div (NOT the inner
 * button), so any state-dependent styling on child elements should use the
 * `group` pattern:
 *
 *   <DropdownMenuTrigger class="group">
 *     <button>
 *       Label
 *       <ChevronDownIcon class="transition-transform group-aria-expanded:rotate-180" />
 *     </button>
 *   </DropdownMenuTrigger>
 */
export const DropdownMenuTrigger: FC<DropdownMenuTriggerProps> = ({
  asChild,
  class: className,
  children,
  ...props
}) => (
  <div
    data-dropdown-trigger
    class={cn("inline-flex w-fit shrink-0", className)}
    {...props}
  >
    {children}
  </div>
);

export const DropdownMenuContent: FC<DropdownMenuContentProps> = ({
  align = "start",
  side = "bottom",
  class: className,
  children,
  ...props
}) => (
  <div
    data-dropdown-content
    data-state="closed"
    data-side={side}
    data-align={align}
    role="menu"
    hidden
    class={cn(
      "absolute z-[100] min-w-[8rem] overflow-hidden",
      "rounded-xl bg-popover p-1 text-foreground shadow-md flex flex-col gap-1",
      "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95",
      "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
      "data-[state=closed]:hidden",
      side === "top" ? "bottom-full mb-1" : "top-full mt-1",
      align === "end" ? "right-0" : "left-0",
      className,
    )}
    {...props}
  >
    {children}
  </div>
);

export const DropdownMenuItem: FC<DropdownMenuItemProps> = ({
  variant = "default",
  size = "default",
  class: className,
  children,
  ...props
}) => (
  <button
    data-dropdown-item
    role="menuitem"
    tabindex={-1}
    class={cn(
      "relative flex w-full cursor-default select-none items-center gap-2 text-left",
      "rounded-lg border border-transparent px-2 text-sm outline-none",
      "transition-colors",
      "focus-visible:border-ring focus-visible:ring-ring/20 focus-visible:ring-[3px]",
      "disabled:pointer-events-none disabled:opacity-50",
      "[&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
      dropdownMenuItemVariants.variant[variant],
      dropdownMenuItemVariants.size[size],
      className,
    )}
    {...props}
  >
    {children}
  </button>
);

export const DropdownMenuSeparator: FC<DropdownMenuSeparatorProps> = ({
  class: className,
  ...props
}) => (
  <div
    data-dropdown-separator
    role="separator"
    class={cn("-mx-1 my-1 h-px bg-border-subtle", className)}
    {...props}
  />
);

export const DropdownMenuLabel: FC<DropdownMenuLabelProps> = ({
  class: className,
  children,
  ...props
}) => (
  <div
    data-slot="dropdown-label"
    class={cn("px-2 py-1.5 text-sm font-medium", className)}
    {...props}
  >
    {children}
  </div>
);
