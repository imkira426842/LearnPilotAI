import { useCallback, useRef, useState } from 'react'
import { useUser } from '../../context/UserContext'
import AssistantHero from './components/AssistantHero'
import ChatPanel from './components/ChatPanel'
import QuickActionsCard from './components/QuickActionsCard'
import RecentChatsCard from './components/RecentChatsCard'
import { sampleRecentChats } from './sampleData'
import { useAssistantChat } from './useAssistantChat'

/** Presentational view: all data and callbacks come from props. */
export function AssistantView({ user, chat, recentChats, draft, onDraftChange, inputRef, language, onLanguageChange, onQuickAction }) {
  return (
    <div className="lp-scope tw:font-sans tw:px-4 tw:pb-8 tw:text-ink-900 tw:sm:px-5">
      <AssistantHero />
      <div className="tw:mt-4 tw:grid tw:gap-4 tw:wide:grid-cols-[minmax(0,340px)_minmax(0,1fr)] tw:wide:items-start">
        <div className="tw:order-2 tw:flex tw:min-w-0 tw:flex-col tw:gap-4 tw:wide:order-1">
          <QuickActionsCard onPick={onQuickAction} />
          <RecentChatsCard chats={recentChats} />
        </div>
        <div className="tw:order-1 tw:min-w-0 tw:wide:order-2">
          <ChatPanel
            chat={chat}
            user={user}
            draft={draft}
            onDraftChange={onDraftChange}
            inputRef={inputRef}
            language={language}
            onLanguageChange={onLanguageChange}
          />
        </div>
      </div>
    </div>
  )
}

export default function AssistantPage() {
  const { user } = useUser()
  const [language, setLanguage] = useState('English')
  const [draft, setDraft] = useState('')
  const inputRef = useRef(null)
  const chat = useAssistantChat({ language })

  const onQuickAction = useCallback((action) => {
    if (!action.focusOnly) setDraft(action.prompt)
    // Wait a tick so the textarea has the new value before the caret moves to the end.
    requestAnimationFrame(() => {
      const el = inputRef.current
      if (!el) return
      el.focus()
      el.setSelectionRange(el.value.length, el.value.length)
    })
  }, [])

  return (
    <AssistantView
      user={user}
      chat={chat}
      recentChats={sampleRecentChats}
      draft={draft}
      onDraftChange={setDraft}
      inputRef={inputRef}
      language={language}
      onLanguageChange={setLanguage}
      onQuickAction={onQuickAction}
    />
  )
}
