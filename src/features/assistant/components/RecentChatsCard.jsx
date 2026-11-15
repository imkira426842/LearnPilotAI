import { ArrowRight, MessagesSquare } from 'lucide-react'
import { SampleBadge } from '../../../components/ui/Panel'
import { cn } from '../../../lib/cn'

/**
 * SAMPLE DATA. The API keeps one flat history per profile, with no chat sessions yet, so these
 * rows are illustrative and not clickable. "View All" is disabled for the same reason.
 */
export default function RecentChatsCard({ chats, className }) {
  return (
    <section aria-labelledby="rc-title" className={cn('tw:rounded-[20px] tw:border tw:border-line tw:bg-white tw:p-4 tw:shadow-card', className)}>
      <header className="tw:mb-3 tw:flex tw:items-center tw:justify-between tw:gap-3">
        <div className="tw:flex tw:min-w-0 tw:items-center tw:gap-2.5">
          <h2 id="rc-title" className="tw:text-[20px] tw:font-bold tw:text-ink-900">Recent Chats</h2>
          <SampleBadge />
        </div>
        <button
          type="button"
          disabled
          title="Chat sessions arrive with the next backend milestone"
          className="tw:inline-flex tw:shrink-0 tw:cursor-not-allowed tw:items-center tw:gap-1.5 tw:text-[14.5px] tw:font-semibold tw:text-brand-600 tw:opacity-60"
        >
          View All <ArrowRight size={16} aria-hidden="true" />
        </button>
      </header>
      <ul className="tw:flex tw:flex-col tw:gap-1">
        {chats.map((chat, index) => (
          <li
            key={chat.id}
            className={cn('tw:flex tw:items-center tw:gap-3 tw:rounded-xl tw:px-3 tw:py-2.5', index === 0 && 'tw:bg-brand-50')}
          >
            <span className="tw:grid tw:size-9 tw:shrink-0 tw:place-items-center tw:rounded-lg tw:bg-brand-100 tw:text-brand-600">
              <MessagesSquare size={18} aria-hidden="true" />
            </span>
            <span className="tw:min-w-0">
              <span className="tw:block tw:truncate tw:text-[15px] tw:font-medium tw:text-ink-900">{chat.title}</span>
              <span className="tw:block tw:text-[13px] tw:text-ink-500">{chat.ago}</span>
            </span>
          </li>
        ))}
      </ul>
    </section>
  )
}
