import type { FC, JSX } from "hono/jsx";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";

export const sidebarMenuButtonVariants = {
  variant: {
    default: "hover:bg-foreground/5",
    outline: "border border-border hover:bg-foreground/5",
  },
  size: {
    default: "p-2.5 gap-3",
    sm: "p-1.5 gap-2",
    compact: "h-9 px-2.5 gap-2.5",
  },
};

export const dashboardTopChromeClasses = {
  sidebarSection: "px-3 py-3",
  mainRow: "flex h-9 items-center",
};

export const dashboardSidebarWidthClasses = {
  static: "w-64",
  responsive: "w-64 md:w-64 [[data-sidebar-mobile-state=open]_&]:md:w-64",
};

const sidebarMenuItemVariants = {
  variant: {
    default: "",
    outline: "border border-border",
  },
  size: sidebarMenuButtonVariants.size,
};

type SidebarMenuButtonVariant = keyof typeof sidebarMenuButtonVariants.variant;
type SidebarMenuButtonSize = keyof typeof sidebarMenuButtonVariants.size;

const getSidebarMenuButtonClasses = (
  variant: SidebarMenuButtonVariant,
  size: SidebarMenuButtonSize,
) =>
  cn(
    "flex w-full items-center rounded-lg border border-transparent text-left transition-colors",
    sidebarMenuButtonVariants.variant[variant],
    sidebarMenuButtonVariants.size[size],
  );

const getSidebarMenuItemClasses = (
  variant: SidebarMenuButtonVariant,
  size: SidebarMenuButtonSize,
) =>
  cn(
    "flex w-full cursor-default items-center rounded-md text-left transition-colors",
    sidebarMenuItemVariants.variant[variant],
    sidebarMenuItemVariants.size[size],
  );

type SidebarMenuButtonProps = JSX.IntrinsicElements["button"] & {
  variant?: SidebarMenuButtonVariant;
  size?: SidebarMenuButtonSize;
};

export const SidebarMenuButton: FC<SidebarMenuButtonProps> = ({
  variant = "default",
  size = "default",
  class: className,
  children,
  ...props
}) => (
  <button
    data-slot="sidebar-menu-button"
    class={cn(
      getSidebarMenuButtonClasses(variant, size),
      className,
      "outline-none",
      "focus-visible:border-ring focus-visible:ring-ring/20 focus-visible:ring-[3px]",
      "disabled:pointer-events-none disabled:opacity-50",
    )}
    {...props}
  >
    {children}
  </button>
);

type SidebarMenuItemProps = JSX.IntrinsicElements["div"] & {
  variant?: SidebarMenuButtonVariant;
  size?: SidebarMenuButtonSize;
};

export const SidebarMenuItem: FC<SidebarMenuItemProps> = ({
  variant = "default",
  size = "default",
  class: className,
  children,
  ...props
}) => (
  <div
    data-slot="sidebar-menu-item"
    class={cn(getSidebarMenuItemClasses(variant, size), className)}
    {...props}
  >
    {children}
  </div>
);

type SidebarMenuButtonActionProps = JSX.IntrinsicElements["button"];

export const SidebarMenuButtonAction: FC<SidebarMenuButtonActionProps> = ({
  class: className,
  type = "button",
  children,
  ...props
}) => (
  <button
    type={type}
    data-slot="sidebar-menu-button-action"
    class={cn(
      "inline-flex size-6 shrink-0 items-center justify-center rounded-md border border-transparent",
      "text-foreground-muted transition-colors outline-none",
      "hover:bg-foreground/5 hover:text-foreground",
      "focus-visible:border-ring focus-visible:ring-ring/20 focus-visible:ring-[3px]",
      "disabled:pointer-events-none disabled:opacity-50",
      className,
    )}
    {...props}
  >
    {children}
  </button>
);

type SidebarMenuButtonLabelProps = JSX.IntrinsicElements["div"];

export const SidebarMenuButtonLabel: FC<SidebarMenuButtonLabelProps> = ({
  class: className,
  children,
  ...props
}) => (
  <div
    data-slot="sidebar-menu-button-label"
    class={cn("flex-1 min-w-0", className)}
    {...props}
  >
    {children}
  </div>
);

type SidebarMenuButtonTitleProps = JSX.IntrinsicElements["p"];

export const SidebarMenuButtonTitle: FC<SidebarMenuButtonTitleProps> = ({
  class: className,
  children,
  ...props
}) => (
  <p
    data-slot="sidebar-menu-button-title"
    class={cn("truncate text-sm font-medium text-foreground", className)}
    {...props}
  >
    {children}
  </p>
);

type SidebarMenuButtonDescriptionProps = JSX.IntrinsicElements["p"];

export const SidebarMenuButtonDescription: FC<
  SidebarMenuButtonDescriptionProps
> = ({ class: className, children, ...props }) => (
  <p
    data-slot="sidebar-menu-button-description"
    class={cn("truncate text-xs text-foreground-muted", className)}
    {...props}
  >
    {children}
  </p>
);

type SidebarMenuSectionLabelProps = JSX.IntrinsicElements["p"];

export const SidebarMenuSectionLabel: FC<SidebarMenuSectionLabelProps> = ({
  class: className,
  children,
  ...props
}) => (
  <p
    data-slot="sidebar-menu-section-label"
    class={cn("mb-2 px-3 text-xs font-medium text-foreground-soft", className)}
    {...props}
  >
    {children}
  </p>
);

type SidebarMenuDropdownSectionLabelProps = JSX.IntrinsicElements["div"];

export const SidebarMenuDropdownSectionLabel: FC<
  SidebarMenuDropdownSectionLabelProps
> = ({ class: className, children, ...props }) => (
  <div
    data-slot="sidebar-menu-dropdown-section-label"
    class={cn("px-2 py-1.5", className)}
    {...props}
  >
    <Label class="text-xs font-medium text-foreground-soft">{children}</Label>
  </div>
);

type SidebarMenuDropdownProfileProps = JSX.IntrinsicElements["div"] & {
  name: string;
  email: string;
  avatar?: string;
};

export const SidebarMenuDropdownProfile: FC<
  SidebarMenuDropdownProfileProps
> = ({ name, email, avatar, class: className, ...props }) => (
  <div
    data-slot="sidebar-menu-dropdown-profile"
    class={cn("flex items-center gap-2 px-2 py-1.5", className)}
    {...props}
  >
    <Avatar class="size-8">
      {avatar ? (
        <AvatarImage src={avatar} alt={name} />
      ) : (
        <AvatarFallback>
          {name
            .split(" ")
            .map((part) => part[0])
            .join("")
            .slice(0, 2)
            .toUpperCase()}
        </AvatarFallback>
      )}
    </Avatar>
    <div class="min-w-0">
      <p class="truncate text-sm font-medium text-foreground">{name}</p>
      <p class="truncate text-xs text-foreground-muted">{email}</p>
    </div>
  </div>
);
