import type { FC, JSX } from "hono/jsx";
import { cn } from "@/lib/utils";

type CardProps = JSX.IntrinsicElements["div"];

export const Card: FC<CardProps> = ({
  class: className,
  children,
  ...props
}) => (
  <div
    data-slot="card"
    class={cn(
      "text-foreground flex flex-col gap-4 rounded-xl bg-card py-4 shadow-sm",
      "[&_[data-slot=table-header]]:border-t",
      className,
    )}
    {...props}
  >
    {children}
  </div>
);

export const CardHeader: FC<CardProps> = ({
  class: className,
  children,
  ...props
}) => (
  <div
    data-slot="card-header"
    class={cn(
      "grid auto-rows-min items-center gap-2 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] has-data-[slot=card-description]:grid-rows-[auto_auto] has-data-[slot=card-description]:items-start [.border-b]:pb-6",
      className,
    )}
    {...props}
  >
    {children}
  </div>
);

export const CardTitle: FC<CardProps> = ({
  class: className,
  children,
  ...props
}) => (
  <h3
    data-slot="card-title"
    class={cn("leading-none", className)}
    {...props}
  >
    {children}
  </h3>
);

export const CardDescription: FC<CardProps> = ({
  class: className,
  children,
  ...props
}) => (
  <div
    data-slot="card-description"
    class={cn("text-foreground-muted text-sm", className)}
    {...props}
  >
    {children}
  </div>
);

export const CardAction: FC<CardProps> = ({
  class: className,
  children,
  ...props
}) => (
  <div
    data-slot="card-action"
    class={cn("col-start-2 row-start-1 justify-self-end", className)}
    {...props}
  >
    {children}
  </div>
);

export const CardContent: FC<CardProps> = ({
  class: className,
  children,
  ...props
}) => (
  <div data-slot="card-content" class={cn("px-6", className)} {...props}>
    {children}
  </div>
);

export const CardFooter: FC<CardProps> = ({
  class: className,
  children,
  ...props
}) => (
  <div
    data-slot="card-footer"
    class={cn("flex items-center px-6 [.border-t]:pt-6", className)}
    {...props}
  >
    {children}
  </div>
);
