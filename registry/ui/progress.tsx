import type { FC, JSX } from "hono/jsx";
import { cn } from "@/lib/utils";

type ProgressProps = Omit<JSX.IntrinsicElements["div"], "role"> & {
  value?: number;
  max?: number;
};

export const Progress: FC<ProgressProps> = ({
  value = 0,
  max = 100,
  class: className,
  ...props
}) => {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div
      data-slot="progress"
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={max}
      class={cn(
        "relative h-2 w-full overflow-hidden rounded-full bg-primary/20",
        className,
      )}
      {...props}
    >
      <div
        data-slot="progress-indicator"
        class="h-full w-full flex-1 bg-primary transition-all"
        style={{ transform: `translateX(-${100 - percentage}%)` }}
      />
    </div>
  );
};
