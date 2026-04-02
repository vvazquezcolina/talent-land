'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import type { Session, Priority, DayKey } from '../lib/data'
import { buildGoogleCalendarUrl } from '../lib/time'

interface SessionCardProps {
  session: Session
  dayKey: DayKey
  mode: string
  sessionIndex: number
  isCompleted: boolean
  isPassed: boolean
  onToggleCompleted: () => void
}

const priorityConfig: Record<
  Priority,
  { border: string; badge: string; badgeBg: string; label: string }
> = {
  IMPERDIBLE: {
    border: 'border-l-imperdible',
    badge: 'text-red-300',
    badgeBg: 'bg-red-500/15',
    label: 'IMPERDIBLE',
  },
  ALTA: {
    border: 'border-l-alta',
    badge: 'text-orange-300',
    badgeBg: 'bg-orange-500/15',
    label: 'ALTA',
  },
  MEDIA: {
    border: 'border-l-media',
    badge: 'text-blue-300',
    badgeBg: 'bg-blue-500/15',
    label: 'MEDIA',
  },
  LIBRE: {
    border: 'border-l-libre',
    badge: 'text-gray-400',
    badgeBg: 'bg-gray-500/15',
    label: 'LIBRE',
  },
  DESCANSO: {
    border: 'border-l-descanso',
    badge: 'text-amber-300',
    badgeBg: 'bg-amber-500/15',
    label: 'DESCANSO',
  },
}

function HighlightWarnings({ text }: { text: string }) {
  if (!text) return null
  const hasWarning =
    text.includes('OJO') ||
    text.includes('HONESTAMENTE') ||
    text.includes('OPCIONAL')
  if (hasWarning) {
    return (
      <span className="inline-block bg-amber-500/10 border border-amber-500/20 rounded px-2 py-1 text-amber-200">
        {text}
      </span>
    )
  }
  return <span>{text}</span>
}

// SVG icons as small components to keep JSX clean
function CheckIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}
function PenIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  )
}
function CalIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  )
}
function LinkedInIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  )
}
function ChevronIcon({ expanded }: { expanded: boolean }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  )
}

