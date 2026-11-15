import { Link, NavLink } from 'react-router-dom'
import { LogOut, X } from 'lucide-react'
import { primaryNav, secondaryNav } from '../../config/navigation'
import { cn } from '../../lib/cn'
import Avatar from '../ui/Avatar'
import LogoMark from '../ui/LogoMark'

const itemBase =
  'tw:flex tw:items-center tw:gap-3 tw:rounded-xl tw:px-3.5 tw:py-[13px] tw:text-[15px] tw:font-medium tw:transition-colors tw:duration-150'
const itemIdle = 'tw:text-ink-800 tw:hover:bg-brand-50 tw:hover:text-brand-700'
const itemActive = 'tw:bg-brand-600 tw:text-white tw:shadow-[0_10px_22px_-10px_rgba(36,87,232,0.75)]'

function NavItem({ item, onNavigate }) {
  const Icon = item.icon
  return (
    <li>
      <NavLink
        to={item.to}
        end={item.end}
        onClick={onNavigate}
        className={({ isActive }) => cn(itemBase, isActive ? itemActive : itemIdle)}
      >
        <Icon size={22} strokeWidth={1.75} className="tw:shrink-0" aria-hidden="true" />
        <span className="tw:truncate">{item.label}</span>
      </NavLink>
    </li>
  )
}

/** Fixed sidebar on large screens, slide-in drawer below 1024px. */
export default function Sidebar({ open, onClose, user, onLogout }) {
  return (
    <>
      {open && (
        <button
          type="button"
          aria-label="Close navigation"
          onClick={onClose}
          className="lp-scope tw:fixed tw:inset-0 tw:z-40 tw:bg-ink-900/40 tw:backdrop-blur-[2px] tw:lg:hidden"
        />
      )}
      <aside
        id="app-sidebar"
        aria-label="Sidebar"
        className={cn(
          'lp-scope tw:font-sans tw:fixed tw:inset-y-0 tw:left-0 tw:z-50 tw:flex tw:w-[280px] tw:max-w-[86vw] tw:flex-col tw:border-r tw:border-line tw:bg-white tw:px-5 tw:pb-5 tw:pt-7',
          'tw:transition-[transform,visibility] tw:duration-200 tw:lg:visible tw:lg:translate-x-0',
          open ? 'tw:visible tw:translate-x-0 tw:shadow-2xl' : 'tw:invisible tw:-translate-x-full',
        )}
      >
        <div className="tw:mb-6 tw:flex tw:items-start tw:justify-between tw:gap-2 tw:px-1">
          <Link to="/" onClick={onClose} className="tw:flex tw:items-center tw:gap-3" aria-label="LearnPilot AI home">
            <LogoMark className="tw:size-12 tw:shrink-0" />
            <span>
              <span className="tw:block tw:text-[22px] tw:font-bold tw:leading-6 tw:tracking-tight tw:text-brand-800">LearnPilot AI</span>
              <span className="tw:mt-1 tw:block tw:max-w-[150px] tw:text-[13px] tw:leading-[17px] tw:text-ink-500">Your Smart Learning Companion</span>
            </span>
          </Link>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close navigation"
            className="tw:rounded-lg tw:p-1.5 tw:text-ink-600 tw:hover:bg-brand-50 tw:lg:hidden"
          >
            <X size={22} />
          </button>
        </div>

        <nav aria-label="Main" className="tw:-mr-2 tw:flex tw:min-h-0 tw:flex-1 tw:flex-col tw:overflow-y-auto tw:pr-2">
          <ul className="tw:flex tw:flex-col tw:gap-1">
            {primaryNav.map((item) => <NavItem key={item.to} item={item} onNavigate={onClose} />)}
          </ul>
          <div className="tw:mx-1 tw:my-4 tw:h-px tw:bg-line" role="separator" />
          <ul className="tw:flex tw:flex-col tw:gap-1">
            {secondaryNav.map((item) => <NavItem key={item.to} item={item} onNavigate={onClose} />)}
          </ul>
        </nav>

        <div className="tw:mt-4 tw:rounded-2xl tw:bg-brand-50/80 tw:p-3.5">
          <div className="tw:flex tw:items-center tw:gap-3">
            <Avatar initials={user.initials} size="lg" ring />
            <div className="tw:min-w-0">
              <p className="tw:truncate tw:text-[16px] tw:font-bold tw:text-ink-900">{user.name}</p>
              <p className="tw:truncate tw:text-[13px] tw:text-ink-500">{user.subtitle}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onLogout}
            className="tw:mt-3.5 tw:flex tw:w-full tw:items-center tw:justify-center tw:gap-2 tw:rounded-xl tw:border tw:border-line tw:bg-white tw:py-2.5 tw:text-[15px] tw:font-semibold tw:text-ink-800 tw:transition-colors tw:hover:border-brand-200 tw:hover:bg-brand-50"
          >
            <LogOut size={18} aria-hidden="true" />
            Logout
          </button>
        </div>
      </aside>
    </>
  )
}
