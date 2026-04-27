import type { FC, JSX, PropsWithChildren } from "hono/jsx";
import { cn } from "@/lib/utils";
import { ChevronDownIcon } from "@/components/ui/icon";

type SelectCustomProps = PropsWithChildren<{
  class?: string;
  name?: string;
  defaultValue?: string;
}>;

type SelectCustomTriggerProps = JSX.IntrinsicElements["button"] & {
  placeholder?: string;
  size?: "default" | "sm";
};

type SelectCustomContentProps = JSX.IntrinsicElements["div"] & {
  align?: "start" | "end";
  side?: "bottom" | "top";
};

const selectCustomItemVariants = {
  variant: {
    default:
      "text-foreground hover:bg-secondary focus-visible:bg-secondary data-[highlighted=true]:bg-secondary",
    destructive:
      "text-destructive hover:bg-destructive-soft hover:text-destructive focus-visible:bg-destructive-soft focus-visible:text-destructive data-[highlighted=true]:bg-destructive-soft data-[highlighted=true]:text-destructive",
  },
};

type SelectCustomItemProps = JSX.IntrinsicElements["div"] & {
  value: string;
  variant?: keyof typeof selectCustomItemVariants.variant;
};

type SelectCustomSeparatorProps = JSX.IntrinsicElements["div"];
type SelectCustomLabelProps = JSX.IntrinsicElements["div"];
type SelectCustomGroupProps = PropsWithChildren<{
  class?: string;
}>;

export const SelectCustom: FC<SelectCustomProps> = ({
  class: className,
  name,
  defaultValue,
  children,
}) => (
  <div
    data-select
    data-select-value={defaultValue}
    class={cn("relative", className)}
  >
    {name && (
      <input
        type="hidden"
        name={name}
        value={defaultValue}
        data-select-hidden-input
      />
    )}
    {children}
  </div>
);

export const SelectCustomTrigger: FC<SelectCustomTriggerProps> = ({
  placeholder = "Select...",
  size = "default",
  class: className,
  children,
  ...props
}) => (
  <button
    type="button"
    data-select-trigger
    aria-haspopup="listbox"
    aria-expanded="false"
    class={cn(
      "inline-flex w-full items-center justify-between gap-2 whitespace-nowrap",
      "rounded-lg border border-input bg-card px-3 text-sm text-foreground",
      "transition-all outline-none",
      "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/20",
      "disabled:pointer-events-none disabled:opacity-50",
      "hover:bg-secondary",
      "[&[aria-expanded=true]>svg:last-child]:rotate-180",
      "[&>svg:last-child]:transition-transform [&>svg:last-child]:duration-200",
      size === "sm" ? "h-8 py-1" : "h-9 py-2",
      className,
    )}
    {...props}
  >
    <span data-select-value-display class="truncate">
      {children || <span class="text-foreground-muted">{placeholder}</span>}
    </span>
    <ChevronDownIcon
      class={cn(
        "shrink-0 text-foreground-muted opacity-50",
        size === "sm" ? "size-3.5" : "size-4",
      )}
    />
  </button>
);

export const SelectCustomContent: FC<SelectCustomContentProps> = ({
  align = "start",
  side = "bottom",
  class: className,
  children,
  ...props
}) => (
  <div
    data-select-content
    data-select-side={side}
    data-select-align={align}
    data-state="closed"
    role="listbox"
    hidden
    class={cn(
      "z-[100] min-w-[8rem] overflow-hidden",
      "rounded-xl bg-popover p-1 text-foreground shadow-md flex flex-col gap-1",
      "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95",
      "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
      "data-[state=closed]:hidden",
      className,
    )}
    {...props}
  >
    {children}
  </div>
);

export const SelectCustomItem: FC<SelectCustomItemProps> = ({
  value,
  variant = "default",
  class: className,
  children,
  ...props
}) => (
  <div
    data-select-item
    data-value={value}
    role="option"
    tabindex={-1}
    class={cn(
      "relative flex w-full cursor-default select-none items-center gap-2 whitespace-nowrap",
      "h-8 rounded-lg border border-transparent px-2 text-sm outline-none",
      "transition-colors",
      "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/20",
      "data-[selected=true]:font-medium",
      "[&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
      selectCustomItemVariants.variant[variant],
      className,
    )}
    {...props}
  >
    {children}
  </div>
);

export const SelectCustomSeparator: FC<SelectCustomSeparatorProps> = ({
  class: className,
  ...props
}) => (
  <div
    data-select-separator
    role="separator"
    class={cn("-mx-1 my-1 h-px bg-border-subtle", className)}
    {...props}
  />
);

export const SelectCustomLabel: FC<SelectCustomLabelProps> = ({
  class: className,
  children,
  ...props
}) => (
  <div
    data-slot="select-label"
    class={cn("px-2 py-1.5 text-sm font-medium", className)}
    {...props}
  >
    {children}
  </div>
);

export const SelectCustomGroup: FC<SelectCustomGroupProps> = ({
  class: className,
  children,
}) => (
  <div data-select-group class={cn("flex flex-col gap-1", className)}>
    {children}
  </div>
);
