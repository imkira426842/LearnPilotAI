import { cn } from '../../lib/cn'

/** Accessible horizontal progress bar. `fillClass` supplies the fill colour. */
export default function ProgressBar({ value, label, className, fillClass = 'tw:bg-brand-600' }) {
  const pct = Math.max(0, Math.min(100, Math.round(Number(value) || 0)))
  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={pct}
      className={cn('tw:h-2 tw:overflow-hidden tw:rounded-full tw:bg-ink-300/40', className)}
    >
      <div className={cn('tw:h-full tw:rounded-full tw:transition-[width] tw:duration-500', fillClass)} style={{ width: `${pct}%` }} />
    </div>
  )
}
