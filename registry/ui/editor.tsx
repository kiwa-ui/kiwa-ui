import type { FC, PropsWithChildren } from 'hono/jsx'
import { cn } from '@/lib/utils'
import {
  BoldIcon,
  CodeBlockIcon,
  CodeIcon,
  HorizontalRuleIcon,
  ImageIcon,
  ItalicIcon,
  LinkIcon,
  ListIcon,
  ListOrderedIcon,
  QuoteIcon,
  RedoIcon,
  StrikethroughIcon,
  UnderlineIcon,
  UndoIcon,
} from '@/components/ui/icon'

type EditorProps = PropsWithChildren<{
  id: string
  content?: string
  placeholder?: string
  class?: string
}>

type EditorToolbarProps = {
  class?: string
}

type EditorContentProps = {
  class?: string
  placeholder?: string
}

export const Editor: FC<EditorProps> = ({
  id,
  content = '',
  placeholder = 'Start writing...',
  class: className,
}) => (
  <div
    data-editor={id}
    data-editor-content={content}
    class={cn(
      'relative overflow-hidden rounded-2xl bg-card shadow',
      className
    )}
  >
    <EditorToolbar />
    <EditorLinkPopover />
    <EditorContent placeholder={placeholder} />
  </div>
)

export const EditorToolbar: FC<EditorToolbarProps> = ({
  class: className,
}) => (
  <div
    data-editor-toolbar
    class={cn(
      'flex flex-wrap items-center gap-1 border-b border-border-subtle bg-background p-1',
      className
    )}
  >
    {/* Text formatting */}
    <div class="flex items-center">
      <EditorButton action="bold" title="Bold (Ctrl+B)">
          <BoldIcon class="h-4 w-4" />
      </EditorButton>
      <EditorButton action="italic" title="Italic (Ctrl+I)">
          <ItalicIcon class="h-4 w-4" />
      </EditorButton>
      <EditorButton action="underline" title="Underline (Ctrl+U)">
          <UnderlineIcon class="h-4 w-4" />
      </EditorButton>
      <EditorButton action="strike" title="Strikethrough">
          <StrikethroughIcon class="h-4 w-4" />
      </EditorButton>
      <EditorButton action="code" title="Inline code">
          <CodeIcon class="h-4 w-4" />
      </EditorButton>
    </div>

    <EditorSeparator />

    {/* Headings */}
    <div class="flex items-center">
      <EditorButton action="heading" level="1" title="Heading 1">
        <span class="text-xs font-bold">H1</span>
      </EditorButton>
      <EditorButton action="heading" level="2" title="Heading 2">
        <span class="text-xs font-bold">H2</span>
      </EditorButton>
      <EditorButton action="heading" level="3" title="Heading 3">
        <span class="text-xs font-bold">H3</span>
      </EditorButton>
    </div>

    <EditorSeparator />

    {/* Lists */}
    <div class="flex items-center">
      <EditorButton action="bulletList" title="Bullet list">
          <ListIcon class="h-4 w-4" />
      </EditorButton>
      <EditorButton action="orderedList" title="Numbered list">
          <ListOrderedIcon class="h-4 w-4" />
      </EditorButton>
    </div>

    <EditorSeparator />

    {/* Media */}
    <div class="flex items-center">
      <EditorButton action="link" title="Add link">
          <LinkIcon class="h-4 w-4" />
      </EditorButton>
      <EditorButton action="image" title="Insert image">
          <ImageIcon class="h-4 w-4" />
      </EditorButton>
    </div>

    <EditorSeparator />

    {/* Block elements */}
    <div class="flex items-center">
      <EditorButton action="blockquote" title="Quote">
          <QuoteIcon class="h-4 w-4" />
      </EditorButton>
      <EditorButton action="codeBlock" title="Code block">
          <CodeBlockIcon class="h-4 w-4" />
      </EditorButton>
      <EditorButton action="horizontalRule" title="Horizontal rule">
          <HorizontalRuleIcon class="h-4 w-4" />
      </EditorButton>
    </div>

    <EditorSeparator />

    {/* Undo/Redo */}
    <div class="flex items-center">
      <EditorButton action="undo" title="Undo (Ctrl+Z)">
          <UndoIcon class="h-4 w-4" />
      </EditorButton>
      <EditorButton action="redo" title="Redo (Ctrl+Y)">
          <RedoIcon class="h-4 w-4" />
      </EditorButton>
    </div>
  </div>
)

type EditorButtonProps = PropsWithChildren<{
  action: string
  level?: string
  title?: string
}>

