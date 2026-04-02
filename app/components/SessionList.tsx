'use client'

import type { Session, DayKey } from '../lib/data'
import SessionCard from './SessionCard'

interface SessionListProps {
  sessions: Session[]
  dayKey: DayKey
  mode: string
  completedMap: Record<string, boolean>
  passedMap: Record<number, boolean>
  showCompleted: boolean
  showPassed: boolean
  onToggleCompleted: (index: number) => void
}

export default function SessionList({
  sessions,
  dayKey,
  mode,
  completedMap,
  passedMap,
  showCompleted,
  showPassed,
  onToggleCompleted,
}: SessionListProps) {
  const visibleSessions = sessions.map((session, index) => {
    const isBreak = session.priority === 'LIBRE' || session.priority === 'DESCANSO'
    const completedKey = `completed_${mode}_${dayKey}_${index}`
    const isCompleted = !isBreak && !!completedMap[completedKey]
    const isPassed = !isBreak && !!passedMap[index]

    // Determine visibility
    if (isCompleted && !showCompleted) return null
    if (isPassed && !isCompleted && !showPassed) return null

    return { session, index, isCompleted, isPassed, isBreak }
  })

  const hasVisible = visibleSessions.some((s) => s !== null)

  return (
    <div className="max-w-3xl mx-auto px-3 pb-20">
      {!hasVisible && (
        <div className="text-center py-12">
          <p className="text-sm text-slate-500">No hay sesiones visibles</p>
          <p className="text-xs text-slate-600 mt-1">Usa los botones de arriba para mostrar completadas o pasadas</p>
        </div>
      )}

      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-[5px] top-2 bottom-2 w-px bg-border/40" />

        <div className="flex flex-col gap-2">
          {visibleSessions.map((item) => {
            if (!item) return null
            const { session, index, isCompleted, isPassed } = item

            // Priority dot color
            const dotColor =
              session.priority === 'IMPERDIBLE' ? 'bg-imperdible shadow-sm shadow-red-500/30'
              : session.priority === 'ALTA' ? 'bg-alta'
              : session.priority === 'DESCANSO' ? 'bg-descanso'
              : session.priority === 'LIBRE' ? 'bg-surface-alt'
              : 'bg-media'

            return (
              <div key={`${session.start}-${index}`} className="relative pl-5">
                {/* Timeline dot */}
                <div
                  className={`absolute left-0 top-3.5 w-[11px] h-[11px] rounded-full border-2 border-background z-10 ${dotColor}`}
                />
                <SessionCard
                  session={session}
                  dayKey={dayKey}
                  mode={mode}
                  sessionIndex={index}
                  isCompleted={isCompleted}
                  isPassed={isPassed}
                  onToggleCompleted={() => onToggleCompleted(index)}
                />
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
