'use client'

interface StatsBarProps {
  sessions: number
  imperdibles: number
  workshops: number
  breaks: number
  completedCount: number
  hiddenCount: number
}

export default function StatsBar({
  sessions,
  imperdibles,
  workshops,
  breaks,
  completedCount,
  hiddenCount,
}: StatsBarProps) {
  return (
    <div className="max-w-3xl mx-auto px-3 py-2">
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar text-[11px]">
        <Pill dot="bg-slate-400" color="text-slate-300">{sessions} sesiones</Pill>
        <Pill dot="bg-imperdible" color="text-red-400">{imperdibles} imperdibles</Pill>
        <Pill dot="bg-green-500" color="text-green-400">{workshops} workshops</Pill>
        {breaks > 0 && (
          <Pill dot="bg-descanso" color="text-amber-400">{breaks} descansos</Pill>
        )}
        {completedCount > 0 && (
          <span className="inline-flex items-center gap-1 bg-green-500/10 px-2 py-1 rounded-full text-green-400 font-medium shrink-0">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            {completedCount}
          </span>
        )}
        {hiddenCount > 0 && (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-slate-500 font-medium shrink-0">
            {hiddenCount} ocultas
          </span>
        )}
      </div>
    </div>
  )
}

function Pill({ dot, color, children }: { dot: string; color: string; children: React.ReactNode }) {
  return (
    <span className={`inline-flex items-center gap-1 bg-surface px-2 py-1 rounded-full ${color} font-medium shrink-0`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
      {children}
    </span>
  )
}
