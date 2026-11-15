import { Link } from 'react-router-dom'
import Panel from '../../../components/ui/Panel'
import { cn } from '../../../lib/cn'
import { quickActionTones, quickActions } from '../themes'

export default function QuickActionsPanel() {
  return (
    <Panel title="Quick Actions">
      <ul className="tw:grid tw:gap-3 tw:sm:grid-cols-2 tw:xl:grid-cols-3 tw:wide:grid-cols-1">
        {quickActions.map(({ title, description, to, icon: Icon, tone }) => {
          const style = quickActionTones[tone]
          return (
            <li key={title}>
              <Link
                to={to}
                className={cn('tw:flex tw:items-center tw:gap-3.5 tw:rounded-xl tw:border tw:px-3.5 tw:py-2.5 tw:transition tw:duration-200 tw:hover:-translate-y-0.5 tw:hover:shadow-card', style.row)}
              >
                <Icon size={30} strokeWidth={1.7} className={cn('tw:shrink-0', style.icon)} aria-hidden="true" />
                <span className="tw:min-w-0">
                  <span className="tw:block tw:truncate tw:text-[17px] tw:font-semibold tw:leading-6 tw:text-ink-900">{title}</span>
                  <span className="tw:block tw:truncate tw:text-[13.5px] tw:leading-5 tw:text-ink-600">{description}</span>
                </span>
              </Link>
            </li>
          )
        })}
      </ul>
    </Panel>
  )
}
