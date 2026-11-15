import { cn } from '../../lib/cn'

const sizes = {
  md: 'tw:size-11 tw:text-[15px]',
  lg: 'tw:size-[52px] tw:text-[18px]',
}

/** Initials avatar (no photo upload exists yet). */
export default function Avatar({ initials, size = 'md', ring = false, className }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        'tw:inline-grid tw:shrink-0 tw:place-items-center tw:rounded-full tw:bg-linear-to-br tw:from-brand-700 tw:to-ink-900 tw:font-bold tw:tracking-wide tw:text-white',
        ring && 'tw:ring-4 tw:ring-brand-100',
        sizes[size],
        className,
      )}
    >
      {initials}
    </span>
  )
}
