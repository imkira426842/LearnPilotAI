import { useCallback, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Bell } from 'lucide-react'
import { SAMPLE_NOTIFICATIONS } from '../../config/sampleNotifications'
import { useDismiss } from '../../hooks/useDismiss'

/** Bell with an unread badge. Uses placeholder notifications until reminders exist. */
export default function NotificationsMenu() {
  const ref = useRef(null)
  const [open, setOpen] = useState(false)
  const [unread, setUnread] = useState(SAMPLE_NOTIFICATIONS.length)
  const close = useCallback(() => setOpen(false), [])
  useDismiss(ref, open, close)

  return (
    <div ref={ref} className="tw:relative">
      <button
        type="button"
        aria-haspopup="true"
        aria-expanded={open}
        aria-label={unread ? `Notifications, ${unread} unread` : 'Notifications'}
        onClick={() => setOpen((o) => !o)}
        className="tw:relative tw:grid tw:size-[50px] tw:place-items-center tw:rounded-full tw:border tw:border-line tw:bg-white tw:text-ink-800 tw:shadow-card tw:transition-colors tw:hover:border-brand-200 tw:hover:bg-brand-50"
      >
        <Bell size={22} strokeWidth={1.8} aria-hidden="true" />
        {unread > 0 && (
          <span className="tw:absolute tw:-right-0.5 tw:-top-0.5 tw:grid tw:h-5 tw:min-w-5 tw:place-items-center tw:rounded-full tw:bg-rose-500 tw:px-1 tw:text-[11px] tw:font-bold tw:text-white">
            {unread}
          </span>
        )}
      </button>
      {open && (
        <div className="tw:absolute tw:right-0 tw:top-[calc(100%+8px)] tw:z-50 tw:w-[min(320px,calc(100vw-2rem))] tw:rounded-2xl tw:border tw:border-line tw:bg-white tw:p-2 tw:shadow-card-hover tw:animate-pop">
          <div className="tw:flex tw:items-center tw:justify-between tw:px-3 tw:py-2">
            <h2 className="tw:text-[15px] tw:font-bold tw:text-ink-900">Notifications</h2>
            <button type="button" onClick={() => setUnread(0)} disabled={!unread} className="tw:text-[13px] tw:font-semibold tw:text-brand-600 tw:hover:text-brand-800 tw:disabled:text-ink-300">
              Mark all read
            </button>
          </div>
          <ul>
            {SAMPLE_NOTIFICATIONS.map((n) => (
              <li key={n.id} className="tw:rounded-xl tw:px-3 tw:py-2.5 tw:hover:bg-brand-50">
                <p className="tw:text-[14px] tw:font-semibold tw:text-ink-900">{n.title}</p>
                <p className="tw:text-[13px] tw:text-ink-600">{n.detail}</p>
              </li>
            ))}
          </ul>
          <div className="tw:mt-1 tw:flex tw:items-center tw:justify-between tw:border-t tw:border-line tw:px-3 tw:pb-1 tw:pt-2.5">
            <span className="tw:text-[12px] tw:text-ink-400">Sample notifications</span>
            <Link to="/reminders" onClick={close} className="tw:text-[13px] tw:font-semibold tw:text-brand-600 tw:hover:text-brand-800">Open reminders</Link>
          </div>
        </div>
      )}
    </div>
  )
}
