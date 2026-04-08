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
          <div className="min-w-0 flex items-center gap-2">
            <div className="min-w-0">
              <h1 className="text-base font-bold text-white tracking-tight truncate">
                Mi Itinerario TL26
              </h1>
              <p className="text-[11px] text-slate-500 truncate hidden sm:block">
                {description}
              </p>
            </div>
            <a
              href="/talent-land-2026-keypoints.pdf"
              download
              className="shrink-0 inline-flex items-center justify-center w-8 h-8 rounded-full bg-surface-alt text-slate-400 active:text-white active:scale-95 transition-smooth"
              title="Descargar PDF resumen"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
            </a>
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
