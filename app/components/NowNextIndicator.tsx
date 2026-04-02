'use client'

import { useState, useEffect } from 'react'
import type { Session, DayKey } from '../lib/data'
import {
  findNowAndNext,
  allSessionsDone,
  minutesUntilSession,
  formatCountdown,
} from '../lib/time'

interface NowNextIndicatorProps {
  sessions: Session[]
  dayKey: DayKey
}

export default function NowNextIndicator({ sessions, dayKey }: NowNextIndicatorProps) {
  const [state, setState] = useState<{
    now: Session | null
    next: Session | null
    countdown: string
    allDone: boolean
  }>({ now: null, next: null, countdown: '', allDone: false })

  useEffect(() => {
    function update() {
      const { now, next } = findNowAndNext(sessions, dayKey)
      const done = allSessionsDone(sessions, dayKey)
      const countdown = next ? formatCountdown(minutesUntilSession(next, dayKey)) : ''
      setState({ now, next, countdown, allDone: done })
    }

    update()
    const interval = setInterval(update, 60000)
    return () => clearInterval(interval)
  }, [sessions, dayKey])

  if (!state.now && !state.next && !state.allDone) return null

  return (
    <div className="max-w-3xl mx-auto px-3 pb-2">
      <div className="flex flex-col gap-1.5">
        {state.allDone && !state.now && !state.next && (
          <div className="bg-surface border border-border/50 rounded-xl px-3 py-2.5 text-center">
            <span className="text-xs font-semibold text-slate-400">
              Dia terminado
            </span>
          </div>
        )}

        {state.now && (
          <div
            className="relative bg-surface rounded-xl px-3 py-2.5 overflow-hidden"
            style={{
              border: '1px solid rgba(34, 197, 94, 0.3)',
              boxShadow: '0 0 15px rgba(34, 197, 94, 0.08)',
            }}
          >
            <div className="flex items-center gap-2 mb-0.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
              </span>
              <span className="text-[10px] uppercase tracking-wider font-bold text-green-400">
                Ahora
              </span>
              <span className="text-[10px] font-mono text-slate-500 ml-auto">
                {state.now.start}-{state.now.end}
              </span>
            </div>
            <h4 className="text-[13px] font-semibold text-white leading-snug">
              {state.now.title}
            </h4>
            {state.now.stage && (
              <p className="text-[10px] text-slate-500 mt-0.5">{state.now.stage}</p>
            )}
          </div>
        )}

        {state.next && (
          <div className="bg-surface border border-border/50 rounded-xl px-3 py-2.5">
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-[10px] uppercase tracking-wider font-bold text-blue-400">
                Siguiente
              </span>
              <span className="text-[10px] text-slate-500 ml-auto font-mono">
                {state.countdown}
              </span>
            </div>
            <h4 className="text-[13px] font-semibold text-white leading-snug">
              {state.next.title}
            </h4>
            {state.next.stage && (
              <p className="text-[10px] text-slate-500 mt-0.5">{state.next.stage}</p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
