const block = 'tw:animate-pulse tw:rounded-2xl tw:bg-white tw:border tw:border-line'

/** Placeholder shown while subjects and tasks load, so sample data never flashes before live data. */
export default function DashboardSkeleton() {
  return (
    <div className="tw:mt-4 tw:flex tw:flex-col tw:gap-4" role="status" aria-label="Loading your dashboard">
      <div className="tw:grid tw:grid-cols-1 tw:gap-4 tw:sm:grid-cols-2 tw:xl:grid-cols-4">
        {[0, 1, 2, 3].map((i) => <div key={i} className={`${block} tw:h-[92px]`} />)}
      </div>
      <div className={`${block} tw:h-[300px]`} />
      <div className="tw:grid tw:gap-4 tw:md:grid-cols-2">
        <div className={`${block} tw:h-[200px]`} />
        <div className={`${block} tw:h-[200px]`} />
      </div>
    </div>
  )
}
