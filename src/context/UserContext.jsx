import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { api } from '../api'
import { DEMO_MODE } from '../config/flags'
import { DEMO_USER, toUser } from '../lib/user'

const UserContext = createContext({ user: toUser(null), loading: false })

export function UserProvider({ children }) {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(!DEMO_MODE)

  useEffect(() => {
    if (DEMO_MODE) return undefined
    let cancelled = false
    api('/profile')
      .then((data) => { if (!cancelled) setProfile(data) })
      .catch(() => {}) // the shell must still render if the API is down
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [])

  const value = useMemo(
    () => ({ user: DEMO_MODE ? DEMO_USER : toUser(profile), loading }),
    [profile, loading],
  )
  return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}

export const useUser = () => useContext(UserContext)
