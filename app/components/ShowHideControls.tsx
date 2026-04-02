'use client'

interface ShowHideControlsProps {
  showCompleted: boolean
  showPassed: boolean
  completedCount: number
  passedCount: number
  onToggleCompleted: () => void
  onTogglePassed: () => void
}

export default function ShowHideControls({
  showCompleted,
  showPassed,
  completedCount,
  passedCount,
  onToggleCompleted,
  onTogglePassed,
}: ShowHideControlsProps) {
  if (completedCount === 0 && passedCount === 0) return null

  return (
    <div className="max-w-3xl mx-auto px-3 pb-2">
      <div className="flex items-center gap-1.5 text-[11px]">
        {completedCount > 0 && (
          <button
            onClick={onToggleCompleted}
            className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-full font-medium transition-smooth active:scale-95 ${
              showCompleted
                ? 'bg-green-500/15 text-green-400 border border-green-500/20'
                : 'bg-surface text-slate-500 active:text-slate-400'
            }`}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              {showCompleted ? (
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z M12 9a3 3 0 100 6 3 3 0 000-6z" />
              ) : (
                <>
                  <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94" />
                  <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19" />
                  <line x1="1" y1="1" x2="23" y2="23" />
                </>
              )}
            </svg>
            {showCompleted ? 'Ocultar' : 'Ver'} completadas ({completedCount})
          </button>
        )}
        {passedCount > 0 && (
          <button
            onClick={onTogglePassed}
            className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-full font-medium transition-smooth active:scale-95 ${
              showPassed
                ? 'bg-slate-500/15 text-slate-400 border border-slate-500/20'
                : 'bg-surface text-slate-500 active:text-slate-400'
            }`}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            {showPassed ? 'Ocultar' : 'Ver'} pasadas ({passedCount})
          </button>
        )}
      </div>
    </div>
  )
}
