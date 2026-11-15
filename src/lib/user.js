export function initialsOf(name) {
  const words = String(name || '').trim().split(/\s+/).filter(Boolean)
  if (!words.length) return 'S'
  const second = words[1]?.[0] ?? words[0][1] ?? ''
  return (words[0][0] + second).toUpperCase()
}

/** Shape used by the sidebar, topbar and dashboard. `profile` comes from GET /profile. */
export function toUser(profile) {
  const name = (profile?.name || '').trim() || 'Student'
  return {
    name,
    firstName: name.split(/\s+/)[0],
    initials: initialsOf(name),
    subtitle: profile?.program || 'Guest learner',
  }
}

export const DEMO_USER = {
  name: 'John Doe',
  firstName: 'John',
  initials: 'JD',
  subtitle: 'B.Tech CSE • 3rd Year',
}
