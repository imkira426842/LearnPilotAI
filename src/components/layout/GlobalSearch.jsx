import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Sparkles } from 'lucide-react'
import { allNav } from '../../config/navigation'
import { useDismiss } from '../../hooks/useDismiss'
import { cn } from '../../lib/cn'

const isMac = typeof navigator !== 'undefined' && /Mac|iPhone|iPad/i.test(navigator.platform)

/** Search box with Ctrl/Cmd+K focus, keyboard navigation and page/lecture/assistant shortcuts. */
export default function GlobalSearch() {
  const navigate = useNavigate()
  const wrapRef = useRef(null)
  const inputRef = useRef(null)
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(0)
  const close = useCallback(() => setOpen(false), [])
  useDismiss(wrapRef, open, close)

  useEffect(() => {
    const onKey = (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        inputRef.current?.focus()
        setOpen(true)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const q = query.trim()
  const results = useMemo(() => {
    const pages = allNav
      .filter((item) => !q || item.label.toLowerCase().includes(q.toLowerCase()))
      .slice(0, q ? 4 : 5)
      .map((item) => ({ key: `page-${item.to}`, label: item.label, hint: q ? 'Go to page' : 'Quick link', icon: item.icon, to: item.to }))
    if (!q) return pages
    return [
      { key: 'lectures', label: `Find lectures for “${q}”`, hint: 'Recommended lectures', icon: Search, to: `/lectures?topic=${encodeURIComponent(q)}` },
      { key: 'assistant', label: 'Ask the AI Study Assistant', hint: 'Open assistant', icon: Sparkles, to: '/assistant' },
      ...pages,
    ]
  }, [q])

  const go = (item) => {
    if (!item) return
    navigate(item.to)
    setOpen(false)
    setQuery('')
    inputRef.current?.blur()
  }

  const onKeyDown = (event) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      setOpen(true)
      setActive((i) => (i + 1) % results.length)
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      setActive((i) => (i - 1 + results.length) % results.length)
    } else if (event.key === 'Enter') {
      event.preventDefault()
      go(results[active])
    } else if (event.key === 'Escape') {
      setOpen(false)
      inputRef.current?.blur()
    }
  }

  return (
    <div ref={wrapRef} className="tw:relative tw:min-w-0 tw:max-w-[570px] tw:flex-1">
      <div className="tw:flex tw:h-[50px] tw:min-w-0 tw:items-center tw:gap-3 tw:rounded-full tw:border tw:border-line tw:bg-white tw:px-4 tw:shadow-card tw:transition tw:focus-within:border-brand-300 tw:focus-within:ring-4 tw:focus-within:ring-brand-100 tw:sm:px-5">
        <Search size={21} strokeWidth={1.9} className="tw:shrink-0 tw:text-ink-600" aria-hidden="true" />
        <input
          ref={inputRef}
          type="text"
          role="combobox"
          aria-expanded={open}
          aria-controls="global-search-results"
          aria-activedescendant={open ? `search-option-${active}` : undefined}
          aria-label="Search subjects, topics, or ask anything"
          autoComplete="off"
          value={query}
          placeholder="Search subjects, topics, or ask anything..."
          onChange={(event) => { setQuery(event.target.value); setActive(0); setOpen(true) }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
          className="tw:min-w-0 tw:flex-1 tw:bg-transparent tw:text-[15px] tw:text-ink-900 tw:outline-hidden tw:placeholder:text-ink-400"
        />
        <span className="tw:hidden tw:shrink-0 tw:text-[14px] tw:text-ink-400 tw:md:inline">({isMac ? '⌘' : 'Ctrl'} + K)</span>
      </div>

      {open && (
        <ul
          id="global-search-results"
          role="listbox"
          aria-label="Search suggestions"
          className="tw:absolute tw:inset-x-0 tw:top-[calc(100%+8px)] tw:z-50 tw:overflow-hidden tw:rounded-2xl tw:border tw:border-line tw:bg-white tw:p-1.5 tw:shadow-card-hover tw:animate-pop"
        >
          {results.map((item, index) => {
            const Icon = item.icon
            return (
              <li
                key={item.key}
                id={`search-option-${index}`}
                role="option"
                aria-selected={index === active}
                onMouseEnter={() => setActive(index)}
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => go(item)}
                className={cn(
                  'tw:flex tw:cursor-pointer tw:items-center tw:gap-3 tw:rounded-xl tw:px-3 tw:py-2.5',
                  index === active ? 'tw:bg-brand-50 tw:text-brand-800' : 'tw:text-ink-800',
                )}
              >
                <Icon size={18} strokeWidth={1.8} className="tw:shrink-0" aria-hidden="true" />
                <span className="tw:min-w-0 tw:flex-1 tw:truncate tw:text-[14.5px] tw:font-medium">{item.label}</span>
                <span className="tw:shrink-0 tw:text-[12px] tw:text-ink-400">{item.hint}</span>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