export default function SessionCard({
  session,
  dayKey,
  mode,
  sessionIndex,
  isCompleted,
  isPassed,
  onToggleCompleted,
}: SessionCardProps) {
  const [expanded, setExpanded] = useState(false)
  const [showNotes, setShowNotes] = useState(false)
  const [userNotes, setUserNotes] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const notesKey = `notes_${mode}_${dayKey}_${sessionIndex}`

  const config = priorityConfig[session.priority]
  const isBreak = session.priority === 'LIBRE' || session.priority === 'DESCANSO'
  const isWorkshop = session.type === 'Workshop'
  const isKeynote = session.type === 'Keynote'
  const hasPrediction = session.prediction.length > 0
  const hasDataNotes = session.notes.length > 0
  const hasExpandable = hasPrediction || hasDataNotes
  const hasSpeaker = session.speaker && session.speaker.length > 0

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(notesKey)
      if (saved !== null) {
        setUserNotes(JSON.parse(saved))
      } else {
        setUserNotes('')
      }
    } catch {
      setUserNotes('')
    }
  }, [notesKey])

  const handleNotesChange = useCallback(
    (value: string) => {
      setUserNotes(value)
      try {
        window.localStorage.setItem(notesKey, JSON.stringify(value))
      } catch {
        // silently fail
      }
    },
    [notesKey]
  )

  useEffect(() => {
    if (textareaRef.current && showNotes) {
      const el = textareaRef.current
      el.style.height = 'auto'
      el.style.height = el.scrollHeight + 'px'
    }
  }, [userNotes, showNotes])

  const hasUserNotes = userNotes.length > 0

  // LIBRE / DESCANSO card (minimal)
  if (isBreak) {
    return (
      <div
        className={`border-l-4 ${config.border} rounded-lg px-3 py-2.5 ${
          session.priority === 'DESCANSO'
            ? 'bg-amber-500/5 border border-amber-500/10'
            : 'bg-surface/30'
        }`}
      >
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono text-slate-500 shrink-0">
            {session.start}-{session.end}
          </span>
          <span
            className={`text-[10px] font-bold ${config.badge} ${config.badgeBg} px-1.5 py-0.5 rounded-full`}
          >
            {config.label}
          </span>
        </div>
        {session.notes && (
          <p className="mt-1 text-[11px] text-slate-500 leading-relaxed">
            {session.notes}
          </p>
        )}
      </div>
    )
  }

  // Regular session card
  let cardBg = 'bg-surface'
  if (isWorkshop) cardBg = 'bg-[color:var(--color-workshop-bg)]'
  if (isKeynote) cardBg = 'bg-[color:var(--color-keynote-bg)]'

  return (
    <div
      className={`border-l-4 ${config.border} ${cardBg} rounded-lg border border-border/50 overflow-hidden transition-smooth ${
        isCompleted ? 'opacity-40' : ''
      }`}
    >
      {/* Main content area - tappable to expand */}
      <div
        className={`px-3 py-3 ${hasExpandable ? 'cursor-pointer active:bg-white/[0.02]' : ''}`}
        onClick={() => hasExpandable && setExpanded(!expanded)}
      >
        {/* Row 1: time + badges */}
        <div className="flex items-center justify-between gap-2 mb-1">
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="text-[11px] font-mono text-slate-400 shrink-0">
              {session.start}-{session.end}
            </span>
            {isPassed && !isCompleted && (
              <span className="text-[9px] bg-slate-500/15 text-slate-500 px-1.5 py-0.5 rounded-full">
                Ya paso
              </span>
            )}
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            {hasUserNotes && !showNotes && (
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
            )}
            <span
              className={`text-[9px] font-bold uppercase tracking-wider ${config.badge} ${config.badgeBg} px-1.5 py-0.5 rounded-full`}
            >
              {config.label}
            </span>
          </div>
        </div>

        {/* Title */}
        <h3
          className={`text-[13px] sm:text-sm font-semibold text-white leading-snug mb-1 ${
            isCompleted ? 'line-through' : ''
          }`}
        >
          {session.title}
        </h3>

        {/* Speaker */}
        {hasSpeaker && (
          <p className="text-[11px] text-slate-400 mb-1.5">{session.speaker}</p>
        )}

        {/* Type + Stage + expand hint */}
        <div className="flex items-center gap-1.5">
          {session.stage && (
            <span className="text-[10px] bg-surface-alt text-slate-400 px-1.5 py-0.5 rounded">
              {session.stage}
            </span>
          )}
          {session.type && (
            <span
              className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                isWorkshop
                  ? 'bg-green-500/15 text-green-300'
                  : isKeynote
                    ? 'bg-pink-500/15 text-pink-300'
                    : session.type === 'Panel'
                      ? 'bg-purple-500/15 text-purple-300'
                      : 'bg-surface-alt text-slate-500'
              }`}
            >
              {session.type}
            </span>
          )}
          {hasExpandable && (
            <span className="ml-auto text-slate-600">
              <ChevronIcon expanded={expanded} />
            </span>
          )}
        </div>
      </div>

      {/* Expandable detail section */}
      {hasExpandable && expanded && (
        <div className="px-3 pb-3 pt-1 border-t border-border/30">
          {hasPrediction && (
            <div className="mb-2">
              <p className="text-[10px] uppercase tracking-wider text-slate-600 font-semibold mb-1">
                De que creo que trata
              </p>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                {session.prediction}
              </p>
            </div>
          )}
          {hasDataNotes && (
            <div>
              <p className="text-[10px] uppercase tracking-wider text-slate-600 font-semibold mb-1">
                Para ti
              </p>
              <p className="text-[11px] leading-relaxed">
                <HighlightWarnings text={session.notes} />
              </p>
            </div>
          )}
        </div>
      )}

      {/* Action buttons - icon-only on mobile, text on larger */}
      <div className="px-3 pb-2.5 flex items-center gap-1.5">
        {/* Complete */}
        <button
          onClick={(e) => { e.stopPropagation(); onToggleCompleted() }}
          className={`inline-flex items-center justify-center gap-1 text-[11px] px-2.5 py-1.5 rounded-full transition-smooth active:scale-95 ${
            isCompleted
              ? 'bg-green-500/20 text-green-400 border border-green-500/30'
              : 'bg-surface-alt text-slate-500 active:text-slate-300'
          }`}
        >
          <CheckIcon />
          <span className="hidden sm:inline">{isCompleted ? 'Listo' : 'Completar'}</span>
        </button>

        {/* Notes */}
        <button
          onClick={(e) => { e.stopPropagation(); setShowNotes(!showNotes) }}
          className={`inline-flex items-center justify-center gap-1 text-[11px] px-2.5 py-1.5 rounded-full transition-smooth active:scale-95 ${
            showNotes
              ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
              : hasUserNotes
                ? 'bg-blue-500/10 text-blue-400'
                : 'bg-surface-alt text-slate-500 active:text-slate-300'
          }`}
        >
          <PenIcon />
          <span className="hidden sm:inline">Notas</span>
        </button>

        {/* Calendar */}
        <a
          href={buildGoogleCalendarUrl(session, dayKey)}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="inline-flex items-center justify-center gap-1 text-[11px] px-2.5 py-1.5 rounded-full bg-surface-alt text-slate-500 active:text-slate-300 transition-smooth active:scale-95"
        >
          <CalIcon />
          <span className="hidden sm:inline">Calendar</span>
        </a>

        {/* LinkedIn */}
        {hasSpeaker && (
          <a
            href={`https://www.linkedin.com/search/results/all/?keywords=${encodeURIComponent(session.speaker)}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="inline-flex items-center justify-center gap-1 text-[11px] px-2.5 py-1.5 rounded-full bg-surface-alt text-slate-500 active:text-slate-300 transition-smooth active:scale-95"
          >
            <LinkedInIcon />
            <span className="hidden sm:inline">LinkedIn</span>
          </a>
        )}
      </div>

      {/* Notes textarea */}
      {showNotes && (
        <div className="px-3 pb-3">
          <textarea
            ref={textareaRef}
            value={userNotes}
            onChange={(e) => handleNotesChange(e.target.value)}
            onClick={(e) => e.stopPropagation()}
            placeholder="Escribe tus notas aqui..."
            className="w-full bg-background border border-border/50 rounded-lg px-3 py-2.5 text-xs text-slate-300 placeholder-slate-600 resize-none focus:outline-none focus:border-blue-500/40 transition-smooth"
            style={{ minHeight: '70px', fontSize: '14px' }}
            rows={3}
          />
        </div>
      )}
    </div>
  )
}
