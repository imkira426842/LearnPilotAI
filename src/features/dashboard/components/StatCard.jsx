import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import { cn } from '../../../lib/cn'

/** Statistic tile. `children` replaces the icon tile (used for the progress ring). */
export default function StatCard({ to, label, value, tile = 'tw:bg-brand-50', children }) {
  return (
    <Link
      to={to}
      className="tw:group tw:flex tw:items-center tw:gap-3 tw:rounded-2xl tw:border tw:border-line tw:bg-white tw:p-4 tw:2xl:gap-4 tw:shadow-card tw:transition tw:duration-200 tw:hover:-translate-y-0.5 tw:hover:shadow-card-hover"
    >
      <span className={cn('tw:grid tw:size-[52px] tw:shrink-0 tw:place-items-center tw:rounded-2xl tw:2xl:size-[58px]', tile)}>{children}</span>
      <span className="tw:min-w-0 tw:flex-1">
        <span className="tw:block tw:truncate tw:text-[15px] tw:text-ink-600">{label}</span>
        <span className="tw:block tw:text-[32px] tw:font-bold tw:leading-9 tw:text-ink-900">{value}</span>
      </span>
      <ChevronRight size={22} aria-hidden="true" className="tw:hidden tw:shrink-0 tw:text-ink-300 tw:transition tw:duration-200 tw:group-hover:translate-x-0.5 tw:group-hover:text-brand-600 tw:sm:block tw:wide:hidden tw:2xl:block" />
    </Link>
  )
}
