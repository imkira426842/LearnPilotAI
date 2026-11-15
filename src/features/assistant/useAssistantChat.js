import { useCallback, useEffect, useRef, useState } from 'react'
import { api, del, post } from '../../api'

let localId = 0
const nextId = () => `local-${Date.now()}-${localId++}`

function fromHistory(rows) {
  return (Array.isArray(rows) ? rows : []).map((row) => ({
    id: String(row.id ?? nextId()),
    role: row.role === 'user' ? 'user' : 'assistant',
    text: row.text ?? '',
    at: row.created_at ? new Date(row.created_at) : null,
  }))
}

/**
 * Chat state for the assistant page. Uses the existing API:
 *   GET    /assistant/history   -> [{id, role, text, created_at}]
 *   POST   /assistant/chat      -> {answer, provider, language}
 *   DELETE /assistant/history
 * Nothing is faked: failures become visible error messages with a retry.
 */
export function useAssistantChat({ language = 'English' } = {}) {
  const [messages, setMessages] = useState([])
  const [loadingHistory, setLoadingHistory] = useState(true)
  const [historyError, setHistoryError] = useState('')
  const [sending, setSending] = useState(false)
  const [clearing, setClearing] = useState(false)
  const [error, setError] = useState('')
  const [provider, setProvider] = useState('')
  const alive = useRef(true)

  useEffect(() => {
    alive.current = true
    return () => { alive.current = false }
  }, [])

  const loadHistory = useCallback(async () => {
    setLoadingHistory(true)
    setHistoryError('')
    try {
      const rows = await api('/assistant/history')
      if (alive.current) setMessages(fromHistory(rows))
    } catch (e) {
      if (alive.current) setHistoryError(e.message || 'Could not load your chat history.')
    } finally {
      if (alive.current) setLoadingHistory(false)
    }
  }, [])

  useEffect(() => { loadHistory() }, [loadHistory])

  const send = useCallback(async (text) => {
    const message = String(text ?? '').trim()
    if (!message || sending) return false
    setError('')
    setMessages((list) => [...list, { id: nextId(), role: 'user', text: message, at: new Date(), failed: false }])
    setSending(true)
    try {
      const reply = await post('/assistant/chat', { message, language })
      if (!alive.current) return true
      setProvider(reply.provider || '')
      setMessages((list) => [...list, { id: nextId(), role: 'assistant', text: reply.answer ?? '', at: new Date() }])
      return true
    } catch (e) {
      if (!alive.current) return false
      setError(e.message || 'The assistant could not respond.')
      // Mark the last user message as failed so the UI can offer a retry.
      setMessages((list) => {
        const copy = [...list]
        for (let i = copy.length - 1; i >= 0; i -= 1) {
          if (copy[i].role === 'user') { copy[i] = { ...copy[i], failed: true }; break }
        }
        return copy
      })
      return false
    } finally {
      if (alive.current) setSending(false)
    }
  }, [language, sending])

  /** Re-sends the last failed user message (removing the failed copy first). */
  const retry = useCallback(() => {
    const failed = [...messages].reverse().find((m) => m.role === 'user' && m.failed)
    if (!failed) return Promise.resolve(false)
    setMessages((list) => list.filter((m) => m.id !== failed.id))
    return send(failed.text)
  }, [messages, send])

  const clear = useCallback(async () => {
    setClearing(true)
    setError('')
    try {
      await del('/assistant/history')
      if (alive.current) setMessages([])
      return true
    } catch (e) {
      if (alive.current) setError(e.message || 'Could not clear the chat.')
      return false
    } finally {
      if (alive.current) setClearing(false)
    }
  }, [])

  return { messages, loadingHistory, historyError, sending, clearing, error, provider, send, retry, clear, reloadHistory: loadHistory }
}
