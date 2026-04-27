import type { FC, JSX } from "hono/jsx";
import { cn } from "@/lib/utils";
import { ChevronRightIcon, MoreHorizontalIcon } from "@/components/ui/icon";

type BreadcrumbProps = JSX.IntrinsicElements["nav"];

export const Breadcrumb: FC<BreadcrumbProps> = ({ children, ...props }) => (
  <nav aria-label="breadcrumb" data-slot="breadcrumb" {...props}>
    {children}
  </nav>
);

type BreadcrumbListProps = JSX.IntrinsicElements["ol"] & {
  autoCollapse?: boolean;
};

export const BreadcrumbList: FC<BreadcrumbListProps> = ({
  class: className,
  autoCollapse = true,
  children,
  ...props
}) => (
  <ol
    data-slot="breadcrumb-list"
    class={cn(
      "text-foreground-soft flex min-w-0 items-center gap-1.5 text-sm @md:flex-wrap @md:gap-2.5 @md:break-words",
      autoCollapse && "[&>li:nth-child(n+3):nth-last-child(n+3)]:@max-md:hidden",
      autoCollapse &&
        "[&:has(>li:nth-child(5))>li:nth-last-child(2)]:@max-md:before:mr-1.5 [&:has(>li:nth-child(5))>li:nth-last-child(2)]:@max-md:before:content-['…']",
      className,
    )}
    {...props}
  >
    {children}
  </ol>
);

type BreadcrumbItemProps = JSX.IntrinsicElements["li"];

export const BreadcrumbItem: FC<BreadcrumbItemProps> = ({
  class: className,
  children,
  ...props
}) => (
  <li
    data-slot="breadcrumb-item"
    class={cn("inline-flex min-w-0 items-center gap-1.5", className)}
    {...props}
  >
    {children}
  </li>
);

type BreadcrumbLinkProps = JSX.IntrinsicElements["a"];

export const BreadcrumbLink: FC<BreadcrumbLinkProps> = ({
  class: className,
  children,
  ...props
}) => (
  <a
    data-slot="breadcrumb-link"
    class={cn("hover:text-foreground transition-colors", className)}
    {...props}
  >
    {children}
  </a>
);

type BreadcrumbPageProps = JSX.IntrinsicElements["span"];

export const BreadcrumbPage: FC<BreadcrumbPageProps> = ({
  class: className,
  children,
  ...props
}) => (
  <span
    data-slot="breadcrumb-page"
    role="link"
    aria-disabled="true"
    aria-current="page"
    class={cn("text-foreground min-w-0 truncate font-normal", className)}
    {...props}
  >
    {children}
  </span>
);

type BreadcrumbSeparatorProps = JSX.IntrinsicElements["li"];

export const BreadcrumbSeparator: FC<BreadcrumbSeparatorProps> = ({
  class: className,
  children,
  ...props
}) => (
  <li
    data-slot="breadcrumb-separator"
    role="presentation"
    aria-hidden="true"
    class={cn("inline-flex shrink-0 items-center [&>svg]:size-3.5", className)}
    {...props}
  >
    {children ?? <ChevronRightIcon class="size-4" />}
  </li>
);

type BreadcrumbEllipsisProps = JSX.IntrinsicElements["span"];

export const BreadcrumbEllipsis: FC<BreadcrumbEllipsisProps> = ({
  class: className,
  ...props
}) => (
  <span
    data-slot="breadcrumb-ellipsis"
    role="presentation"
    aria-hidden="true"
    class={cn("flex size-9 items-center justify-center", className)}
    {...props}
  >
    <MoreHorizontalIcon class="size-4" />
    <span class="sr-only">More</span>
  </span>
);
