import { useCallback, useRef, useState } from 'react'
import { Check, ChevronDown } from 'lucide-react'
import { useDismiss } from '../../hooks/useDismiss'
import { cn } from '../../lib/cn'

const SEMESTERS = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII']
const STORAGE_KEY = 'learnpilot_semester'

function readStored() {
  try {
    const value = localStorage.getItem(STORAGE_KEY)
    return SEMESTERS.includes(value) ? value : null
  } catch {
    return null
  }
}

/** Semester dropdown. The choice is remembered locally; it does not filter data yet. */
export default function SemesterSelect() {
  const ref = useRef(null)
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState(() => readStored() ?? 'III')
  const close = useCallback(() => setOpen(false), [])
  useDismiss(ref, open, close)

  const choose = (sem) => {
    setValue(sem)
    setOpen(false)
    try { localStorage.setItem(STORAGE_KEY, sem) } catch { /* storage unavailable */ }
  }

  return (
    <div ref={ref} className="tw:relative tw:hidden tw:sm:block">
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className="tw:flex tw:h-[50px] tw:items-center tw:gap-3 tw:rounded-full tw:border tw:border-line tw:bg-white tw:px-5 tw:text-[16px] tw:font-medium tw:text-ink-900 tw:shadow-card tw:transition-colors tw:hover:border-brand-200"
      >
        Sem • {value}
        <ChevronDown size={18} className={cn('tw:text-ink-600 tw:transition-transform', open && 'tw:rotate-180')} aria-hidden="true" />
      </button>
      {open && (
        <ul
          role="listbox"
          aria-label="Select semester"
          className="tw:absolute tw:right-0 tw:top-[calc(100%+8px)] tw:z-50 tw:w-44 tw:rounded-2xl tw:border tw:border-line tw:bg-white tw:p-1.5 tw:shadow-card-hover tw:animate-pop"
        >
          {SEMESTERS.map((sem) => (
            <li key={sem} role="option" aria-selected={sem === value}>
              <button
                type="button"
                onClick={() => choose(sem)}
                className={cn(
                  'tw:flex tw:w-full tw:items-center tw:justify-between tw:rounded-xl tw:px-3 tw:py-2 tw:text-[14.5px]',
                  sem === value ? 'tw:bg-brand-50 tw:font-semibold tw:text-brand-800' : 'tw:text-ink-800 tw:hover:bg-brand-50',
                )}
              >
                Semester {sem}
                {sem === value && <Check size={16} aria-hidden="true" />}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
