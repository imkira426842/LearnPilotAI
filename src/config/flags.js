/**
 * Build-time switches (set in the project-root .env, never put secrets here).
 *
 * VITE_DASHBOARD_DEMO=true   Show the full sample dataset on the dashboard instead of live data.
 * VITE_LEGACY_SHELL=true     Roll back to the previous sidebar/topbar and dashboard.
 */
export const DEMO_MODE = import.meta.env.VITE_DASHBOARD_DEMO === 'true'
export const USE_LEGACY_SHELL = import.meta.env.VITE_LEGACY_SHELL === 'true'
