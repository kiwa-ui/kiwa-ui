/**
 * Rich text editor enhancement using Tiptap
 *
 * Required dependencies (install in user's project):
 * - @tiptap/core
 * - @tiptap/pm
 * - @tiptap/starter-kit
 * - @tiptap/extension-link (optional, for link support)
 * - @tiptap/extension-image (optional, for image support)
 *
 * SSR component renders:
 * - [data-editor="id"] - Editor container with initial content
 * - [data-editor-toolbar] - Toolbar container
 * - [data-editor-action="bold|italic|link|image|..."] - Toolbar buttons
 * - [data-editor-area] - Content area where Tiptap mounts
 * - [data-editor-link-popover] - Link editing popover
 *
 * Usage:
 * ```html
 * <script type="module">
 *   import { editor } from '@kiwa-ui/enhance'
 *   editor()
 * </script>
 * ```
 */

export interface EditorInstance {
  id: string
  editor: unknown
  getHTML: () => string
  getJSON: () => unknown
  getText: () => string
  setContent: (content: string) => void
  destroy: () => void
}

export async function editor(): Promise<EditorInstance[]> {
  const editors = document.querySelectorAll<HTMLElement>('[data-editor]')
  const instances: EditorInstance[] = []

  if (editors.length === 0) return instances

  // Dynamically import Tiptap (user must have it installed)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let Editor: any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let StarterKit: any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let Link: any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let Image: any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let Underline: any

  try {
    // Dynamic imports - these packages must be installed by user
    const [coreModule, starterKitModule] = await Promise.all([
      import(/* webpackIgnore: true */ '@tiptap/core' as string),
      import(/* webpackIgnore: true */ '@tiptap/starter-kit' as string),
    ])
    Editor = coreModule.Editor
    StarterKit = starterKitModule.default || starterKitModule.StarterKit

    // Try to load optional extensions
    try {
      const linkModule = await import(/* webpackIgnore: true */ '@tiptap/extension-link' as string)
      Link = linkModule.default || linkModule.Link
    } catch {
      // Link extension not installed
    }

    try {
      const imageModule = await import(/* webpackIgnore: true */ '@tiptap/extension-image' as string)
      Image = imageModule.default || imageModule.Image
    } catch {
      // Image extension not installed
    }

    try {
      const underlineModule = await import(/* webpackIgnore: true */ '@tiptap/extension-underline' as string)
      Underline = underlineModule.default || underlineModule.Underline
    } catch {
      // Underline extension not installed
    }
  } catch {
    console.error(
      '[@kiwa-ui/enhance] Tiptap not found. Please install required dependencies:\n' +
      'npm install @tiptap/core @tiptap/pm @tiptap/starter-kit'
    )
    return instances
  }

  editors.forEach((container) => {
    const id = container.dataset.editor
    if (!id) return

    const contentArea = container.querySelector<HTMLElement>('[data-editor-area]')
    const toolbar = container.querySelector<HTMLElement>('[data-editor-toolbar]')
    const initialContent = container.dataset.editorContent || '<p></p>'

    if (!contentArea) {
      console.warn(`[@kiwa-ui/enhance] No [data-editor-area] found for editor "${id}"`)
      return
    }

    // Build extensions array
    const extensions = [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
    ]

    // Add Link extension if available
    if (Link) {
      extensions.push(
        Link.configure({
          openOnClick: false,
          HTMLAttributes: {
            class: 'text-primary underline underline-offset-4 hover:text-primary/80',
          },
        })
      )
    }

    // Add Image extension if available
    if (Image) {
      extensions.push(
        Image.configure({
          HTMLAttributes: {
            class: 'rounded-lg max-w-full h-auto',
          },
        })
      )
    }

    if (Underline) {
      extensions.push(Underline)
    }

    // Create Tiptap editor
    const tiptapEditor = new Editor({
      element: contentArea,
      extensions,
      content: initialContent,
      editorProps: {
        attributes: {
          class: 'ProseMirror outline-none min-h-[200px]',
        },
      },
      onTransaction: () => {
        updateToolbarState()
      },
    })

    // Update toolbar active states
    function updateToolbarState() {
      if (!toolbar) return

      const buttons = toolbar.querySelectorAll<HTMLButtonElement>('[data-editor-action]')
      buttons.forEach((button) => {
        const action = button.dataset.editorAction
        const level = button.dataset.editorLevel

        let isActive = false

        switch (action) {
          case 'bold':
            isActive = tiptapEditor.isActive('bold')
            break
          case 'italic':
            isActive = tiptapEditor.isActive('italic')
            break
          case 'underline':
            isActive = Underline ? tiptapEditor.isActive('underline') : false
            break
          case 'strike':
            isActive = tiptapEditor.isActive('strike')
            break
          case 'code':
            isActive = tiptapEditor.isActive('code')
            break
          case 'heading':
            isActive = tiptapEditor.isActive('heading', { level: parseInt(level || '1') })
            break
          case 'bulletList':
            isActive = tiptapEditor.isActive('bulletList')
            break
          case 'orderedList':
            isActive = tiptapEditor.isActive('orderedList')
            break
          case 'blockquote':
            isActive = tiptapEditor.isActive('blockquote')
            break
          case 'codeBlock':
            isActive = tiptapEditor.isActive('codeBlock')
            break
          case 'link':
            isActive = tiptapEditor.isActive('link')
            break
        }

        button.dataset.active = isActive ? 'true' : 'false'
      })
    }

    // Link popover handling
    const linkPopover = container.querySelector<HTMLElement>('[data-editor-link-popover]')
    const linkTextInput = container.querySelector<HTMLInputElement>('[data-editor-link-text]')
    const linkUrlInput = container.querySelector<HTMLInputElement>('[data-editor-link-url]')
    const linkSaveBtn = container.querySelector<HTMLButtonElement>('[data-editor-link-save]')
    const linkCancelBtn = container.querySelector<HTMLButtonElement>('[data-editor-link-cancel]')
    const linkRemoveBtn = container.querySelector<HTMLButtonElement>('[data-editor-link-remove]')

    function showLinkPopover() {
      if (!linkPopover || !linkTextInput || !linkUrlInput || !linkRemoveBtn) return

      // Get current selection text
      const { from, to } = tiptapEditor.state.selection
      const selectedText = tiptapEditor.state.doc.textBetween(from, to, '')
      linkTextInput.value = selectedText

      // Check if already a link
      const existingLink = tiptapEditor.getAttributes('link').href
      if (existingLink) {
        linkUrlInput.value = existingLink
        linkRemoveBtn.classList.remove('hidden')
        linkRemoveBtn.classList.add('inline-flex')
      } else {
        linkUrlInput.value = ''
        linkRemoveBtn.classList.add('hidden')
        linkRemoveBtn.classList.remove('inline-flex')
      }

      linkPopover.classList.remove('hidden')
      linkUrlInput.focus()
    }

    function hideLinkPopover() {
      if (!linkPopover) return
      linkPopover.classList.add('hidden')
      tiptapEditor.commands.focus()
    }

    function saveLink() {
      if (!linkUrlInput || !linkTextInput) return

      const url = linkUrlInput.value.trim()
      const text = linkTextInput.value.trim()

      if (!url) {
        hideLinkPopover()
        return
      }

      // If text changed, update it
      const { from, to } = tiptapEditor.state.selection
      const currentText = tiptapEditor.state.doc.textBetween(from, to, '')

      if (text && text !== currentText) {
        tiptapEditor.chain()
          .focus()
          .deleteSelection()
          .insertContent(`<a href="${url}">${text}</a>`)
          .run()
      } else {
        tiptapEditor.chain()
          .focus()
          .setLink({ href: url })
          .run()
      }

      hideLinkPopover()
    }

    function removeLink() {
      tiptapEditor.chain().focus().unsetLink().run()
      hideLinkPopover()
    }

    // Wire up link popover buttons
    if (linkSaveBtn) {
      linkSaveBtn.addEventListener('click', (e) => {
        e.preventDefault()
        saveLink()
      })
    }

    if (linkCancelBtn) {
      linkCancelBtn.addEventListener('click', (e) => {
        e.preventDefault()
        hideLinkPopover()
      })
    }

    if (linkRemoveBtn) {
      linkRemoveBtn.addEventListener('click', (e) => {
        e.preventDefault()
        removeLink()
      })
    }

    // Close popover on Escape
    if (linkPopover) {
      linkPopover.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          hideLinkPopover()
        }
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault()
          saveLink()
        }
      })
    }

    // Wire up toolbar buttons
    if (toolbar) {
      const buttons = toolbar.querySelectorAll<HTMLButtonElement>('[data-editor-action]')
      buttons.forEach((button) => {
        button.addEventListener('click', (e) => {
          e.preventDefault()
          const action = button.dataset.editorAction
          const level = button.dataset.editorLevel

          switch (action) {
            case 'bold':
              tiptapEditor.chain().focus().toggleBold().run()
              break
            case 'italic':
              tiptapEditor.chain().focus().toggleItalic().run()
              break
            case 'underline':
              if (Underline) {
                tiptapEditor.chain().focus().toggleUnderline().run()
              }
              break
            case 'strike':
              tiptapEditor.chain().focus().toggleStrike().run()
              break
            case 'code':
              tiptapEditor.chain().focus().toggleCode().run()
              break
            case 'heading':
              tiptapEditor.chain().focus().toggleHeading({ level: parseInt(level || '1') }).run()
              break
            case 'bulletList':
              tiptapEditor.chain().focus().toggleBulletList().run()
              break
            case 'orderedList':
              tiptapEditor.chain().focus().toggleOrderedList().run()
              break
            case 'blockquote':
              tiptapEditor.chain().focus().toggleBlockquote().run()
              break
            case 'codeBlock':
              tiptapEditor.chain().focus().toggleCodeBlock().run()
              break
            case 'horizontalRule':
              tiptapEditor.chain().focus().setHorizontalRule().run()
              break
            case 'undo':
              tiptapEditor.chain().focus().undo().run()
              break
            case 'redo':
              tiptapEditor.chain().focus().redo().run()
              break
            case 'link':
              if (linkPopover) {
                showLinkPopover()
              } else {
                const url = prompt('Enter link URL:')
                if (url) {
                  tiptapEditor.chain().focus().setLink({ href: url }).run()
                }
              }
              return // Don't update toolbar state yet
            case 'image':
              // Prompt for image URL
              const imageUrl = prompt('Enter image URL:')
              if (imageUrl) {
                tiptapEditor.chain().focus().setImage({ src: imageUrl }).run()
              }
              break
          }

          updateToolbarState()
        })
      })
    }

    // Initial toolbar state
    updateToolbarState()

    // Create instance
    const instance: EditorInstance = {
      id: id,
      editor: tiptapEditor,
      getHTML: () => tiptapEditor.getHTML(),
      getJSON: () => tiptapEditor.getJSON(),
      getText: () => tiptapEditor.getText(),
      setContent: (content: string) => tiptapEditor.commands.setContent(content),
      destroy: () => tiptapEditor.destroy(),
    }

    instances.push(instance)

    // Store reference on element for external access
    ;(container as any).__honoEditor = instance
  })

  return instances
}
