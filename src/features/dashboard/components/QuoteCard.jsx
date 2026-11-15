import { Quote } from 'lucide-react'
import { cn } from '../../../lib/cn'
import MountainIllustration from './MountainIllustration'

export default function QuoteCard({ className }) {
  return (
    <figure className={cn('tw:relative tw:min-h-[122px] tw:overflow-hidden tw:rounded-[20px] tw:border tw:border-brand-100 tw:bg-linear-to-br tw:from-brand-50 tw:to-brand-100 tw:p-5', className)}>
      <Quote size={26} className="tw:fill-brand-600 tw:text-brand-600" aria-hidden="true" />
      <blockquote className="tw:relative tw:z-10 tw:mt-2 tw:max-w-[190px] tw:text-[17px] tw:font-semibold tw:leading-6 tw:text-ink-900">
        Dream big, study hard, achieve more!
      </blockquote>
      <figcaption className="tw:relative tw:z-10 tw:mt-1.5 tw:text-[13.5px] tw:text-ink-600">— LearnPilot AI</figcaption>
      <MountainIllustration className="tw:pointer-events-none tw:absolute tw:bottom-0 tw:right-0 tw:w-[48%] tw:max-w-[170px]" />
    </figure>
  )
}
