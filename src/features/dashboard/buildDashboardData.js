import { activityKind, parseDateOnly } from './format'
import { buildSampleData } from './sampleData'

export const THEME_ORDER = ['blue', 'green', 'purple', 'orange']
const MAX_SUBJECTS = 4
const MAX_UPCOMING = 3

const unitCount = (topics) => new Set(topics.map((t) => t.unit || 'General')).size

function mapSubjects(subjects) {
  return subjects.map((subject, index) => {
    const topics = subject.topics ?? []
    const done = topics.filter((t) => t.status === 'completed').length
    return {
      id: subject.id,
      name: subject.name,
      units: unitCount(topics),
      progress: topics.length ? Math.round((done / topics.length) * 100) : 0,
      theme: THEME_ORDER[index % THEME_ORDER.length],
    }
  })
}

function computeStats(subjects) {
  const topics = subjects.flatMap((s) => s.topics ?? [])
  const completed = topics.filter((t) => t.status === 'completed').length
  return {
    subjects: subjects.length,
    units: subjects.reduce((sum, s) => sum + unitCount(s.topics ?? []), 0),
    topicsCompleted: completed,
    progress: topics.length ? Math.round((completed / topics.length) * 100) : 0,
  }
}

function mapTasks(tasks) {
  return tasks
    .filter((task) => !task.completed)
    .map((task) => ({ task, due: parseDateOnly(task.due_date) }))
    .sort((a, b) => (a.due?.getTime() ?? Infinity) - (b.due?.getTime() ?? Infinity))
    .slice(0, MAX_UPCOMING)
    .map(({ task, due }) => ({
      id: task.id,
      title: task.title,
      kind: activityKind(task.title),
      when: due,
      hasTime: false,
      fallbackDetail: task.subject || 'No due date',
    }))
}

const settledValue = (result) =>
  result?.status === 'fulfilled' && Array.isArray(result.value) ? result.value : null

/**
 * Builds the dashboard view-model.
 *
 * - Live data is used wherever the API answered (including genuine empty states).
 * - Sample data fills in only what the backend cannot provide yet, or what failed to load.
 * - `isSample` tells the UI which sections to label.
 *
 * @param {object} input
 * @param {boolean} [input.demo] force the complete sample dataset
 * @param {PromiseSettledResult<any[]>} [input.subjects] result of GET /curriculum/subjects
 * @param {PromiseSettledResult<any[]>} [input.tasks] result of GET /tasks
 */
export function buildDashboardData({ demo = false, subjects, tasks, now = new Date() } = {}) {
  const sample = buildSampleData(now)
  const liveSubjects = demo ? null : settledValue(subjects)
  const liveTasks = demo ? null : settledValue(tasks)

  const failures = [subjects, tasks]
    .filter((r) => r?.status === 'rejected')
    .map((r) => r.reason?.message || 'Request failed')

  return {
    stats: liveSubjects ? computeStats(liveSubjects) : sample.stats,
    subjects: liveSubjects ? mapSubjects(liveSubjects).slice(0, MAX_SUBJECTS) : sample.subjects,
    upcoming: liveTasks ? mapTasks(liveTasks) : sample.upcoming,
    continueLearning: sample.continueLearning,
    isSample: {
      stats: !liveSubjects,
      subjects: !liveSubjects,
      upcoming: !liveTasks,
      continueLearning: true,
    },
    errors: failures,
  }
}
