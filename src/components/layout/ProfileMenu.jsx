import { useCallback, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronDown, CircleHelp, LogOut, Settings } from 'lucide-react'
import { useDismiss } from '../../hooks/useDismiss'
import { cn } from '../../lib/cn'
import Avatar from '../ui/Avatar'

const itemClass = 'tw:flex tw:w-full tw:items-center tw:gap-3 tw:rounded-xl tw:px-3 tw:py-2.5 tw:text-[14.5px] tw:font-medium tw:text-ink-800 tw:hover:bg-brand-50'

export default function ProfileMenu({ user, onLogout }) {
  const ref = useRef(null)
  const [open, setOpen] = useState(false)
  const close = useCallback(() => setOpen(false), [])
  useDismiss(ref, open, close)

  return (
    <div ref={ref} className="tw:relative">
      <button
        type="button"
        aria-haspopup="true"
        aria-expanded={open}
        aria-label="Account menu"
        onClick={() => setOpen((o) => !o)}
        className="tw:flex tw:items-center tw:gap-2 tw:rounded-full tw:p-0.5 tw:transition-colors tw:hover:bg-white"
      >
        <Avatar initials={user.initials} size="lg" ring />
        <ChevronDown size={18} className={cn('tw:hidden tw:text-ink-600 tw:transition-transform tw:sm:block', open && 'tw:rotate-180')} aria-hidden="true" />
      </button>
      {open && (
        <div className="tw:absolute tw:right-0 tw:top-[calc(100%+8px)] tw:z-50 tw:w-60 tw:rounded-2xl tw:border tw:border-line tw:bg-white tw:p-1.5 tw:shadow-card-hover tw:animate-pop">
          <div className="tw:px-3 tw:pb-2.5 tw:pt-2">
            <p className="tw:truncate tw:text-[15px] tw:font-bold tw:text-ink-900">{user.name}</p>
            <p className="tw:truncate tw:text-[13px] tw:text-ink-500">{user.subtitle}</p>
          </div>
          <div className="tw:my-1 tw:h-px tw:bg-line" role="separator" />
          <Link to="/settings" onClick={close} className={itemClass}><Settings size={18} aria-hidden="true" /> Settings</Link>
          <Link to="/help" onClick={close} className={itemClass}><CircleHelp size={18} aria-hidden="true" /> Help & Support</Link>
          <div className="tw:my-1 tw:h-px tw:bg-line" role="separator" />
          <button type="button" onClick={() => { close(); onLogout() }} className={itemClass}><LogOut size={18} aria-hidden="true" /> Logout</button>
        </div>
      )}
    </div>
  )
}