const EditorButton: FC<EditorButtonProps> = ({
  action,
  level,
  title,
  children,
}) => (
  <button
    type="button"
    data-editor-action={action}
    data-editor-level={level}
    title={title}
    class={cn(
      'inline-flex h-8 w-8 items-center justify-center rounded-xl border border-transparent text-sm font-medium',
      'text-foreground-muted hover:bg-secondary hover:text-foreground',
      'outline-none focus-visible:border-ring focus-visible:ring-ring/20 focus-visible:ring-[3px]',
      'disabled:pointer-events-none disabled:opacity-50',
      'data-[active=true]:bg-secondary data-[active=true]:text-foreground'
    )}
  >
    {children}
  </button>
)

const EditorSeparator: FC = () => (
  <div class="mx-1 h-6 w-px bg-border" />
)

const EditorLinkPopover: FC = () => (
  <div
    data-editor-link-popover
    class="absolute left-2 top-12 z-20 hidden w-80 rounded-lg bg-popover p-3 shadow-md"
  >
    <div class="space-y-3">
      <div class="space-y-1.5">
        <label class="block text-xs font-medium text-foreground" for="editor-link-text">
          Text
        </label>
        <input
          id="editor-link-text"
          data-editor-link-text
          type="text"
          class="h-9 w-full rounded-md border bg-background px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-ring/20 focus-visible:ring-[3px]"
          placeholder="Link text"
        />
      </div>
      <div class="space-y-1.5">
        <label class="block text-xs font-medium text-foreground" for="editor-link-url">
          URL
        </label>
        <input
          id="editor-link-url"
          data-editor-link-url
          type="url"
          class="h-9 w-full rounded-md border bg-background px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-ring/20 focus-visible:ring-[3px]"
          placeholder="https://example.com"
        />
      </div>
      <div class="flex items-center justify-between gap-2 pt-1">
        <button
          type="button"
          data-editor-link-remove
          class="hidden h-8 items-center rounded-md border border-transparent px-3 text-xs font-medium text-destructive outline-none hover:bg-destructive/10 focus-visible:border-ring focus-visible:ring-ring/20 focus-visible:ring-[3px]"
        >
          Remove
        </button>
        <div class="ml-auto flex items-center gap-2">
          <button
            type="button"
            data-editor-link-cancel
            class="h-8 rounded-md border border-transparent px-3 text-xs font-medium text-foreground-muted outline-none hover:bg-secondary hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/20 focus-visible:ring-[3px]"
          >
            Cancel
          </button>
          <button
            type="button"
            data-editor-link-save
            class="h-8 rounded-md border border-transparent bg-primary px-3 text-xs font-medium text-primary-foreground outline-none hover:bg-primary/90 focus-visible:border-ring focus-visible:ring-ring/20 focus-visible:ring-[3px]"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  </div>
)

export const EditorContent: FC<EditorContentProps> = ({
  placeholder = 'Start writing...',
  class: className,
}) => (
  <div
    data-editor-area
    data-placeholder={placeholder}
    class={cn(
      'prose prose-sm max-w-none p-4',
      'min-h-[200px] focus:outline-none',
      '[&_p]:my-2 [&_p:first-child]:mt-0 [&_p:last-child]:mb-0',
      '[&_h1]:text-2xl [&_h1]:font-bold [&_h1]:mt-6 [&_h1]:mb-2',
      '[&_h2]:text-xl [&_h2]:font-semibold [&_h2]:mt-5 [&_h2]:mb-2',
      '[&_h3]:text-lg [&_h3]:font-semibold [&_h3]:mt-4 [&_h3]:mb-2',
      '[&_ul]:list-disc [&_ul]:pl-6 [&_ul]:my-2',
      '[&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:my-2',
      '[&_li]:my-1',
      '[&_blockquote]:border-l-4 [&_blockquote]:border-border [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-foreground-muted',
      '[&_code]:rounded-md [&_code]:bg-muted [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-sm',
      '[&_pre]:rounded-2xl [&_pre]:bg-muted [&_pre]:p-4 [&_pre]:overflow-x-auto',
      '[&_pre_code]:bg-transparent [&_pre_code]:p-0',
      '[&_hr]:my-4 [&_hr]:border-border',
      '[&_.ProseMirror]:outline-none [&_.ProseMirror]:min-h-[200px]',
      '[&_.ProseMirror_p.is-editor-empty:first-child::before]:content-[attr(data-placeholder)]',
      '[&_.ProseMirror_p.is-editor-empty:first-child::before]:text-foreground-muted',
      '[&_.ProseMirror_p.is-editor-empty:first-child::before]:float-left',
      '[&_.ProseMirror_p.is-editor-empty:first-child::before]:pointer-events-none',
      '[&_.ProseMirror_p.is-editor-empty:first-child::before]:h-0',
      className
    )}
  />
)
