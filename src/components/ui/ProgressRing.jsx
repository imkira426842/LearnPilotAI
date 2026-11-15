import { cn } from '../../lib/cn'

/** Circular progress indicator (starts at 12 o'clock). Colours come from `trackClass` / `barClass`. */
export default function ProgressRing({
  value,
  size = 64,
  stroke = 9,
  trackClass = 'tw:text-emerald-100',
  barClass = 'tw:text-emerald-500',
  label,
}) {
  const pct = Math.max(0, Math.min(100, Math.round(Number(value) || 0)))
  const radius = (size - stroke) / 2
  const circumference = 2 * Math.PI * radius
  const common = { cx: size / 2, cy: size / 2, r: radius, fill: 'none', strokeWidth: stroke }
  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      role="img"
      aria-label={label ?? `${pct}% complete`}
      className="tw:-rotate-90"
    >
      <circle {...common} stroke="currentColor" className={trackClass} />
      <circle
        {...common}
        stroke="currentColor"
        strokeLinecap="round"
        strokeDasharray={`${(circumference * pct) / 100} ${circumference}`}
        className={cn('tw:transition-[stroke-dasharray] tw:duration-500', barClass)}
      />
    </svg>
  )
}
