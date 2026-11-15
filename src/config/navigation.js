import {
  Bell, BookMarked, Bot, CalendarDays, CircleHelp, ClipboardCheck, ClipboardList,
  FileText, House, MonitorPlay, Settings, SquarePlay,
} from 'lucide-react'

/** Sidebar items, in the order shown in the design. */
export const primaryNav = [
  { label: 'Dashboard', to: '/', icon: House, end: true },
  { label: 'My Curriculum', to: '/curriculum', icon: BookMarked },
  { label: 'AI Study Assistant', to: '/assistant', icon: Bot },
  { label: 'AI Notes', to: '/notes', icon: FileText },
  { label: 'Quiz Generator', to: '/quiz', icon: ClipboardList },
  { label: 'Exam Preparation', to: '/exam-preparation', icon: ClipboardCheck },
  { label: 'Study Planner', to: '/planner', icon: CalendarDays },
  { label: 'Reminders', to: '/reminders', icon: Bell },
  // Not in the mockup, kept so the existing YouTube lecture search stays reachable.
  { label: 'Recommended Lectures', to: '/lectures', icon: MonitorPlay },
  { label: 'Saved Lectures', to: '/saved', icon: SquarePlay },
]

export const secondaryNav = [
  { label: 'Settings', to: '/settings', icon: Settings },
  { label: 'Help & Support', to: '/help', icon: CircleHelp },
]

export const allNav = [...primaryNav, ...secondaryNav]
