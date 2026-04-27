import type { FC, JSX } from "hono/jsx";
import { cn } from "@/lib/utils";

const avatarVariants = {
  size: {
    xs: "size-6 rounded-sm text-[9px]",
    sm: "size-7 rounded-md text-[10px]",
    default: "size-8 rounded-lg text-[10px] border-2",
    lg: "size-9 rounded-lg text-xs border-2",
    xl: "size-12 rounded-xl text-sm border-2",
    "2xl": "size-14 rounded-xl text-base border-2",
  },
};

type AvatarProps = JSX.IntrinsicElements["span"] & {
  size?: keyof typeof avatarVariants.size;
};

export const Avatar: FC<AvatarProps> = ({
  size = "default",
  class: className,
  children,
  ...props
}) => (
  <span
    data-slot="avatar"
    class={cn(
      "relative flex shrink-0 overflow-hidden border border-card bg-muted shadow",
      avatarVariants.size[size],
      className,
    )}
    {...props}
  >
    {children}
  </span>
);

type AvatarImageProps = JSX.IntrinsicElements["img"];

export const AvatarImage: FC<AvatarImageProps> = ({
  class: className,
  alt = "",
  ...props
}) => (
  <img
    data-slot="avatar-image"
    class={cn("aspect-square size-full", className)}
    alt={alt}
    {...props}
  />
);

type AvatarFallbackProps = JSX.IntrinsicElements["span"];

export const AvatarFallback: FC<AvatarFallbackProps> = ({
  class: className,
  children,
  ...props
}) => (
  <span
    data-slot="avatar-fallback"
    class={cn(
      "flex size-full items-center justify-center font-medium leading-none",
      className,
    )}
    {...props}
  >
    {children}
  </span>
);
