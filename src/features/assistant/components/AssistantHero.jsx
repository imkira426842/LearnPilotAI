import { Check, Sparkles } from 'lucide-react'
import { heroChips } from '../sampleData'
import { BotHero } from './BotArt'

export default function AssistantHero() {
  return (
    <section
      aria-labelledby="assistant-title"
      className="tw:relative tw:overflow-hidden tw:rounded-[22px] tw:border tw:border-brand-100 tw:bg-linear-to-r tw:from-[#e6edff] tw:via-[#d8e3ff] tw:to-[#c6d6ff] tw:px-5 tw:py-6 tw:sm:px-8 tw:lg:px-9 tw:lg:py-7"
    >
      <div className="tw:relative tw:z-10 tw:sm:max-w-[62%] tw:lg:max-w-[640px]">
        <h1 id="assistant-title" className="tw:flex tw:items-center tw:gap-3 tw:text-[28px] tw:font-extrabold tw:leading-tight tw:tracking-tight tw:text-ink-900 tw:sm:text-[34px] tw:lg:text-[38px]">
          <Sparkles size={34} strokeWidth={1.8} className="tw:shrink-0 tw:text-brand-600" aria-hidden="true" />
          AI Study Assistant
        </h1>
        <p className="tw:mt-3 tw:text-[16px] tw:leading-6 tw:text-ink-800 tw:sm:text-[18px]">
          Ask anything about your syllabus, topics, or studies. I’m here to help!
        </p>
        <ul className="tw:mt-5 tw:flex tw:flex-wrap tw:gap-2.5">
          {heroChips.map((chip) => (
            <li
              key={chip}
              className="tw:inline-flex tw:items-center tw:gap-2 tw:rounded-full tw:border tw:border-white/80 tw:bg-white/70 tw:px-3.5 tw:py-1.5 tw:text-[14px] tw:font-medium tw:text-ink-800"
            >
              <span className="tw:grid tw:size-[18px] tw:place-items-center tw:rounded-full tw:bg-emerald-500 tw:text-white">
                <Check size={12} strokeWidth={3} aria-hidden="true" />
              </span>
              {chip}
            </li>
          ))}
        </ul>
      </div>
      <BotHero className="tw:pointer-events-none tw:absolute tw:bottom-0 tw:right-0 tw:hidden tw:h-full tw:w-[40%] tw:max-w-[420px] tw:sm:block" />
    </section>
  )
}
