import { ChevronRight, Zap } from 'lucide-react'
import { quickActionTones } from '../../dashboard/themes'
import { assistantQuickActions } from '../sampleData'
import { cn } from '../../../lib/cn'

/** Each action pre-fills (or just focuses) the composer. Nothing is sent without the student's OK. */
export default function QuickActionsCard({ onPick, className }) {
  return (
    <section aria-labelledby="qa-title" className={cn('tw:rounded-[20px] tw:border tw:border-line tw:bg-white tw:p-4 tw:shadow-card', className)}>
      <h2 id="qa-title" className="tw:mb-3 tw:flex tw:items-center tw:gap-2.5 tw:text-[20px] tw:font-bold tw:text-ink-900">
        <Zap size={24} strokeWidth={1.8} className="tw:text-brand-600" aria-hidden="true" />
        Quick Actions
      </h2>
      <ul className="tw:grid tw:gap-2.5 tw:sm:grid-cols-2 tw:wide:grid-cols-1">
        {assistantQuickActions.map((action) => {
          const tone = quickActionTones[action.tone]
          const Icon = action.icon
          return (
            <li key={action.id}>
              <button
                type="button"
                onClick={() => onPick(action)}
                className={cn('tw:flex tw:w-full tw:items-center tw:gap-3 tw:rounded-xl tw:border tw:px-3.5 tw:py-3 tw:text-left tw:transition tw:duration-200 tw:hover:-translate-y-0.5 tw:hover:shadow-card', tone.row)}
              >
                <Icon size={28} strokeWidth={1.7} className={cn('tw:shrink-0', tone.icon)} aria-hidden="true" />
                <span className="tw:min-w-0 tw:flex-1">
                  <span className="tw:block tw:truncate tw:text-[16px] tw:font-semibold tw:leading-6 tw:text-ink-900">{action.title}</span>
                  <span className="tw:block tw:truncate tw:text-[13.5px] tw:leading-5 tw:text-ink-600">{action.description}</span>
                </span>
                <ChevronRight size={20} className="tw:shrink-0 tw:text-brand-600" aria-hidden="true" />
              </button>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
