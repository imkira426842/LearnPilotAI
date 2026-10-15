const BASE = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api'
let profileId = localStorage.getItem('learnpilot_profile_id')
if (!profileId) {
  profileId = `guest-${crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2)}`
  localStorage.setItem('learnpilot_profile_id', profileId)
}
export async function api(path, options = {}) {
  const headers = { 'X-Profile-ID': profileId, ...(options.headers || {}) }
  if (options.body && !(options.body instanceof FormData)) headers['Content-Type'] = 'application/json'
  const response = await fetch(`${BASE}${path}`, { ...options, headers })
  if (response.status === 204) return null
  const body = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(body.detail || `Request failed (${response.status})`)
  return body
}
export const post = (path, body) => api(path, { method: 'POST', body: body instanceof FormData ? body : JSON.stringify(body) })
export const patch = (path, body) => api(path, { method: 'PATCH', body: JSON.stringify(body) })
export const del = path => api(path, { method: 'DELETE' })
