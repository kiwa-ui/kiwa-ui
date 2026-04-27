import type { FC, JSX, PropsWithChildren } from "hono/jsx";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { XIcon } from "@/components/ui/icon";

type Side = "top" | "right" | "bottom" | "left";

type SheetProps = PropsWithChildren<{
  id: string;
  open?: boolean;
  side?: Side;
  class?: string;
}>;

type SheetTriggerProps = JSX.IntrinsicElements["button"] & {
  sheetId: string;
};

type SheetContentProps = JSX.IntrinsicElements["div"];
type SheetHeaderProps = JSX.IntrinsicElements["div"];
type SheetFooterProps = JSX.IntrinsicElements["div"];
type SheetTitleProps = JSX.IntrinsicElements["h2"];
type SheetDescriptionProps = JSX.IntrinsicElements["p"];
type SheetCloseProps = JSX.IntrinsicElements["button"];

const sheetVariants = {
  side: {
    top: "inset-x-0 top-0 border-b data-[state=open]:slide-in-from-top data-[state=closed]:slide-out-to-top",
    bottom:
      "inset-x-0 bottom-0 border-t data-[state=open]:slide-in-from-bottom data-[state=closed]:slide-out-to-bottom",
    left: "inset-y-0 left-0 h-full w-3/4 border-r sm:max-w-sm data-[state=open]:slide-in-from-left data-[state=closed]:slide-out-to-left",
    right:
      "inset-y-0 right-0 h-full w-3/4 border-l sm:max-w-sm data-[state=open]:slide-in-from-right data-[state=closed]:slide-out-to-right",
  },
};

export const Sheet: FC<SheetProps> = ({
  id,
  open = false,
  side = "right",
  class: className,
  children,
}) => (
  <div
    data-sheet={id}
    data-sheet-side={side}
    data-state={open ? "open" : "closed"}
    class={cn(
      "fixed inset-0 z-50 hidden",
      "data-[state=open]:block",
      className,
    )}
  >
    {children}
  </div>
);

export const SheetTrigger: FC<SheetTriggerProps> = ({
  sheetId,
  class: className,
  children,
  ...props
}) => (
  <button
    data-sheet-trigger={sheetId}
    aria-expanded="false"
    class={cn(
      "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg border border-transparent text-sm font-medium",
      "h-9 px-4 py-2",
      "bg-primary text-primary-foreground hover:bg-primary/90",
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

export const SheetOverlay: FC<JSX.IntrinsicElements["div"]> = ({
  class: className,
  ...props
}) => (
  <div
    data-sheet-overlay
    class={cn(
      "fixed inset-0 z-50 bg-overlay-scrim",
      "data-[state=open]:animate-in data-[state=open]:fade-in-0",
      "data-[state=closed]:animate-out data-[state=closed]:fade-out-0",
      className,
    )}
    {...props}
  />
);

export const SheetContent: FC<SheetContentProps & { side?: Side }> = ({
  side = "right",
  class: className,
  children,
  ...props
}) => (
  <div
    data-sheet-content
    class={cn(
      "fixed z-50 gap-4 bg-card p-6 shadow-lg",
      "transition-transform duration-300 ease-in-out",
      "data-[state=open]:animate-in data-[state=closed]:animate-out",
      sheetVariants.side[side],
      className,
    )}
    {...props}
  >
    {children}
  </div>
);

export const SheetHeader: FC<SheetHeaderProps> = ({
  class: className,
  children,
  ...props
}) => (
  <div
    data-slot="sheet-header"
    class={cn("flex flex-col gap-2 text-center sm:text-left", className)}
    {...props}
  >
    {children}
  </div>
);

export const SheetFooter: FC<SheetFooterProps> = ({
  class: className,
  children,
  ...props
}) => (
  <div
    data-slot="sheet-footer"
    class={cn(
      "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
      className,
    )}
    {...props}
  >
    {children}
  </div>
);

export const SheetTitle: FC<SheetTitleProps> = ({
  class: className,
  children,
  ...props
}) => (
  <h2
    data-slot="sheet-title"
    class={cn("text-lg text-foreground", className)}
    {...props}
  >
    {children}
  </h2>
);

export const SheetDescription: FC<SheetDescriptionProps> = ({
  class: className,
  children,
  ...props
}) => (
  <p
    data-slot="sheet-description"
    class={cn("text-sm text-foreground-muted", className)}
    {...props}
  >
    {children}
  </p>
);

export const SheetClose: FC<SheetCloseProps> = ({
  class: className,
  children,
  ...props
}) => (
  <Button
    data-sheet-close
    variant="ghost"
    size="iconSm"
    class={cn("absolute right-4 top-4", className)}
    {...props}
  >
    {children || <XIcon class="size-4" />}
    <span class="sr-only">Close</span>
  </Button>
);
