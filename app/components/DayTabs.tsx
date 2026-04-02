'use client'

import type { DayData } from '../lib/data'

interface DayTabsProps {
  days: DayData[]
  activeDay: string
  onDayChange: (key: string) => void
}

export default function DayTabs({ days, activeDay, onDayChange }: DayTabsProps) {
  return (
    <div className="max-w-3xl mx-auto px-3 pt-2 pb-1">
      <div className="flex gap-1.5">
        {days.map((day) => {
          const isActive = day.key === activeDay
          return (
            <button
              key={day.key}
              onClick={() => onDayChange(day.key)}
              className={`flex-1 py-2 px-2 rounded-xl text-center transition-all duration-200 touch-target ${
                isActive
                  ? 'bg-surface-alt text-white shadow-lg shadow-blue-500/10 border border-blue-500/20'
                  : 'bg-surface text-slate-400 border border-transparent active:bg-surface-alt'
              }`}
            >
              <span className="block text-xs font-semibold">{day.label}</span>
              <span className="block text-[10px] text-slate-500 mt-0.5">
                {day.date}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
