import { useState } from 'react'
import { Check, ChevronDown, ChevronUp, Copy, RotateCcw } from 'lucide-react'
import Avatar from '../../../components/ui/Avatar'
import { cn } from '../../../lib/cn'
import { formatClock, inlineSegments, isLongMessage, parseBlocks } from '../formatMessage'
import { BotAvatar } from './BotArt'

function Inline({ text }) {
  return inlineSegments(text).map((seg, i) =>
    seg.bold ? <strong key={i} className="tw:font-semibold tw:text-ink-900">{seg.text}</strong> : <span key={i}>{seg.text}</span>,
  )
}

function Rich({ text }) {
  return (
    <div className="tw:space-y-2.5">
      {parseBlocks(text).map((block, i) => {
        if (block.type === 'label') return <p key={i} className="tw:pt-1 tw:text-[15.5px] tw:font-bold tw:text-ink-900">{block.text}:</p>
        if (block.type === 'ul') {
          return (
            <ul key={i} className="tw:space-y-1.5">
              {block.items.map((item, j) => (
                <li key={j} className="tw:flex tw:items-start tw:gap-3">
                  <span className="tw:mt-[9px] tw:size-2 tw:shrink-0 tw:rounded-full tw:bg-brand-600" aria-hidden="true" />
                  <span><Inline text={item} /></span>
                </li>
              ))}
            </ul>
          )
        }
        return <p key={i}><Inline text={block.text} /></p>
      })}
    </div>
  )
}

export default function MessageBubble({ message, userInitials, onRetry }) {
  const isUser = message.role === 'user'
  const long = !isUser && isLongMessage(message.text)
  const [expanded, setExpanded] = useState(false)
  const [copied, setCopied] = useState(false)
  const time = message.at ? formatClock(message.at) : ''

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(message.text)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch { /* clipboard can be blocked; nothing else to do */ }
  }

  return (
    <li className={cn('tw:flex tw:items-start tw:gap-3', isUser && 'tw:flex-row-reverse')}>
      {isUser ? (
        <Avatar initials={userInitials} className="tw:size-10 tw:text-[14px]" />
      ) : (
        <BotAvatar className="tw:size-10 tw:shrink-0" />
      )}
      <div className={cn('tw:flex tw:min-w-0 tw:max-w-[88%] tw:flex-col tw:sm:max-w-[78%]', isUser && 'tw:items-end')}>
        <div
          className={cn(
            'tw:rounded-2xl tw:px-4 tw:py-3 tw:text-[15.5px] tw:leading-6 tw:text-ink-800 tw:wrap-anywhere',
            isUser ? 'tw:bg-brand-100/80' : 'tw:border tw:border-line tw:bg-surface',
            message.failed && 'tw:border tw:border-rose-300 tw:bg-rose-50',
          )}
        >
          {isUser ? (
            <p className="tw:whitespace-pre-wrap">{message.text}</p>
          ) : (
            <div className={cn(long && !expanded && 'tw:max-h-[168px] tw:overflow-hidden tw:[mask-image:linear-gradient(to_bottom,black_70%,transparent)]')}>
              <Rich text={message.text} />
            </div>
          )}
          <div className="tw:mt-2 tw:flex tw:items-center tw:justify-between tw:gap-4 tw:text-[13px] tw:text-ink-500">
            {long ? (
              <button
                type="button"
                onClick={() => setExpanded((v) => !v)}
                aria-expanded={expanded}
                className="tw:inline-flex tw:items-center tw:gap-1 tw:font-semibold tw:text-brand-600 tw:hover:text-brand-800"
              >
                {expanded ? 'Show Less' : 'Show More'}
                {expanded ? <ChevronUp size={16} aria-hidden="true" /> : <ChevronDown size={16} aria-hidden="true" />}
              </button>
            ) : (
              <span />
            )}
            <span className="tw:flex tw:items-center tw:gap-3">
              {!isUser && (
                <button type="button" onClick={copy} aria-label="Copy response" className="tw:inline-flex tw:items-center tw:gap-1 tw:hover:text-brand-600">
                  {copied ? <Check size={14} aria-hidden="true" /> : <Copy size={14} aria-hidden="true" />}
                  {copied ? 'Copied' : 'Copy'}
                </button>
              )}
              {time && <time>{time}</time>}
            </span>
          </div>
        </div>
        {message.failed && (
          <p role="alert" className="tw:mt-1.5 tw:flex tw:items-center tw:gap-2 tw:text-[13.5px] tw:text-rose-600">
            Not delivered.
            <button type="button" onClick={onRetry} className="tw:inline-flex tw:items-center tw:gap-1 tw:font-semibold tw:underline">
              <RotateCcw size={13} aria-hidden="true" /> Retry
            </button>
          </p>
        )}
      </div>
    </li>
  )
}
