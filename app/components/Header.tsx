'use client'

interface HeaderProps {
  mode: string
  onModeChange: (mode: string) => void
  description: string
}

export default function Header({ mode, onModeChange, description }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 glass" style={{ paddingTop: 'env(safe-area-inset-top)' }}>
      <div className="max-w-3xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <h1 className="text-base font-bold text-white tracking-tight truncate">
              Mi Itinerario TL26
            </h1>
            <p className="text-[11px] text-slate-500 truncate hidden sm:block">
              {description}
            </p>
          </div>

          {/* Toggle pill */}
          <div className="relative flex items-center bg-surface rounded-full p-1 shrink-0">
            <div
              className="absolute top-1 bottom-1 rounded-full transition-all duration-300 ease-in-out"
              style={{
                width: 'calc(50% - 4px)',
                left: mode === 'intensivo' ? '4px' : 'calc(50%)',
                background:
                  mode === 'intensivo'
                    ? 'linear-gradient(135deg, #ef4444, #f97316)'
                    : 'linear-gradient(135deg, #3b82f6, #06b6d4)',
              }}
            />
            <button
              onClick={() => onModeChange('intensivo')}
              className={`relative z-10 px-3.5 py-1.5 text-xs font-semibold rounded-full transition-colors duration-300 ${
                mode === 'intensivo' ? 'text-white' : 'text-slate-400'
              }`}
            >
              Intenso
            </button>
            <button
              onClick={() => onModeChange('relajado')}
              className={`relative z-10 px-3.5 py-1.5 text-xs font-semibold rounded-full transition-colors duration-300 ${
                mode === 'relajado' ? 'text-white' : 'text-slate-400'
              }`}
            >
              Relajado
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
