import { Link } from 'react-router-dom'
import { BookOpen } from 'lucide-react'
import Panel, { ViewAllLink } from '../../../components/ui/Panel'
import SubjectCard from './SubjectCard'

export default function SubjectsPanel({ subjects, sample }) {
  return (
    <Panel title="My Subjects" sample={sample} action={<ViewAllLink to="/curriculum" />}>
      {subjects.length ? (
        <div className="tw:grid tw:grid-cols-1 tw:gap-4 tw:sm:grid-cols-2 tw:xl:grid-cols-4">
          {subjects.map((subject) => <SubjectCard key={subject.id} subject={subject} />)}
        </div>
      ) : (
        <div className="tw:flex tw:flex-col tw:items-center tw:gap-2 tw:rounded-2xl tw:border tw:border-dashed tw:border-line tw:px-6 tw:py-10 tw:text-center">
          <BookOpen size={32} strokeWidth={1.6} className="tw:text-brand-400" aria-hidden="true" />
          <p className="tw:text-[17px] tw:font-semibold tw:text-ink-900">No subjects yet</p>
          <p className="tw:max-w-sm tw:text-[14.5px] tw:text-ink-600">Add a subject or upload your syllabus to see your progress here.</p>
          <Link to="/curriculum" className="tw:mt-2 tw:rounded-full tw:bg-brand-600 tw:px-5 tw:py-2.5 tw:text-[14.5px] tw:font-semibold tw:text-white tw:transition-colors tw:hover:bg-brand-700">
            Set up my curriculum
          </Link>
        </div>
      )}
    </Panel>
  )
}
