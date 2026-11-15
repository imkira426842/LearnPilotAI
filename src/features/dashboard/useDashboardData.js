import { useCallback, useEffect, useMemo, useState } from 'react'
import { api } from '../../api'
import { DEMO_MODE } from '../../config/flags'
import { buildDashboardData } from './buildDashboardData'

/** Loads subjects + tasks from the existing API and maps them to the dashboard view-model. */
export function useDashboardData() {
  const [state, setState] = useState({ loading: !DEMO_MODE, results: null })

  const load = useCallback(async () => {
    if (DEMO_MODE) {
      setState({ loading: false, results: null })
      return
    }
    setState((s) => ({ ...s, loading: true }))
    const [subjects, tasks] = await Promise.allSettled([api('/curriculum/subjects'), api('/tasks')])
    setState({ loading: false, results: { subjects, tasks } })
  }, [])

  useEffect(() => { load() }, [load])

  const data = useMemo(
    () => buildDashboardData({ demo: DEMO_MODE, ...(state.results ?? {}) }),
    [state.results],
  )
  return { loading: state.loading, data, reload: load }
}
