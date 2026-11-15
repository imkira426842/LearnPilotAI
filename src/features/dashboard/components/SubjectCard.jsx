import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import ProgressBar from '../../../components/ui/ProgressBar'
import { cn } from '../../../lib/cn'
import { subjectThemes } from '../themes'

export default function SubjectCard({ subject }) {
  const theme = subjectThemes[subject.theme] ?? subjectThemes.blue
  const Icon = theme.icon
  return (
    <article className={cn('tw:flex tw:flex-col tw:rounded-2xl tw:border tw:p-4 tw:transition tw:duration-200 tw:hover:-translate-y-1 tw:hover:shadow-card-hover', theme.card)}>
      <Icon size={40} strokeWidth={1.6} className={theme.iconColor} aria-hidden="true" />
      <h3 title={subject.name} className="tw:mt-4 tw:line-clamp-2 tw:min-h-14 tw:text-[19px] tw:font-bold tw:leading-7 tw:tracking-tight tw:text-ink-900">
        {subject.name}
      </h3>
      <p className="tw:mt-1 tw:text-[15px] tw:text-ink-600">{subject.units} {subject.units === 1 ? 'Unit' : 'Units'}</p>
      <div className="tw:mt-3 tw:flex tw:items-center tw:gap-3">
        <ProgressBar value={subject.progress} label={`${subject.name} progress`} className="tw:flex-1" fillClass={theme.bar} />
        <span className="tw:text-[14px] tw:font-semibold tw:text-ink-800">{subject.progress}%</span>
      </div>
      <Link
        to="/curriculum"
        className={cn('tw:mt-4 tw:inline-flex tw:items-center tw:justify-center tw:gap-1.5 tw:rounded-xl tw:border tw:bg-white/50 tw:py-2 tw:text-[15px] tw:font-semibold tw:transition-colors', theme.button)}
      >
        Explore <ArrowRight size={16} aria-hidden="true" />
      </Link>
    </article>
  )
}
