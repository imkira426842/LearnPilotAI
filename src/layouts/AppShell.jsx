import { useCallback, useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import Sidebar from '../components/layout/Sidebar'
import Topbar from '../components/layout/Topbar'
import ErrorBoundary from '../components/ui/ErrorBoundary'
import Toast from '../components/ui/Toast'
import { UserProvider, useUser } from '../context/UserContext'

const LOGOUT_MESSAGE =
  'Sign-in is coming soon. You are using a guest profile, so there is nothing to log out of yet.'

function ShellFrame({ children }) {
  const { user } = useUser()
  const { pathname } = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)
  const [toast, setToast] = useState('')
  const closeMenu = useCallback(() => setMenuOpen(false), [])
  const closeToast = useCallback(() => setToast(''), [])

  useEffect(() => { setMenuOpen(false) }, [pathname])

  // Lock page scroll and allow Escape while the mobile drawer is open.
  useEffect(() => {
    if (!menuOpen) return undefined
    const onKey = (event) => { if (event.key === 'Escape') setMenuOpen(false) }
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = previous
      window.removeEventListener('keydown', onKey)
    }
  }, [menuOpen])

  const onLogout = () => setToast(LOGOUT_MESSAGE)

  return (
    <div className="tw:min-h-screen tw:bg-surface">
      <a
        href="#main-content"
        className="lp-scope tw:sr-only tw:focus:not-sr-only tw:focus:fixed tw:focus:left-4 tw:focus:top-4 tw:focus:z-[70] tw:focus:rounded-lg tw:focus:bg-white tw:focus:px-4 tw:focus:py-2 tw:focus:text-brand-700 tw:focus:shadow-card-hover"
      >
        Skip to content
      </a>
      <Sidebar open={menuOpen} onClose={closeMenu} user={user} onLogout={onLogout} />
      <div className="tw:lg:pl-[280px]">
        <Topbar onMenu={() => setMenuOpen(true)} menuOpen={menuOpen} user={user} onLogout={onLogout} />
        <main id="main-content" tabIndex={-1}>
          <ErrorBoundary key={pathname}>{children}</ErrorBoundary>
        </main>
      </div>
      <Toast message={toast} onClose={closeToast} />
    </div>
  )
}

/** App frame: sidebar + topbar around every route. Replaces the legacy Shell (see VITE_LEGACY_SHELL). */
export default function AppShell({ children }) {
  return (
    <UserProvider>
      <ShellFrame>{children}</ShellFrame>
    </UserProvider>
  )
}
