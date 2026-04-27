import type { FC, JSX } from "hono/jsx";
import { cn } from "@/lib/utils";

type TableProps = JSX.IntrinsicElements["table"];

export const Table: FC<TableProps> = ({
  class: className,
  children,
  ...props
}) => (
  <div data-slot="table-container" class="relative w-full overflow-x-auto">
    <table
      data-slot="table"
      class={cn("w-full caption-bottom text-sm", className)}
      {...props}
    >
      {children}
    </table>
  </div>
);

type TableHeaderProps = JSX.IntrinsicElements["thead"];

export const TableHeader: FC<TableHeaderProps> = ({
  class: className,
  children,
  ...props
}) => (
  <thead
    data-slot="table-header"
    class={cn("[&_tr]:border-b [&_tr]:border-border [&_tr]:hover:bg-transparent", className)}
    {...props}
  >
    {children}
  </thead>
);

type TableBodyProps = JSX.IntrinsicElements["tbody"];

export const TableBody: FC<TableBodyProps> = ({
  class: className,
  children,
  ...props
}) => (
  <tbody
    data-slot="table-body"
    class={cn("[&_tr:last-child]:border-0", className)}
    {...props}
  >
    {children}
  </tbody>
);

type TableFooterProps = JSX.IntrinsicElements["tfoot"];

export const TableFooter: FC<TableFooterProps> = ({
  class: className,
  children,
  ...props
}) => (
  <tfoot
    data-slot="table-footer"
    class={cn(
      "bg-muted border-t font-medium [&>tr]:last:border-b-0",
      className,
    )}
    {...props}
  >
    {children}
  </tfoot>
);

type TableRowProps = JSX.IntrinsicElements["tr"];

export const TableRow: FC<TableRowProps> = ({
  class: className,
  children,
  ...props
}) => (
  <tr
    data-slot="table-row"
    class={cn(
      "border-b border-border transition-colors",
      "hover:bg-muted/50 data-[state=selected]:bg-background",
      className,
    )}
    {...props}
  >
    {children}
  </tr>
);

type TableHeadProps = JSX.IntrinsicElements["th"];

export const TableHead: FC<TableHeadProps> = ({
  class: className,
  children,
  ...props
}) => (
  <th
    data-slot="table-head"
    class={cn(
      "h-10 px-2 text-left align-middle text-xs font-medium text-foreground-muted whitespace-nowrap",
      "[&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
      className,
    )}
    {...props}
  >
    {children}
  </th>
);

type TableCellProps = JSX.IntrinsicElements["td"];

export const TableCell: FC<TableCellProps> = ({
  class: className,
  children,
  ...props
}) => (
  <td
    data-slot="table-cell"
    class={cn(
      "p-2 align-middle whitespace-nowrap",
      "[&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
      className,
    )}
    {...props}
  >
    {children}
  </td>
);

type TableCaptionProps = JSX.IntrinsicElements["caption"];

export const TableCaption: FC<TableCaptionProps> = ({
  class: className,
  children,
  ...props
}) => (
  <caption
    data-slot="table-caption"
    class={cn("mt-4 text-sm text-foreground-muted", className)}
    {...props}
  >
    {children}
  </caption>
);
