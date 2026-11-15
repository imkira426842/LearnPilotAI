import { Link } from 'react-router-dom'
import { ArrowRight, Sparkles } from 'lucide-react'
import HeroIllustration from './HeroIllustration'

export default function HeroBanner({ firstName }) {
  return (
    <section
      aria-labelledby="dashboard-welcome"
      className="tw:relative tw:min-h-[215px] tw:overflow-hidden tw:rounded-[22px] tw:border tw:border-brand-100 tw:bg-linear-to-r tw:from-[#e6edff] tw:via-[#d8e3ff] tw:to-[#c6d6ff] tw:px-6 tw:py-8 tw:sm:px-8 tw:lg:px-9 tw:lg:py-9"
    >
      <div className="tw:relative tw:z-10 tw:max-w-[560px] tw:sm:max-w-[56%] tw:lg:max-w-[560px]">
        <h1 id="dashboard-welcome" className="tw:text-[30px] tw:font-extrabold tw:leading-[1.15] tw:tracking-tight tw:text-ink-900 tw:sm:text-[36px] tw:lg:text-[40px]">
          Welcome back, {firstName}!
        </h1>
        <p className="tw:mt-3 tw:text-[17px] tw:leading-7 tw:text-ink-800 tw:sm:text-[20px]">
          Keep learning, keep growing. You’re doing great! <span aria-hidden="true">🚀</span>
        </p>
        <Link
          to="/assistant"
          className="tw:mt-6 tw:inline-flex tw:items-center tw:gap-2.5 tw:rounded-full tw:bg-brand-600 tw:px-6 tw:py-3.5 tw:text-[16px] tw:font-semibold tw:text-white tw:shadow-[0_14px_26px_-12px_rgba(36,87,232,0.85)] tw:transition tw:duration-200 tw:hover:-translate-y-0.5 tw:hover:bg-brand-700"
        >
          <Sparkles size={19} aria-hidden="true" />
          Ask AI Assistant
          <ArrowRight size={19} aria-hidden="true" />
        </Link>
      </div>
      <HeroIllustration className="tw:pointer-events-none tw:absolute tw:bottom-0 tw:right-0 tw:hidden tw:h-full tw:w-[48%] tw:max-w-[560px] tw:sm:block" />
    </section>
  )
}
