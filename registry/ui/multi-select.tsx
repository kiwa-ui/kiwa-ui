import type { FC, JSX, PropsWithChildren } from "hono/jsx";
import { cn } from "@/lib/utils";
import { CheckIcon, ChevronDownIcon, SearchIcon, XIcon } from "@/components/ui/icon";

type MultiSelectProps = PropsWithChildren<{
  class?: string;
  name?: string;
  defaultValue?: string[];
  placeholder?: string;
  maxDisplay?: number;
}>;

type MultiSelectTriggerProps = JSX.IntrinsicElements["button"] & {
  size?: "default" | "sm";
};

type MultiSelectContentProps = JSX.IntrinsicElements["div"] & {
  align?: "start" | "end";
  side?: "bottom" | "top";
};

type MultiSelectInputProps = JSX.IntrinsicElements["input"];
type MultiSelectListProps = JSX.IntrinsicElements["div"];
type MultiSelectEmptyProps = JSX.IntrinsicElements["div"];

type MultiSelectItemProps = JSX.IntrinsicElements["button"] & {
  value: string;
  keywords?: string;
};

type MultiSelectGroupProps = PropsWithChildren<{
  class?: string;
  heading?: string;
}>;

type MultiSelectLabelProps = JSX.IntrinsicElements["div"];
type MultiSelectSeparatorProps = JSX.IntrinsicElements["div"];

export const MultiSelect: FC<MultiSelectProps> = ({
  class: className,
  name,
  defaultValue = [],
  placeholder = "Select...",
  maxDisplay = 3,
  children,
}) => {
  const initialCsv = defaultValue.join(",");
  return (
    <div
      data-combobox
      data-combobox-multiple="true"
      data-combobox-name={name}
      data-combobox-value={initialCsv}
      data-combobox-placeholder={placeholder}
      data-combobox-max-display={String(maxDisplay)}
      class={cn("relative", className)}
    >
      {name &&
        defaultValue.map((v) => (
          <input
            type="hidden"
            name={name}
            value={v}
            data-combobox-hidden-input
          />
        ))}
      {children}
    </div>
  );
};

export const MultiSelectTrigger: FC<MultiSelectTriggerProps> = ({
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
      "inline-flex w-full items-center justify-between gap-2",
      "rounded-lg border border-input bg-card pl-2 pr-3 text-sm text-foreground",
      "transition-all outline-none",
      "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/20",
      "disabled:pointer-events-none disabled:opacity-50",
      "hover:bg-secondary",
      "[&[aria-expanded=true]>svg:last-child]:rotate-180",
      "[&>svg:last-child]:transition-transform [&>svg:last-child]:duration-200",
      size === "sm" ? "min-h-8 py-1" : "min-h-9 py-1.5",
      className,
    )}
    {...props}
  >
    <span
      data-combobox-value-display
      class="flex flex-1 flex-wrap items-center gap-1 min-w-0 text-left"
    >
      {children}
    </span>
    <ChevronDownIcon
      class={cn(
        "shrink-0 text-foreground-muted opacity-50",
        size === "sm" ? "size-3.5" : "size-4",
      )}
    />
  </button>
);

export const MultiSelectContent: FC<MultiSelectContentProps> = ({
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
      "z-[100] min-w-[12rem] overflow-hidden",
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

export const MultiSelectInput: FC<MultiSelectInputProps> = ({
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

export const MultiSelectList: FC<MultiSelectListProps> = ({
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

export const MultiSelectEmpty: FC<MultiSelectEmptyProps> = ({
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

export const MultiSelectGroup: FC<MultiSelectGroupProps> = ({
  class: className,
  heading,
  children,
}) => (
  <div data-combobox-group class={cn("flex flex-col gap-1", className)}>
    {heading && (
      <div
        data-slot="multi-select-label"
        class="px-2 py-1.5 text-xs font-medium text-foreground-muted"
      >
        {heading}
      </div>
    )}
    {children}
  </div>
);

export const MultiSelectLabel: FC<MultiSelectLabelProps> = ({
  class: className,
  children,
  ...props
}) => (
  <div
    data-slot="multi-select-label"
    class={cn("px-2 py-1.5 text-xs font-medium text-foreground-muted", className)}
    {...props}
  >
    {children}
  </div>
);

export const MultiSelectItem: FC<MultiSelectItemProps> = ({
  value,
  keywords,
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
      "h-8 rounded-lg border border-transparent px-2 text-sm text-foreground outline-none",
      "transition-colors",
      "hover:bg-secondary focus-visible:bg-secondary data-[highlighted=true]:bg-secondary",
      "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/20",
      "data-[selected=true]:font-medium",
      "[&_svg]:pointer-events-none [&_svg]:shrink-0",
      "group/multi-item",
      className,
    )}
    {...props}
  >
    <span
      class={cn(
        "inline-flex size-4 shrink-0 items-center justify-center rounded border border-input bg-card",
        "group-data-[selected=true]/multi-item:bg-primary group-data-[selected=true]/multi-item:border-primary group-data-[selected=true]/multi-item:text-primary-foreground",
      )}
      aria-hidden="true"
    >
      <CheckIcon class="size-3 opacity-0 group-data-[selected=true]/multi-item:opacity-100" />
    </span>
    <span data-combobox-item-label class="flex-1 truncate">
      {children}
    </span>
  </button>
);

export const MultiSelectSeparator: FC<MultiSelectSeparatorProps> = ({
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

export { XIcon as MultiSelectChipRemoveIcon };
