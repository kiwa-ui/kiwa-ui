import type { FC, JSX, PropsWithChildren } from "hono/jsx";
import { cn } from "@/lib/utils";

type Side = "top" | "right" | "bottom" | "left";
type Align = "start" | "center" | "end";

type PopoverProps = PropsWithChildren<{
  id: string;
  side?: Side;
  align?: Align;
  class?: string;
}>;

type PopoverTriggerProps = JSX.IntrinsicElements["button"] & {
  popoverId: string;
};

type PopoverTitleProps = JSX.IntrinsicElements["div"];
type PopoverDescriptionProps = JSX.IntrinsicElements["p"];
type PopoverCloseProps = JSX.IntrinsicElements["button"];

export const Popover: FC<PopoverProps> = ({
  id,
  side = "bottom",
  align = "center",
  class: className,
  children,
}) => (
  <div
    data-popover={id}
    data-popover-side={side}
    data-popover-align={align}
    data-state="closed"
    hidden
    class={cn(
      "z-50 w-72 rounded-xl bg-popover p-2.5 text-foreground shadow-md outline-none flex flex-col gap-2.5",
      "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95",
      "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
      className,
    )}
  >
    {children}
  </div>
);

export const PopoverTrigger: FC<PopoverTriggerProps> = ({
  popoverId,
  class: className,
  children,
  ...props
}) => (
  <button
    data-popover-trigger={popoverId}
    aria-haspopup="dialog"
    aria-expanded="false"
    class={cn(
      "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium",
      "h-9 px-4 py-2",
      "border bg-card hover:bg-secondary hover:text-foreground",
      "transition-all outline-none",
      "focus-visible:border-ring focus-visible:ring-ring/20 focus-visible:ring-[3px]",
      "disabled:pointer-events-none disabled:opacity-50",
      className,
    )}
    {...props}
  >
    {children}
  </button>
);

export const PopoverTitle: FC<PopoverTitleProps> = ({
  class: className,
  children,
  ...props
}) => (
  <div
    data-slot="popover-title"
    class={cn("text-sm font-medium text-foreground", className)}
    {...props}
  >
    {children}
  </div>
);

export const PopoverDescription: FC<PopoverDescriptionProps> = ({
  class: className,
  children,
  ...props
}) => (
  <p
    data-slot="popover-description"
    class={cn("text-xs text-foreground-muted", className)}
    {...props}
  >
    {children}
  </p>
);

export const PopoverClose: FC<PopoverCloseProps> = ({
  class: className,
  children,
  ...props
}) => (
  <button
    type="button"
    data-popover-close
    aria-label="Close"
    class={cn(
      "inline-flex size-7 shrink-0 items-center justify-center rounded-md text-foreground-muted outline-none",
      "transition-colors hover:bg-foreground/5 hover:text-foreground",
      "focus-visible:border-ring focus-visible:ring-ring/20 focus-visible:ring-[3px]",
      "[&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
      className,
    )}
    {...props}
  >
    {children}
  </button>
);
