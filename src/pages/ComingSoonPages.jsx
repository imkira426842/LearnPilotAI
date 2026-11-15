import { Bell, CircleHelp, ClipboardCheck } from 'lucide-react'
import ComingSoon from './ComingSoon'

export const ExamPreparation = () => (
  <ComingSoon
    icon={ClipboardCheck}
    title="Exam Preparation"
    description="Master question banks and exam-focused revision plans are on the roadmap. For now, generate a quiz or revision notes from the sidebar."
  />
)

export const Reminders = () => (
  <ComingSoon
    icon={Bell}
    title="Reminders"
    description="Study reminders and notifications are planned for a later release. Track your tasks in the Study Planner meanwhile."
  />
)

export const HelpSupport = () => (
  <ComingSoon
    icon={CircleHelp}
    title="Help & Support"
    description="A help centre is coming soon. The project README covers setup, and the AI Study Assistant can answer study questions."
  />
)
