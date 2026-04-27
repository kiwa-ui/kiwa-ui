import type { FC, JSX, PropsWithChildren } from 'hono/jsx'
import { cn } from '@/lib/utils'

type FormFieldProps = PropsWithChildren<{
  label?: string
  description?: string
  error?: string
  required?: boolean
  class?: string
  id?: string
}>

export const FormField: FC<FormFieldProps> = ({
  label,
  description,
  error,
  required = false,
  class: className,
  id,
  children,
}) => (
  <div
    data-slot="form-field"
    class={cn('space-y-2', className)}
  >
    {label && (
      <FormLabel htmlFor={id} required={required}>
        {label}
      </FormLabel>
    )}
    {children}
    {description && !error && (
      <FormDescription>{description}</FormDescription>
    )}
    {error && (
      <FormError>{error}</FormError>
    )}
  </div>
)

type FormLabelProps = JSX.IntrinsicElements['label'] & {
  required?: boolean
}

export const FormLabel: FC<FormLabelProps> = ({
  required = false,
  class: className,
  children,
  ...props
}) => (
  <label
    data-slot="form-label"
    class={cn(
      'block text-sm font-medium leading-none',
      'peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
      className
    )}
    {...props}
  >
    {children}
    {required && (
      <span class="ml-1 text-destructive">*</span>
    )}
  </label>
)

type FormDescriptionProps = JSX.IntrinsicElements['p']

export const FormDescription: FC<FormDescriptionProps> = ({
  class: className,
  children,
  ...props
}) => (
  <p
    data-slot="form-description"
    class={cn('text-sm text-foreground-muted', className)}
    {...props}
  >
    {children}
  </p>
)

type FormErrorProps = JSX.IntrinsicElements['p']

export const FormError: FC<FormErrorProps> = ({
  class: className,
  children,
  ...props
}) => (
  <p
    data-slot="form-error"
    role="alert"
    class={cn('text-sm font-medium text-destructive', className)}
    {...props}
  >
    {children}
  </p>
)
