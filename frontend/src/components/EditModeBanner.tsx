/**
 * EditModeBanner — floating banner that toggles edit mode site-wide
 * Shows a pill at the bottom of the screen.
 * In edit mode: all EditableText components become clickable.
 */
import { clearAllEdits } from '../hooks/useInlineEdit'

interface EditModeBannerProps {
  editMode: boolean
  onToggle: () => void
  onReset: () => void
}

export function EditModeBanner({ editMode, onToggle, onReset }: EditModeBannerProps) {
  const handleReset = () => {
    if (window.confirm('Reset all text to original defaults? This cannot be undone.')) {
      clearAllEdits()
      window.location.reload()
    }
  }

  return (
    <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2">
      <div
        className={[
          'flex items-center gap-3 rounded-full px-5 py-3 shadow-xl backdrop-blur-md transition-all',
          editMode
            ? 'bg-violet-600 text-white ring-2 ring-violet-300/60'
            : 'bg-white/90 text-slate-700 ring-1 ring-black/10',
        ].join(' ')}
      >
        <span className="text-sm font-medium">
          {editMode ? '✏️ Edit mode ON — click any text to edit' : '✏️ Edit mode OFF'}
        </span>
        <button
          onClick={onToggle}
          className={[
            'rounded-full px-4 py-1.5 text-xs font-semibold transition',
            editMode
              ? 'bg-white text-violet-700 hover:bg-violet-50'
              : 'bg-violet-600 text-white hover:bg-violet-700',
          ].join(' ')}
        >
          {editMode ? 'Done editing' : 'Enable editing'}
        </button>
        {editMode && (
          <button
            onClick={handleReset}
            className="rounded-full border border-white/30 px-3 py-1.5 text-xs font-medium text-white/80 hover:text-white transition"
            title="Reset all text to defaults"
          >
            Reset all
          </button>
        )}
      </div>
    </div>
  )
}
