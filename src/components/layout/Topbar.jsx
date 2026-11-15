import { Menu } from 'lucide-react'
import GlobalSearch from './GlobalSearch'
import NotificationsMenu from './NotificationsMenu'
import ProfileMenu from './ProfileMenu'
import SemesterSelect from './SemesterSelect'

export default function Topbar({ onMenu, menuOpen, user, onLogout }) {
  return (
    <header className="lp-scope tw:font-sans tw:sticky tw:top-0 tw:z-30 tw:flex tw:items-center tw:gap-3 tw:bg-surface/90 tw:px-4 tw:py-[22px] tw:backdrop-blur tw:sm:px-5 tw:lg:px-6">
      <button
        type="button"
        onClick={onMenu}
        aria-label="Open navigation"
        aria-controls="app-sidebar"
        aria-expanded={menuOpen}
        className="tw:grid tw:size-[50px] tw:shrink-0 tw:place-items-center tw:rounded-full tw:border tw:border-line tw:bg-white tw:text-ink-800 tw:shadow-card tw:lg:hidden"
      >
        <Menu size={22} aria-hidden="true" />
      </button>
      <GlobalSearch />
      <div className="tw:ml-auto tw:flex tw:shrink-0 tw:items-center tw:gap-2 tw:sm:gap-4">
        <SemesterSelect />
        <NotificationsMenu />
        <ProfileMenu user={user} onLogout={onLogout} />
      </div>
    </header>
  )
}
