import type { Session, DayKey } from './data'

// Event dates mapped to day keys (Mexico City local dates)
const DAY_DATES: Record<DayKey, string> = {
  martes: '2026-04-07',
  miercoles: '2026-04-08',
  jueves: '2026-04-09',
}

const DATE_TO_DAY: Record<string, DayKey> = {
  '2026-04-07': 'martes',
  '2026-04-08': 'miercoles',
  '2026-04-09': 'jueves',
}

/**
 * Return the DayKey that matches today in Mexico City.
 * Falls back to the nearest event day (or martes before the event, jueves after).
 */
export function getTodayDayKey(): DayKey {
  const now = nowInMexicoCity()
  const todayStr = formatLocalDate(now)

  if (DATE_TO_DAY[todayStr]) return DATE_TO_DAY[todayStr]

  if (todayStr < '2026-04-07') return 'martes'
  if (todayStr > '2026-04-09') return 'jueves'
  return 'martes'
}

/**
 * Get the current time in Mexico City timezone as a Date object.
 */
export function nowInMexicoCity(): Date {
  const now = new Date()
  const str = now.toLocaleString('en-US', { timeZone: 'America/Mexico_City' })
  return new Date(str)
}

/**
 * Parse a time string like "11:00" or "13:30" combined with a DayKey
 * into a Date object in Mexico City local time.
 */
export function parseSessionTime(dayKey: DayKey, time: string): Date {
  const dateStr = DAY_DATES[dayKey]
  const [hours, minutes] = time.split(':').map(Number)
  const d = new Date(`${dateStr}T00:00:00`)
  d.setHours(hours, minutes, 0, 0)
  return d
}

/**
 * Get the ISO date string for a given day key (e.g., '2026-04-07')
 */
export function getDateForDay(dayKey: DayKey): string {
  return DAY_DATES[dayKey]
}

/**
 * Check if a session is currently happening.
 */
export function isSessionNow(session: Session, dayKey: DayKey): boolean {
  const now = nowInMexicoCity()
  const todayStr = formatLocalDate(now)
  const dayDateStr = DAY_DATES[dayKey]
  if (todayStr !== dayDateStr) return false

  const start = parseSessionTime(dayKey, session.start)
  const end = parseSessionTime(dayKey, session.end)
  return now >= start && now < end
}

/**
 * Check if a session has already ended.
 */
export function isSessionPassed(session: Session, dayKey: DayKey): boolean {
  const now = nowInMexicoCity()
  const todayStr = formatLocalDate(now)
  const dayDateStr = DAY_DATES[dayKey]

  // If today is after the session's day, it has passed
  if (todayStr > dayDateStr) return true
  // If today is before the session's day, it has not passed
  if (todayStr < dayDateStr) return false

  // Same day: compare times
  const end = parseSessionTime(dayKey, session.end)
  return now >= end
}

/**
 * Check if a session is upcoming (starts in the future on its day).
 */
export function isSessionUpcoming(session: Session, dayKey: DayKey): boolean {
  const now = nowInMexicoCity()
  const todayStr = formatLocalDate(now)
  const dayDateStr = DAY_DATES[dayKey]

  if (todayStr !== dayDateStr) return false

  const start = parseSessionTime(dayKey, session.start)
  return now < start
}

/**
 * Find the current session ("AHORA") and the next session ("SIGUIENTE").
 */
export function findNowAndNext(
  sessions: Session[],
  dayKey: DayKey
): { now: Session | null; next: Session | null; nextIndex: number; nowIndex: number } {
  let nowSession: Session | null = null
  let nextSession: Session | null = null
  let nowIndex = -1
  let nextIndex = -1

  const currentTime = nowInMexicoCity()
  const todayStr = formatLocalDate(currentTime)
  const dayDateStr = DAY_DATES[dayKey]

  if (todayStr !== dayDateStr) {
    return { now: null, next: null, nextIndex: -1, nowIndex: -1 }
  }

  for (let i = 0; i < sessions.length; i++) {
    const s = sessions[i]
    if (isSessionNow(s, dayKey)) {
      nowSession = s
      nowIndex = i
    }
    if (nextSession === null && isSessionUpcoming(s, dayKey)) {
      nextSession = s
      nextIndex = i
    }
  }

  return { now: nowSession, next: nextSession, nextIndex, nowIndex }
}

/**
 * Get minutes until a session starts.
 */
export function minutesUntilSession(session: Session, dayKey: DayKey): number {
  const now = nowInMexicoCity()
  const start = parseSessionTime(dayKey, session.start)
  return Math.max(0, Math.round((start.getTime() - now.getTime()) / 60000))
}

/**
 * Check if all sessions for the day are done.
 */
export function allSessionsDone(sessions: Session[], dayKey: DayKey): boolean {
  const now = nowInMexicoCity()
  const todayStr = formatLocalDate(now)
  const dayDateStr = DAY_DATES[dayKey]

  if (todayStr !== dayDateStr) return false

  if (sessions.length === 0) return false
  const lastSession = sessions[sessions.length - 1]
  const lastEnd = parseSessionTime(dayKey, lastSession.end)
  return now >= lastEnd
}

/**
 * Format a Date to YYYY-MM-DD string using Mexico City local values.
 */
function formatLocalDate(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

/**
 * Build a Google Calendar URL for a session.
 * Times are in Mexico City timezone (America/Mexico_City).
 */
export function buildGoogleCalendarUrl(
  session: Session,
  dayKey: DayKey
): string {
  const dateStr = DAY_DATES[dayKey].replace(/-/g, '')
  const startTime = session.start.replace(':', '') + '00'
  const endTime = session.end.replace(':', '') + '00'

  const dates = `${dateStr}T${startTime}/${dateStr}T${endTime}`
  const location = `Expo Santa Fe, CDMX - ${session.stage}`
  const details = session.speaker ? `Ponente: ${session.speaker}` : ''

  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: session.title,
    dates,
    location,
    details,
    ctz: 'America/Mexico_City',
  })

  return `https://calendar.google.com/calendar/render?${params.toString()}`
}

/**
 * Format a countdown string like "en 23 min" or "en 1 h 5 min".
 */
export function formatCountdown(minutes: number): string {
  if (minutes < 1) return 'ahora'
  if (minutes < 60) return `en ${minutes} min`
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  if (m === 0) return `en ${h} h`
  return `en ${h} h ${m} min`
}
