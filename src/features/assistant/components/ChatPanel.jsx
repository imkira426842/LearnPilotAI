import { useEffect, useRef, useState } from 'react'
import { Info, LoaderCircle, Paperclip, Send, Trash2 } from 'lucide-react'
import { formatClock } from '../formatMessage'
import MessageBubble from './MessageBubble'
import { BotAvatar } from './BotArt'

const MAX_LENGTH = 8000
const SUGGESTIONS = [
  'Explain binary search trees with an example',
  'Compare process and thread in OS',
  'Give me an exam-focused explanation of normalization',
]

function Greeting({ firstName, at }) {
  return (
    <li className="tw:flex tw:items-start tw:gap-3">
      <BotAvatar className="tw:size-10 tw:shrink-0" />
      <div className="tw:max-w-[88%] tw:rounded-2xl tw:border tw:border-line tw:bg-surface tw:px-4 tw:py-3 tw:text-[15.5px] tw:leading-6 tw:text-ink-800 tw:sm:max-w-[78%]">
        <p className="tw:font-semibold tw:text-ink-900">Hello {firstName}! <span aria-hidden="true">👋</span></p>
        <p className="tw:mt-1">I’m your LearnPilot AI assistant. Ask me anything about your subjects, topics, or study plan. How can I help you today?</p>
        <time className="tw:mt-2 tw:block tw:text-right tw:text-[13px] tw:text-ink-500">{formatClock(at)}</time>
      </div>
    </li>
  )
}

