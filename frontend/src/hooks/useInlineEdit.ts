/**
 * useInlineEdit — persists editable text to localStorage
 * Usage: const [value, EditableText] = useInlineEdit('key', 'Default text')
 */
import { useState, useCallback } from 'react'

const STORAGE_PREFIX = 'brightcone_content_'

export function getStoredValue(key: string, fallback: string): string {
  try {
    return localStorage.getItem(STORAGE_PREFIX + key) ?? fallback
  } catch {
    return fallback
  }
}

export function setStoredValue(key: string, value: string): void {
  try {
    localStorage.setItem(STORAGE_PREFIX + key, value)
  } catch {
    // silent fail — storage unavailable
  }
}

export function clearAllEdits(): void {
  try {
    Object.keys(localStorage)
      .filter((k) => k.startsWith(STORAGE_PREFIX))
      .forEach((k) => localStorage.removeItem(k))
  } catch {
    // silent fail
  }
}

export function useInlineEdit(key: string, defaultValue: string) {
  const [value, setValue] = useState<string>(() => getStoredValue(key, defaultValue))
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(value)

  const startEdit = useCallback(() => {
    setDraft(value)
    setEditing(true)
  }, [value])

  const commitEdit = useCallback(() => {
    const trimmed = draft.trim() || defaultValue
    setValue(trimmed)
    setStoredValue(key, trimmed)
    setEditing(false)
  }, [draft, defaultValue, key])

  const cancelEdit = useCallback(() => {
    setDraft(value)
    setEditing(false)
  }, [value])

  const reset = useCallback(() => {
    setValue(defaultValue)
    setStoredValue(key, defaultValue)
    setEditing(false)
  }, [defaultValue, key])

  return { value, editing, draft, setDraft, startEdit, commitEdit, cancelEdit, reset }
}
