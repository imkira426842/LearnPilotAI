import { Link } from 'react-router-dom'
import { ArrowRight, Cpu, Play } from 'lucide-react'
import Panel, { ViewAllLink } from '../../../components/ui/Panel'
import ProgressBar from '../../../components/ui/ProgressBar'
import LectureThumbnail from './LectureThumbnail'

export default function ContinueLearningCard({ item, sample }) {
  return (
    <Panel title="Continue Learning" subtitle="Resume where you left off" sample={sample} action={<ViewAllLink to="/saved" />}>
      <div className="tw:flex tw:flex-col tw:gap-4 tw:sm:flex-row">
        <Link to={item.to} aria-label={`Play ${item.title}`} className="tw:group tw:relative tw:block tw:h-[118px] tw:w-full tw:shrink-0 tw:overflow-hidden tw:rounded-xl tw:sm:w-[165px]">
          <LectureThumbnail className="tw:size-full tw:transition-transform tw:duration-300 tw:group-hover:scale-105" />
          <span className="tw:absolute tw:inset-0 tw:grid tw:place-items-center">
            <span className="tw:grid tw:size-12 tw:place-items-center tw:rounded-full tw:bg-ink-900/80 tw:ring-2 tw:ring-white/90">
              <Play size={20} className="tw:translate-x-0.5 tw:fill-white tw:text-white" aria-hidden="true" />
            </span>
          </span>
        </Link>
        <div className="tw:flex tw:min-w-0 tw:flex-1 tw:flex-col">
          <h3 className="tw:text-[18px] tw:font-bold tw:leading-6 tw:text-ink-900">{item.title}</h3>
          <p className="tw:mt-1 tw:flex tw:items-center tw:gap-1.5 tw:text-[14px] tw:text-brand-600">
            <Cpu size={15} aria-hidden="true" />
            <span className="tw:truncate">{item.subject}</span>
          </p>
          <div className="tw:mt-3 tw:flex tw:items-center tw:gap-3">
            <ProgressBar value={item.progress} label={`${item.title} progress`} className="tw:flex-1" />
            <span className="tw:text-[14px] tw:font-semibold tw:text-ink-800">{item.progress}%</span>
          </div>
          <Link
            to={item.to}
            className="tw:mt-3.5 tw:inline-flex tw:w-fit tw:items-center tw:gap-2 tw:rounded-full tw:bg-brand-600 tw:px-5 tw:py-2.5 tw:text-[14.5px] tw:font-semibold tw:text-white tw:transition-colors tw:hover:bg-brand-700"
          >
            Continue Watching <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </Panel>
  )
}
