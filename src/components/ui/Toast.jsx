import { useEffect } from 'react'
import { Info, X } from 'lucide-react'

/** Small status message at the bottom of the screen. Dismisses itself after `duration` ms. */
export default function Toast({ message, onClose, duration = 5000 }) {
  useEffect(() => {
    if (!message) return undefined
    const timer = setTimeout(onClose, duration)
    return () => clearTimeout(timer)
  }, [message, onClose, duration])

  if (!message) return null
  return (
    <div
      role="status"
      aria-live="polite"
      className="lp-scope tw:font-sans tw:fixed tw:inset-x-4 tw:bottom-5 tw:z-[60] tw:mx-auto tw:flex tw:max-w-md tw:items-start tw:gap-3 tw:rounded-2xl tw:bg-ink-900 tw:px-4 tw:py-3.5 tw:text-[14.5px] tw:leading-5 tw:text-white tw:shadow-card-hover tw:animate-pop"
    >
      <Info size={20} className="tw:mt-0.5 tw:shrink-0 tw:text-brand-300" aria-hidden="true" />
      <p className="tw:flex-1">{message}</p>
      <button type="button" onClick={onClose} aria-label="Dismiss message" className="tw:rounded-md tw:p-0.5 tw:text-ink-300 tw:hover:text-white">
        <X size={18} />
      </button>
    </div>
  )
}
