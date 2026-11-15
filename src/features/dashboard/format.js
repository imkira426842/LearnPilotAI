/** Parses "YYYY-MM-DD" as a local calendar date (avoids the UTC off-by-one of new Date(string)). */
export function parseDateOnly(value) {
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(String(value ?? ''))
  if (!match) return null
  return new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]))
}

const startOfDay = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate())

export function daysBetween(from, to) {
  return Math.round((startOfDay(to) - startOfDay(from)) / 86_400_000)
}

/** "in 5 days • Nov 20, 2026", "Tomorrow • 7:00 PM", "Overdue • Nov 10, 2026" ... */
export function describeWhen(date, hasTime = false, now = new Date()) {
  const days = daysBetween(now, date)
  const dateLabel = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  const timeLabel = date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
  if (days < 0) return `Overdue • ${dateLabel}`
  if (days === 0) return hasTime ? `Today • ${timeLabel}` : 'Today'
  if (days === 1) return hasTime ? `Tomorrow • ${timeLabel}` : 'Tomorrow'
  if (!hasTime && days <= 7) return `in ${days} days • ${dateLabel}`
  return hasTime ? `${dateLabel} • ${timeLabel}` : dateLabel
}

/** Chooses the icon/colour family of an upcoming item from its title. */
export function activityKind(title = '') {
  if (/\b(exam|test|viva|midterm|final)\b/i.test(title)) return 'exam'
  if (/\b(quiz|assignment|complete|submit|homework)\b/i.test(title)) return 'quiz'
  return 'session'
}
