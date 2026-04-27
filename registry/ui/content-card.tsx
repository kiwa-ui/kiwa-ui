import type { FC, JSX } from "hono/jsx";
import { cn } from "@/lib/utils";

const contentCardPadding = {
  none: "",
  sm: "p-2",
  md: "p-3",
  lg: "p-4",
};

const contentCardOuterPadding = {
  none: "p-0",
  sm: "p-1",
};

type ContentCardProps = JSX.IntrinsicElements["div"] & {
  metadata?: string | JSX.Element;
  headerMetadata?: string | JSX.Element;
  padding?: keyof typeof contentCardPadding;
  outerPadding?: keyof typeof contentCardOuterPadding;
  innerClass?: string;
};

export const ContentCard: FC<ContentCardProps> = ({
  metadata,
  headerMetadata,
  padding = "md",
  outerPadding = "sm",
  innerClass,
  class: className,
  children,
  ...props
}) => (
  <div
    data-slot="content-card"
    class={cn(
      "overflow-hidden rounded-xl bg-muted shadow-sm",
      contentCardOuterPadding[outerPadding],
      "[&_[data-slot=table-header]]:border-border-subtle [&_[data-slot=table-header]_tr]:border-border-subtle [&_[data-slot=table-row]]:border-border-subtle",
      className,
    )}
    {...props}
  >
    {headerMetadata && (
      <div
        class={cn(
          "px-3 pb-2.5 text-xs text-foreground-muted",
          outerPadding === "none" ? "pt-2.5" : "pt-1.5",
        )}
      >
        {headerMetadata}
      </div>
    )}
    <div
      class={cn(
        "rounded-lg bg-card shadow-sm",
        contentCardPadding[padding],
        innerClass,
      )}
    >
      {children}
    </div>
    {metadata && (
      <div
        class={cn(
          "px-3 pt-2.5 text-xs text-foreground-muted",
          outerPadding === "none" ? "pb-2.5" : "pb-1.5",
        )}
      >
        {metadata}
      </div>
    )}
  </div>
);
