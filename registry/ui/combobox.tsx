import type { FC, JSX, PropsWithChildren } from "hono/jsx";
import { cn } from "@/lib/utils";
import { ChevronDownIcon, SearchIcon, XIcon } from "@/components/ui/icon";

type ComboboxProps = PropsWithChildren<{
  class?: string;
  name?: string;
  defaultValue?: string;
  placeholder?: string;
}>;

type ComboboxTriggerProps = JSX.IntrinsicElements["button"] & {
  size?: "default" | "sm";
};

type ComboboxContentProps = JSX.IntrinsicElements["div"] & {
  align?: "start" | "end";
  side?: "bottom" | "top";
};

type ComboboxInputProps = JSX.IntrinsicElements["input"];

type ComboboxListProps = JSX.IntrinsicElements["div"];

type ComboboxEmptyProps = JSX.IntrinsicElements["div"];

const comboboxItemVariants = {
  variant: {
    default:
      "text-foreground hover:bg-secondary focus-visible:bg-secondary data-[highlighted=true]:bg-secondary",
    destructive:
      "text-destructive hover:bg-destructive-soft hover:text-destructive focus-visible:bg-destructive-soft focus-visible:text-destructive data-[highlighted=true]:bg-destructive-soft data-[highlighted=true]:text-destructive",
  },
};

type ComboboxItemProps = JSX.IntrinsicElements["button"] & {
  value: string;
  keywords?: string;
  variant?: keyof typeof comboboxItemVariants.variant;
};

type ComboboxGroupProps = PropsWithChildren<{
  class?: string;
  heading?: string;
}>;

type ComboboxLabelProps = JSX.IntrinsicElements["div"];
type ComboboxSeparatorProps = JSX.IntrinsicElements["div"];

export const Combobox: FC<ComboboxProps> = ({
  class: className,
  name,
  defaultValue,
  placeholder = "Select...",
  children,
}) => (
  <div
    data-combobox
    data-combobox-name={name}
    data-combobox-value={defaultValue}
    data-combobox-placeholder={placeholder}
    class={cn("relative", className)}
  >
    {name && (
      <input
        type="hidden"
        name={name}
        value={defaultValue}
        data-combobox-hidden-input
      />
    )}
    {children}
  </div>
);

export const ComboboxTrigger: FC<ComboboxTriggerProps> = ({
  size = "default",
  class: className,
  children,
  ...props
}) => (
  <button
    type="button"
    data-combobox-trigger
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
    <span class="inline-flex flex-1 min-w-0 items-center gap-1">
      <span
        data-combobox-value-display
        class="truncate text-left"
      >
        {children}
      </span>
      <span
        data-combobox-clear
        role="button"
        aria-label="Clear selection"
        tabindex={-1}
        hidden
        class={cn(
          "inline-flex size-4 shrink-0 items-center justify-center rounded cursor-pointer",
          "text-foreground-muted hover:text-foreground hover:bg-background-subtle transition-colors",
        )}
      >
        <XIcon class="size-3" />
      </span>
    </span>
    <ChevronDownIcon
      class={cn(
        "shrink-0 text-foreground-muted opacity-50",
        size === "sm" ? "size-3.5" : "size-4",
      )}
    />
  </button>
);

export const ComboboxContent: FC<ComboboxContentProps> = ({
  align = "start",
  side = "bottom",
  class: className,
  children,
  ...props
}) => (
  <div
    data-combobox-content
    data-combobox-side={side}
    data-combobox-align={align}
    data-state="closed"
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

export const ComboboxInput: FC<ComboboxInputProps> = ({
  class: className,
  placeholder = "Search...",
  ...props
}) => (
  <div class="flex items-center gap-2 px-2 -mx-1 -mt-1 mb-1 border-b border-border-subtle">
    <SearchIcon class="size-4 shrink-0 text-foreground-muted" />
    <input
      data-combobox-input
      type="text"
      placeholder={placeholder}
      autocomplete="off"
      autocorrect="off"
      spellcheck={false}
      class={cn(
        "flex h-9 w-full rounded-md bg-transparent py-2 text-sm outline-none",
        "placeholder:text-foreground-muted",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    />
  </div>
);

export const ComboboxList: FC<ComboboxListProps> = ({
  class: className,
  children,
  ...props
}) => (
  <div
    data-combobox-list
    class={cn("flex flex-col gap-1 max-h-[300px] overflow-y-auto", className)}
    {...props}
  >
    {children}
  </div>
);

export const ComboboxEmpty: FC<ComboboxEmptyProps> = ({
  class: className,
  children,
  ...props
}) => (
  <div
    data-combobox-empty
    hidden
    class={cn("py-6 text-center text-sm text-foreground-muted", className)}
    {...props}
  >
    {children}
  </div>
);

export const ComboboxGroup: FC<ComboboxGroupProps> = ({
  class: className,
  heading,
  children,
}) => (
  <div data-combobox-group class={cn("flex flex-col gap-1", className)}>
    {heading && (
      <div
        data-slot="combobox-label"
        class="px-2 py-1.5 text-xs font-medium text-foreground-muted"
      >
        {heading}
      </div>
    )}
    {children}
  </div>
);

export const ComboboxLabel: FC<ComboboxLabelProps> = ({
  class: className,
  children,
  ...props
}) => (
  <div
    data-slot="combobox-label"
    class={cn("px-2 py-1.5 text-xs font-medium text-foreground-muted", className)}
    {...props}
  >
    {children}
  </div>
);

export const ComboboxItem: FC<ComboboxItemProps> = ({
  value,
  keywords,
  variant = "default",
  class: className,
  children,
  ...props
}) => (
  <button
    type="button"
    data-combobox-item
    data-value={value}
    data-combobox-keywords={keywords}
    role="option"
    tabindex={-1}
    class={cn(
      "relative flex w-full shrink-0 cursor-default select-none items-center gap-2 whitespace-nowrap text-left",
      "h-8 rounded-lg border border-transparent px-2 text-sm outline-none",
      "transition-colors",
      "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/20",
      "data-[selected=true]:font-medium",
      "[&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
      comboboxItemVariants.variant[variant],
      className,
    )}
    {...props}
  >
    <span data-combobox-item-label class="flex-1 truncate">
      {children}
    </span>
  </button>
);

export const ComboboxSeparator: FC<ComboboxSeparatorProps> = ({
  class: className,
  ...props
}) => (
  <div
    data-combobox-separator
    role="separator"
    class={cn("-mx-1 my-1 h-px bg-border-subtle", className)}
    {...props}
  />
);
