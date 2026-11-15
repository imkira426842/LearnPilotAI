import {
  Bell, CalendarDays, Cloud, CloudUpload, CircleCheck, ClipboardCheck, Cpu, FileText, Network,
  Sparkles, Trophy, Waypoints,
} from 'lucide-react'

/** Card colours per subject theme. Full class names so Tailwind can see them. */
export const subjectThemes = {
  blue: {
    icon: Cpu,
    card: 'tw:border-brand-100 tw:bg-linear-to-b tw:from-brand-50 tw:to-brand-100',
    iconColor: 'tw:text-brand-600',
    bar: 'tw:bg-brand-600',
    button: 'tw:border-brand-200 tw:text-brand-700 tw:hover:bg-white',
  },
  green: {
    icon: Waypoints,
    card: 'tw:border-emerald-100 tw:bg-linear-to-b tw:from-emerald-50 tw:to-emerald-100/70',
    iconColor: 'tw:text-emerald-600',
    bar: 'tw:bg-emerald-500',
    button: 'tw:border-emerald-200 tw:text-emerald-700 tw:hover:bg-white',
  },
  purple: {
    icon: Network,
    card: 'tw:border-violet-100 tw:bg-linear-to-b tw:from-violet-50 tw:to-violet-100/80',
    iconColor: 'tw:text-violet-600',
    bar: 'tw:bg-violet-600',
    button: 'tw:border-violet-200 tw:text-violet-700 tw:hover:bg-white',
  },
  orange: {
    icon: Cloud,
    card: 'tw:border-orange-100 tw:bg-linear-to-b tw:from-orange-50 tw:to-orange-100/80',
    iconColor: 'tw:text-orange-500',
    bar: 'tw:bg-orange-500',
    button: 'tw:border-orange-200 tw:text-orange-800 tw:hover:bg-white',
  },
}

export const quickActionTones = {
  blue: { row: 'tw:border-brand-100 tw:bg-linear-to-r tw:from-brand-50 tw:to-brand-100/70', icon: 'tw:text-brand-600' },
  purple: { row: 'tw:border-violet-100 tw:bg-linear-to-r tw:from-violet-50 tw:to-violet-100/70', icon: 'tw:text-violet-600' },
  green: { row: 'tw:border-emerald-100 tw:bg-linear-to-r tw:from-emerald-50 tw:to-emerald-100/70', icon: 'tw:text-emerald-600' },
  orange: { row: 'tw:border-orange-100 tw:bg-linear-to-r tw:from-orange-50 tw:to-orange-100/70', icon: 'tw:text-orange-500' },
  indigo: { row: 'tw:border-indigo-100 tw:bg-linear-to-r tw:from-indigo-50 tw:to-indigo-100/70', icon: 'tw:text-indigo-600' },
}

export const quickActions = [
  { title: 'Ask AI', description: 'Get instant help', to: '/assistant', icon: Sparkles, tone: 'blue' },
  { title: 'Generate Notes', description: 'From your syllabus', to: '/notes', icon: FileText, tone: 'purple' },
  { title: 'Take a Quiz', description: 'Test your knowledge', to: '/quiz', icon: ClipboardCheck, tone: 'green' },
  { title: 'Prepare for Exams', description: 'With master questions', to: '/exam-preparation', icon: Trophy, tone: 'orange' },
  { title: 'Upload Syllabus', description: 'Update your curriculum', to: '/curriculum', icon: CloudUpload, tone: 'indigo' },
]

export const activityStyles = {
  exam: { icon: Bell, badge: 'tw:bg-rose-100 tw:text-rose-500' },
  session: { icon: CalendarDays, badge: 'tw:bg-brand-100 tw:text-brand-600' },
  quiz: { icon: CircleCheck, badge: 'tw:bg-emerald-100 tw:text-emerald-600' },
}
