/** Realistic placeholder data for anything the backend cannot provide yet. Dates are relative to `now`. */
export function buildSampleData(now = new Date()) {
  const at = (offsetDays, hour = 0, minute = 0) =>
    new Date(now.getFullYear(), now.getMonth(), now.getDate() + offsetDays, hour, minute)

  return {
    stats: { subjects: 4, units: 20, topicsCompleted: 12, progress: 60 },
    subjects: [
      { id: 'sample-ai', name: 'Artificial Intelligence', units: 5, progress: 72, theme: 'blue' },
      { id: 'sample-cn', name: 'Computer Networks', units: 5, progress: 45, theme: 'green' },
      { id: 'sample-toc', name: 'Theory of Computation', units: 5, progress: 20, theme: 'purple' },
      { id: 'sample-cc', name: 'Cloud Computing (Open Elective)', units: 5, progress: 80, theme: 'orange' },
    ],
    // Watch progress does not exist in the backend yet (planned with the video-player milestone).
    continueLearning: {
      id: 'sample-continue',
      title: 'Unit 1: Introduction to AI',
      subject: 'Artificial Intelligence',
      progress: 60,
      to: `/lectures?topic=${encodeURIComponent('Introduction to Artificial Intelligence')}`,
    },
    upcoming: [
      { id: 'sample-u1', title: 'Maths Exam', kind: 'exam', when: at(5), hasTime: false },
      { id: 'sample-u2', title: 'Study Session – AI', kind: 'session', when: at(1, 19, 0), hasTime: true },
      { id: 'sample-u3', title: 'Complete Quiz – CN', kind: 'quiz', when: at(9), hasTime: false },
    ],
  }
}
