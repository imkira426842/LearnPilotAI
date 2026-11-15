import { Info } from 'lucide-react'
import { DEMO_MODE } from '../../config/flags'
import { useUser } from '../../context/UserContext'
import ContinueLearningCard from './components/ContinueLearningCard'
import DashboardSkeleton from './components/DashboardSkeleton'
import HeroBanner from './components/HeroBanner'
import QuickActionsPanel from './components/QuickActionsPanel'
import QuoteCard from './components/QuoteCard'
import StatsRow from './components/StatsRow'
import SubjectsPanel from './components/SubjectsPanel'
import UpcomingActivitiesCard from './components/UpcomingActivitiesCard'
import { useDashboardData } from './useDashboardData'

function ApiNotice({ errors, onRetry }) {
  if (!errors.length) return null
  return (
    <div role="alert" className="tw:mb-4 tw:flex tw:flex-wrap tw:items-center tw:gap-3 tw:rounded-2xl tw:border tw:border-amber-200 tw:bg-amber-50 tw:px-4 tw:py-3 tw:text-[14.5px] tw:text-amber-900">
      <Info size={18} className="tw:shrink-0" aria-hidden="true" />
      <span className="tw:flex-1">
        Couldn’t load some of your data ({errors[0]}). Sample data is shown for those sections.
      </span>
      <button type="button" onClick={onRetry} className="tw:rounded-full tw:border tw:border-amber-300 tw:bg-white tw:px-3.5 tw:py-1 tw:text-[13.5px] tw:font-semibold tw:hover:bg-amber-100">
        Retry
      </button>
    </div>
  )
}

/** Presentational dashboard: everything it shows comes from props, so it is easy to test. */
export function DashboardView({ user, loading, data, errors = [], onRetry, showSampleBadges = true }) {
  const flag = (section) => showSampleBadges && data.isSample[section]
  return (
    <div className="lp-scope tw:font-sans tw:px-4 tw:pb-8 tw:text-ink-900 tw:sm:px-5">
      <ApiNotice errors={errors} onRetry={onRetry} />
      <HeroBanner firstName={user.firstName} />
      {loading ? (
        <DashboardSkeleton />
      ) : (
        <>
          <div className="tw:mt-4">
            <StatsRow stats={data.stats} />
          </div>
          <div className="tw:mt-4 tw:grid tw:gap-4 tw:wide:grid-cols-[minmax(0,1fr)_306px]">
            <div className="tw:flex tw:min-w-0 tw:flex-col tw:gap-4">
              <SubjectsPanel subjects={data.subjects} sample={flag('subjects')} />
              <div className="tw:grid tw:gap-4 tw:md:grid-cols-[1.3fr_1fr]">
                <ContinueLearningCard item={data.continueLearning} sample={flag('continueLearning')} />
                <UpcomingActivitiesCard items={data.upcoming} sample={flag('upcoming')} />
              </div>
            </div>
            <div className="tw:flex tw:min-w-0 tw:flex-col tw:gap-4">
              <QuickActionsPanel />
              <QuoteCard className="tw:flex-1" />
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default function DashboardPage() {
  const { user } = useUser()
  const { loading, data, reload } = useDashboardData()
  return (
    <DashboardView
      user={user}
      loading={loading}
      data={data}
      errors={data.errors}
      onRetry={reload}
      showSampleBadges={!DEMO_MODE}
    />
  )
}