export default function ChatPanel({ chat, user, draft, onDraftChange, inputRef, language, onLanguageChange }) {
  const { messages, loadingHistory, historyError, sending, clearing, error, send, retry, clear, reloadHistory } = chat
  const [confirmClear, setConfirmClear] = useState(false)
  const [greetedAt] = useState(() => new Date())
  const endRef = useRef(null)
  const listRef = useRef(null)

  // Keep the newest message in view. Scroll the list itself, never the whole page.
  useEffect(() => {
    const list = listRef.current
    if (list) list.scrollTo({ top: list.scrollHeight, behavior: 'smooth' })
  }, [messages.length, sending])

  const submit = async () => {
    const text = draft.trim()
    if (!text || sending) return
    onDraftChange('')
    const ok = await send(text)
    if (!ok) onDraftChange(text) // keep what they typed if sending failed
  }

  const onKeyDown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing) {
      event.preventDefault()
      submit()
    }
  }

  const doClear = async () => {
    const ok = await clear()
    if (ok) setConfirmClear(false)
  }

  return (
    <section aria-labelledby="chat-title" className="tw:flex tw:min-h-[560px] tw:min-w-0 tw:flex-col tw:rounded-[20px] tw:border tw:border-line tw:bg-white tw:shadow-card tw:wide:h-[calc(100vh-420px)] tw:wide:min-h-[600px]">
      <header className="tw:flex tw:items-center tw:gap-3 tw:border-b tw:border-line tw:px-4 tw:py-3.5 tw:sm:px-5">
        <BotAvatar className="tw:size-12 tw:shrink-0" />
        <div className="tw:min-w-0 tw:flex-1">
          <h2 id="chat-title" className="tw:text-[18px] tw:font-bold tw:leading-6 tw:text-ink-900">AI Study Assistant</h2>
          <p className="tw:text-[14px] tw:text-ink-500">Your personal study companion</p>
        </div>
        {confirmClear ? (
          <div className="tw:flex tw:items-center tw:gap-2" role="group" aria-label="Confirm clearing the chat">
            <button type="button" onClick={doClear} disabled={clearing} className="tw:inline-flex tw:items-center tw:gap-1.5 tw:rounded-xl tw:bg-rose-600 tw:px-3.5 tw:py-2 tw:text-[14px] tw:font-semibold tw:text-white tw:hover:bg-rose-700 tw:disabled:opacity-60">
              {clearing && <LoaderCircle size={15} className="tw:animate-spin" aria-hidden="true" />}
              Clear all
            </button>
            <button type="button" onClick={() => setConfirmClear(false)} className="tw:rounded-xl tw:border tw:border-line tw:px-3.5 tw:py-2 tw:text-[14px] tw:font-semibold tw:text-ink-700 tw:hover:bg-surface">
              Cancel
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setConfirmClear(true)}
            disabled={!messages.length}
            className="tw:inline-flex tw:items-center tw:gap-2 tw:rounded-xl tw:border tw:border-line tw:bg-white tw:px-3.5 tw:py-2 tw:text-[14.5px] tw:font-medium tw:text-ink-700 tw:transition-colors tw:hover:bg-surface tw:disabled:cursor-not-allowed tw:disabled:opacity-50"
          >
            <Trash2 size={17} aria-hidden="true" />
            <span className="tw:hidden tw:sm:inline">Clear Chat</span>
            <span className="tw:sr-only tw:sm:hidden">Clear Chat</span>
          </button>
        )}
      </header>

      <div ref={listRef} className="tw:min-h-0 tw:flex-1 tw:overflow-y-auto tw:px-4 tw:py-5 tw:sm:px-5">
        {historyError && (
          <div role="alert" className="tw:mb-4 tw:flex tw:flex-wrap tw:items-center tw:gap-3 tw:rounded-2xl tw:border tw:border-amber-200 tw:bg-amber-50 tw:px-4 tw:py-3 tw:text-[14.5px] tw:text-amber-900">
            <Info size={18} className="tw:shrink-0" aria-hidden="true" />
            <span className="tw:flex-1">Couldn’t load your earlier messages ({historyError}).</span>
            <button type="button" onClick={reloadHistory} className="tw:rounded-full tw:border tw:border-amber-300 tw:bg-white tw:px-3.5 tw:py-1 tw:text-[13.5px] tw:font-semibold tw:hover:bg-amber-100">Retry</button>
          </div>
        )}
        {loadingHistory ? (
          <div role="status" className="tw:flex tw:items-center tw:justify-center tw:gap-2.5 tw:py-10 tw:text-[15px] tw:text-ink-500">
            <LoaderCircle size={20} className="tw:animate-spin" aria-hidden="true" /> Loading your conversation…
          </div>
        ) : (
          <ol className="tw:flex tw:flex-col tw:gap-5" aria-live="polite" aria-label="Conversation">
            <Greeting firstName={user.firstName} at={greetedAt} />
            {messages.map((m) => (
              <MessageBubble key={m.id} message={m} userInitials={user.initials} onRetry={retry} />
            ))}
            {sending && (
              <li className="tw:flex tw:items-center tw:gap-3" role="status">
                <BotAvatar className="tw:size-10 tw:shrink-0" />
                <span className="tw:inline-flex tw:items-center tw:gap-1.5 tw:rounded-2xl tw:border tw:border-line tw:bg-surface tw:px-4 tw:py-3.5" aria-label="The assistant is typing">
                  <span className="tw:size-2 tw:animate-bounce tw:rounded-full tw:bg-brand-400" />
                  <span className="tw:size-2 tw:animate-bounce tw:rounded-full tw:bg-brand-400 tw:[animation-delay:120ms]" />
                  <span className="tw:size-2 tw:animate-bounce tw:rounded-full tw:bg-brand-400 tw:[animation-delay:240ms]" />
                </span>
              </li>
            )}
          </ol>
        )}
        {!loadingHistory && !messages.length && !sending && (
          <div className="tw:mt-6">
            <p className="tw:mb-2 tw:text-[12px] tw:font-bold tw:uppercase tw:tracking-[0.12em] tw:text-ink-400">Try asking</p>
            <ul className="tw:flex tw:flex-wrap tw:gap-2">
              {SUGGESTIONS.map((s) => (
                <li key={s}>
                  <button
                    type="button"
                    onClick={() => { onDraftChange(s); inputRef.current?.focus() }}
                    className="tw:rounded-full tw:border tw:border-brand-100 tw:bg-brand-50 tw:px-3.5 tw:py-1.5 tw:text-left tw:text-[14px] tw:text-brand-700 tw:transition-colors tw:hover:bg-brand-100"
                  >
                    {s}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
        <div ref={endRef} />
      </div>

      {error && (
        <p role="alert" className="tw:mx-4 tw:mb-2 tw:rounded-xl tw:border tw:border-rose-200 tw:bg-rose-50 tw:px-3.5 tw:py-2 tw:text-[14px] tw:text-rose-700 tw:sm:mx-5">
          {error}
        </p>
      )}

      <form
        onSubmit={(e) => { e.preventDefault(); submit() }}
        className="tw:border-t tw:border-line tw:p-3 tw:sm:p-4"
      >
        <div className="tw:flex tw:items-end tw:gap-2 tw:sm:gap-3">
          <div className="tw:flex tw:min-w-0 tw:flex-1 tw:items-end tw:gap-2 tw:rounded-[22px] tw:border tw:border-line tw:bg-white tw:px-3 tw:py-2 tw:focus-within:border-brand-400 tw:focus-within:ring-4 tw:focus-within:ring-brand-100">
            <button
              type="button"
              disabled
              title="File attachments are coming soon"
              aria-label="Attach a file (coming soon)"
              className="tw:grid tw:size-9 tw:shrink-0 tw:cursor-not-allowed tw:place-items-center tw:rounded-full tw:text-brand-600 tw:opacity-50"
            >
              <Paperclip size={20} aria-hidden="true" />
            </button>
            <label htmlFor="assistant-input" className="tw:sr-only">Type your message</label>
            <textarea
              id="assistant-input"
              ref={inputRef}
              rows={1}
              value={draft}
              maxLength={MAX_LENGTH}
              onChange={(e) => onDraftChange(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder="Type your message…"
              className="tw:max-h-32 tw:min-h-9 tw:min-w-0 tw:flex-1 tw:resize-none tw:bg-transparent tw:py-1.5 tw:text-[16px] tw:leading-6 tw:text-ink-900 tw:outline-none tw:placeholder:text-ink-400 tw:[field-sizing:content]"
            />
          </div>
          <button
            type="submit"
            disabled={!draft.trim() || sending}
            aria-label="Send message"
            className="tw:grid tw:size-12 tw:shrink-0 tw:place-items-center tw:rounded-full tw:bg-brand-600 tw:text-white tw:shadow-[0_10px_20px_-10px_rgba(36,87,232,0.9)] tw:transition-colors tw:hover:bg-brand-700 tw:disabled:cursor-not-allowed tw:disabled:opacity-50"
          >
            {sending ? <LoaderCircle size={20} className="tw:animate-spin" aria-hidden="true" /> : <Send size={20} aria-hidden="true" />}
          </button>
        </div>
        <div className="tw:mt-2 tw:flex tw:items-center tw:justify-between tw:gap-3 tw:px-1 tw:text-[12.5px] tw:text-ink-500">
          <label className="tw:flex tw:items-center tw:gap-2">
            Reply in
            <select
              value={language}
              onChange={(e) => onLanguageChange(e.target.value)}
              className="tw:rounded-lg tw:border tw:border-line tw:bg-white tw:px-2 tw:py-1 tw:text-[12.5px] tw:text-ink-800"
            >
              <option>English</option>
              <option>Hindi</option>
            </select>
          </label>
          <span className="tw:hidden tw:sm:inline">Enter to send · Shift+Enter for a new line</span>
        </div>
      </form>
    </section>
  )
}
