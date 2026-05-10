/**
 * EditableText — click-to-edit text component
 * - Single-click to enter edit mode
 * - Enter (or blur) to save
 * - Escape to cancel
 * - Shows a subtle pencil icon on hover
 * - Persisted to localStorage via useInlineEdit
 */
import { useRef, useEffect } from 'react'
import { useInlineEdit } from '../hooks/useInlineEdit'

interface EditableTextProps {
  /** Unique key used for localStorage persistence */
  storageKey: string
  /** The original/default text (shown if nothing saved yet) */
  defaultValue: string
  /** Wrapper element tag — defaults to span */
  as?: 'span' | 'p' | 'h1' | 'h2' | 'h3' | 'div'
  /** Extra className on the wrapper */
  className?: string
  /** Use textarea instead of input (for multi-line) */
  multiline?: boolean
  /** Placeholder shown in input */
  placeholder?: string
}

export function EditableText({
  storageKey,
  defaultValue,
  as: Tag = 'span',
  className = '',
  multiline = false,
  placeholder,
}: EditableTextProps) {
  const { value, editing, draft, setDraft, startEdit, commitEdit, cancelEdit } =
    useInlineEdit(storageKey, defaultValue)

  const inputRef = useRef<HTMLInputElement & HTMLTextAreaElement>(null)

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus()
      // move cursor to end
      const len = inputRef.current.value.length
      inputRef.current.setSelectionRange(len, len)
    }
  }, [editing])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !multiline) {
      e.preventDefault()
      commitEdit()
    }
    if (e.key === 'Escape') {
      cancelEdit()
    }
    if (e.key === 'Enter' && multiline && (e.ctrlKey || e.metaKey)) {
      e.preventDefault()
      commitEdit()
    }
  }

  if (editing) {
    const sharedProps = {
      ref: inputRef as any,
      value: draft,
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
        setDraft(e.target.value),
      onBlur: commitEdit,
      onKeyDown: handleKeyDown,
      placeholder: placeholder ?? defaultValue,
      className: [
        'w-full rounded-md border border-violet-400 bg-white/90 px-2 py-1',
        'text-inherit font-inherit leading-inherit outline-none',
        'ring-2 ring-violet-300/60 shadow-sm resize-none',
        className,
      ].join(' '),
    }

    return multiline ? (
      <textarea {...sharedProps} rows={3} />
    ) : (
      <input {...sharedProps} type="text" />
    )
  }

  return (
    <Tag
      className={[
        'group relative cursor-pointer rounded-sm',
        'transition-all hover:bg-violet-50/60 hover:outline hover:outline-2 hover:outline-violet-300/50',
        className,
      ].join(' ')}
      onClick={startEdit}
      title="Click to edit"
    >
      {value}
      {/* pencil hint badge */}
      <span
        className="pointer-events-none absolute -right-5 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-xs text-violet-400 select-none"
        aria-hidden
      >
        ✏️
      </span>
    </Tag>
  )
}
