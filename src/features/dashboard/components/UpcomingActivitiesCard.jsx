import { Link } from 'react-router-dom'
import { CalendarCheck } from 'lucide-react'
import Panel, { ViewAllLink } from '../../../components/ui/Panel'
import { cn } from '../../../lib/cn'
import { describeWhen } from '../format'
import { activityStyles } from '../themes'

export default function UpcomingActivitiesCard({ items, sample, now = new Date() }) {
  return (
    <Panel compact title="Upcoming Activities" icon={CalendarCheck} sample={sample} action={<ViewAllLink to="/planner" />}>
      {items.length ? (
        <ul className="tw:flex tw:flex-col tw:gap-3.5">
          {items.map((item) => {
            const style = activityStyles[item.kind] ?? activityStyles.session
            const Icon = style.icon
            return (
              <li key={item.id} className="tw:flex tw:items-center tw:gap-3.5">
                <span className={cn('tw:grid tw:size-11 tw:shrink-0 tw:place-items-center tw:rounded-full', style.badge)}>
                  <Icon size={21} strokeWidth={1.9} aria-hidden="true" />
                </span>
                <div className="tw:min-w-0">
                  <p className="tw:truncate tw:text-[16px] tw:font-semibold tw:leading-5 tw:text-ink-900">{item.title}</p>
                  <p className="tw:truncate tw:text-[14px] tw:text-ink-600">
                    {item.when ? describeWhen(item.when, item.hasTime, now) : item.fallbackDetail}
                  </p>
                </div>
              </li>
            )
          })}
        </ul>
      ) : (
        <div className="tw:rounded-2xl tw:border tw:border-dashed tw:border-line tw:px-4 tw:py-6 tw:text-center">
          <p className="tw:text-[15px] tw:font-semibold tw:text-ink-900">Nothing scheduled</p>
          <p className="tw:mt-1 tw:text-[14px] tw:text-ink-600">Add a task in your study planner to see it here.</p>
          <Link to="/planner" className="tw:mt-3 tw:inline-block tw:text-[14.5px] tw:font-semibold tw:text-brand-600 tw:hover:text-brand-800">Open Study Planner</Link>
        </div>
      )}
    </Panel>
  )
}
