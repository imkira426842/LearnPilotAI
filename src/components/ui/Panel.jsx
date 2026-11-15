import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { cn } from '../../lib/cn'

export function SampleBadge() {
  return (
    <span className="tw:shrink-0 tw:rounded-full tw:bg-amber-100 tw:px-2 tw:py-0.5 tw:text-[11px] tw:font-semibold tw:uppercase tw:tracking-wide tw:text-amber-800">
      Sample data
    </span>
  )
}

/** "View All →" style link used in panel headers. */
export function ViewAllLink({ to, children = 'View All' }) {
  return (
    <Link
      to={to}
      className="tw:inline-flex tw:shrink-0 tw:items-center tw:gap-1.5 tw:text-[15px] tw:font-semibold tw:text-brand-600 tw:transition-colors tw:hover:text-brand-800"
    >
      {children}
      <ArrowRight size={16} strokeWidth={2} aria-hidden="true" />
    </Link>
  )
}

/** White card with a title row. Used by every dashboard section. */
export default function Panel({ title, subtitle, icon: Icon, action, sample = false, compact = false, className, children }) {
  return (
    <section className={cn('tw:rounded-[20px] tw:border tw:border-line tw:bg-white tw:p-4 tw:shadow-card tw:sm:p-5', className)}>
      <header className="tw:mb-4 tw:flex tw:items-start tw:justify-between tw:gap-3">
        <div className="tw:flex tw:min-w-0 tw:items-center tw:gap-2.5">
          {Icon && <Icon size={24} strokeWidth={1.8} className="tw:shrink-0 tw:text-brand-600" aria-hidden="true" />}
          <div className="tw:min-w-0">
            <h2 className={cn('tw:font-bold tw:leading-7 tw:text-ink-900', compact ? 'tw:text-[20px]' : 'tw:text-[22px]')}>{title}</h2>
            {subtitle && <p className="tw:text-[14px] tw:leading-5 tw:text-ink-600">{subtitle}</p>}
          </div>
          {sample && <SampleBadge />}
        </div>
        {action}
      </header>
      {children}
    </section>
  )
}
