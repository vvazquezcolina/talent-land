'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { itineraries } from './lib/data'
import type { DayKey } from './lib/data'
import { isSessionPassed } from './lib/time'
import Header from './components/Header'
import DayTabs from './components/DayTabs'
import StatsBar from './components/StatsBar'
import NowNextIndicator from './components/NowNextIndicator'
import ShowHideControls from './components/ShowHideControls'
import SessionList from './components/SessionList'

export default function Home() {
  const [mode, setMode] = useState<string>('intensivo')
  const [activeDay, setActiveDay] = useState<string>('martes')
  const [completedMap, setCompletedMap] = useState<Record<string, boolean>>({})
  const [showCompleted, setShowCompleted] = useState(false)
  const [showPassed, setShowPassed] = useState(false)
  const [passedMap, setPassedMap] = useState<Record<number, boolean>>({})

  const itinerary = itineraries[mode]
  const currentDay = itinerary.days.find((d) => d.key === activeDay) ?? itinerary.days[0]
  const dayKey = currentDay.key as DayKey

  // Load all completed states from localStorage on mount and when mode/day changes
  useEffect(() => {
    const map: Record<string, boolean> = {}
    currentDay.sessions.forEach((session, index) => {
      const isBreak = session.priority === 'LIBRE' || session.priority === 'DESCANSO'
      if (isBreak) return
      const key = `completed_${mode}_${dayKey}_${index}`
      try {
        const val = window.localStorage.getItem(key)
        if (val !== null) {
          map[key] = JSON.parse(val)
        }
      } catch {
        // ignore
      }
    })
    setCompletedMap(map)
  }, [mode, dayKey, currentDay.sessions])

  // Compute passed sessions based on time (updates every minute)
  useEffect(() => {
    function updatePassed() {
      const map: Record<number, boolean> = {}
      currentDay.sessions.forEach((session, index) => {
        const isBreak = session.priority === 'LIBRE' || session.priority === 'DESCANSO'
        if (isBreak) return
        if (isSessionPassed(session, dayKey)) {
          map[index] = true
        }
      })
      setPassedMap(map)
    }

    updatePassed()
    const interval = setInterval(updatePassed, 60000)
    return () => clearInterval(interval)
  }, [currentDay.sessions, dayKey])

  const handleToggleCompleted = useCallback(
    (index: number) => {
      const key = `completed_${mode}_${dayKey}_${index}`
      setCompletedMap((prev) => {
        const newVal = !prev[key]
        try {
          window.localStorage.setItem(key, JSON.stringify(newVal))
        } catch {
          // ignore
        }
        return { ...prev, [key]: newVal }
      })
    },
    [mode, dayKey]
  )

  // Compute counts for current day
  const { completedCount, passedNotCompletedCount, hiddenCount } = useMemo(() => {
    let completed = 0
    let passedNotCompleted = 0

    currentDay.sessions.forEach((session, index) => {
      const isBreak = session.priority === 'LIBRE' || session.priority === 'DESCANSO'
      if (isBreak) return
      const key = `completed_${mode}_${dayKey}_${index}`
      const isComp = !!completedMap[key]
      const isPas = !!passedMap[index]

      if (isComp) completed++
      else if (isPas) passedNotCompleted++
    })

    let hidden = 0
    if (!showCompleted) hidden += completed
    if (!showPassed) hidden += passedNotCompleted

    return { completedCount: completed, passedNotCompletedCount: passedNotCompleted, hiddenCount: hidden }
  }, [currentDay.sessions, completedMap, passedMap, showCompleted, showPassed, mode, dayKey])

  // Register service worker
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(() => {
        // Service worker registration failed silently
      })
    }
  }, [])

  return (
    <div className="flex flex-col flex-1 min-h-screen">
      <Header
        mode={mode}
        onModeChange={setMode}
        description={itinerary.description}
      />

      <DayTabs
        days={itinerary.days}
        activeDay={activeDay}
        onDayChange={setActiveDay}
      />

      <StatsBar
        sessions={itinerary.stats.sessions}
        imperdibles={itinerary.stats.imperdibles}
        workshops={itinerary.stats.workshops}
        breaks={itinerary.stats.breaks}
        completedCount={completedCount}
        hiddenCount={hiddenCount}
      />

      <NowNextIndicator sessions={currentDay.sessions} dayKey={dayKey} />

      <ShowHideControls
        showCompleted={showCompleted}
        showPassed={showPassed}
        completedCount={completedCount}
        passedCount={passedNotCompletedCount}
        onToggleCompleted={() => setShowCompleted((p) => !p)}
        onTogglePassed={() => setShowPassed((p) => !p)}
      />

      <SessionList
        sessions={currentDay.sessions}
        dayKey={dayKey}
        mode={mode}
        completedMap={completedMap}
        passedMap={passedMap}
        showCompleted={showCompleted}
        showPassed={showPassed}
        onToggleCompleted={handleToggleCompleted}
      />
    </div>
  )
}
