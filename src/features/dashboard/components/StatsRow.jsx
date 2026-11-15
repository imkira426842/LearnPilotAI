import { BookOpen, Check, Layers } from 'lucide-react'
import ProgressRing from '../../../components/ui/ProgressRing'
import StatCard from './StatCard'

export default function StatsRow({ stats }) {
  return (
    <div className="tw:grid tw:grid-cols-1 tw:gap-4 tw:sm:grid-cols-2 tw:wide:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1.1fr)_minmax(0,1.3fr)]">
      <StatCard to="/curriculum" label="Total Subjects" value={stats.subjects} tile="tw:bg-brand-50">
        <BookOpen size={30} strokeWidth={1.9} className="tw:fill-brand-200 tw:text-brand-600" aria-hidden="true" />
      </StatCard>
      <StatCard to="/curriculum" label="Syllabus Units" value={stats.units} tile="tw:bg-emerald-50">
        <Layers size={30} strokeWidth={1.9} className="tw:fill-emerald-200 tw:text-emerald-600" aria-hidden="true" />
      </StatCard>
      <StatCard to="/curriculum" label="Topics Completed" value={stats.topicsCompleted} tile="tw:bg-emerald-50">
        <span className="tw:grid tw:size-[34px] tw:place-items-center tw:rounded-full tw:bg-emerald-500">
          <Check size={22} strokeWidth={3} className="tw:text-white" aria-hidden="true" />
        </span>
      </StatCard>
      <StatCard to="/curriculum" label="Overall Progress" value={`${stats.progress}%`} tile="">
        <ProgressRing value={stats.progress} size={64} stroke={9} label={`Overall progress ${stats.progress}%`} />
      </StatCard>
    </div>
  )
}
