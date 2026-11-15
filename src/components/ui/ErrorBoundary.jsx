import { Component } from 'react'
import { Link } from 'react-router-dom'
import { TriangleAlert } from 'lucide-react'

/**
 * Keeps a crash inside one page from blanking the whole app: the sidebar and topbar stay usable.
 * AppShell renders it with key={pathname}, so navigating to another page resets it.
 */
export default class ErrorBoundary extends Component {
  state = { failed: false }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  componentDidCatch(error, info) {
    console.error('Page crashed:', error, info?.componentStack)
  }

  render() {
    if (!this.state.failed) return this.props.children
    return (
      <div role="alert" className="lp-scope tw:font-sans tw:px-4 tw:pb-10 tw:pt-2 tw:sm:px-5">
        <div className="tw:mx-auto tw:max-w-[520px] tw:rounded-[20px] tw:border tw:border-line tw:bg-white tw:p-8 tw:text-center tw:shadow-card">
          <span className="tw:mx-auto tw:grid tw:size-14 tw:place-items-center tw:rounded-2xl tw:bg-rose-50 tw:text-rose-500">
            <TriangleAlert size={28} strokeWidth={1.8} aria-hidden="true" />
          </span>
          <h1 className="tw:mt-4 tw:text-[22px] tw:font-extrabold tw:text-ink-900">This page ran into a problem</h1>
          <p className="tw:mt-2 tw:text-[15px] tw:leading-6 tw:text-ink-600">
            The rest of the app still works. Try reloading, or head back to the dashboard.
          </p>
          <div className="tw:mt-5 tw:flex tw:flex-wrap tw:justify-center tw:gap-3">
            <button type="button" onClick={() => window.location.reload()} className="tw:rounded-full tw:bg-brand-600 tw:px-5 tw:py-2.5 tw:text-[14.5px] tw:font-semibold tw:text-white tw:hover:bg-brand-700">
              Reload page
            </button>
            <Link to="/" className="tw:rounded-full tw:border tw:border-line tw:bg-white tw:px-5 tw:py-2.5 tw:text-[14.5px] tw:font-semibold tw:text-ink-800 tw:hover:bg-brand-50">
              Back to dashboard
            </Link>
          </div>
        </div>
      </div>
    )
  }
}
