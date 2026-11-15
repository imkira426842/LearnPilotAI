import { Link } from 'react-router-dom'
import { Hourglass } from 'lucide-react'

/** Honest placeholder for sidebar destinations that are not built yet. */
export default function ComingSoon({ title, description, icon: Icon = Hourglass }) {
  return (
    <div className="lp-scope tw:font-sans tw:px-4 tw:pb-10 tw:pt-2 tw:sm:px-5">
      <div className="tw:mx-auto tw:max-w-[560px] tw:rounded-[20px] tw:border tw:border-line tw:bg-white tw:p-8 tw:text-center tw:shadow-card">
        <span className="tw:mx-auto tw:grid tw:size-16 tw:place-items-center tw:rounded-2xl tw:bg-brand-50 tw:text-brand-600">
          <Icon size={32} strokeWidth={1.7} aria-hidden="true" />
        </span>
        <p className="tw:mt-5 tw:text-[12px] tw:font-bold tw:uppercase tw:tracking-[0.14em] tw:text-brand-600">Coming soon</p>
        <h1 className="tw:mt-1.5 tw:text-[28px] tw:font-extrabold tw:leading-9 tw:text-ink-900">{title}</h1>
        <p className="tw:mx-auto tw:mt-3 tw:max-w-md tw:text-[15.5px] tw:leading-6 tw:text-ink-600">{description}</p>
        <div className="tw:mt-6 tw:flex tw:flex-wrap tw:justify-center tw:gap-3">
          <Link to="/" className="tw:rounded-full tw:bg-brand-600 tw:px-5 tw:py-2.5 tw:text-[14.5px] tw:font-semibold tw:text-white tw:transition-colors tw:hover:bg-brand-700">
            Back to dashboard
          </Link>
          <Link to="/planner" className="tw:rounded-full tw:border tw:border-line tw:bg-white tw:px-5 tw:py-2.5 tw:text-[14.5px] tw:font-semibold tw:text-ink-800 tw:transition-colors tw:hover:bg-brand-50">
            Open Study Planner
          </Link>
        </div>
      </div>
    </div>
  )
}
