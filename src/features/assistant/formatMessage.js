/**
 * Tiny, safe formatter for assistant replies. No HTML is ever injected: it returns plain data
 * that React renders as text, so model output cannot create markup.
 *
 * Supported: blank-line separated paragraphs, "- " / "* " / "1. " list items, a line ending
 * in ":" (or wrapped in **) as a bold label, and **bold** inline.
 */
export function parseBlocks(text) {
  const lines = String(text ?? '').replace(/\r\n/g, '\n').split('\n')
  const blocks = []
  let paragraph = []
  let list = null

  const flushParagraph = () => {
    if (paragraph.length) blocks.push({ type: 'p', text: paragraph.join(' ') })
    paragraph = []
  }
  const flushList = () => {
    if (list) blocks.push(list)
    list = null
  }

  for (const raw of lines) {
    const line = raw.trim()
    const item = line.match(/^(?:[-*•]|\d+[.)])\s+(.*)$/)
    if (!line) {
      flushParagraph()
      flushList()
    } else if (item) {
      flushParagraph()
      if (!list) list = { type: 'ul', items: [] }
      list.items.push(item[1])
    } else {
      flushList()
      const label = line.match(/^\*\*(.+?)\*\*:?$/) || (line.endsWith(':') && line.length <= 40 ? [null, line.slice(0, -1)] : null)
      if (label) {
        flushParagraph()
        blocks.push({ type: 'label', text: label[1] })
      } else {
        paragraph.push(line)
      }
    }
  }
  flushParagraph()
  flushList()
  return blocks
}

/** Splits "a **b** c" into [{text, bold}] segments. */
export function inlineSegments(text) {
  return String(text)
    .split(/(\*\*[^*]+\*\*)/g)
    .filter(Boolean)
    .map((part) =>
      part.startsWith('**') && part.endsWith('**') && part.length > 4
        ? { text: part.slice(2, -2), bold: true }
        : { text: part, bold: false },
    )
}

/** A reply is "long" when it has several blocks or many characters: it starts collapsed. */
export function isLongMessage(text) {
  const blocks = parseBlocks(text)
  const listItems = blocks.reduce((n, b) => n + (b.type === 'ul' ? b.items.length : 0), 0)
  return String(text ?? '').length > 420 || blocks.length > 5 || listItems > 5
}

export function formatClock(value) {
  const date = value instanceof Date ? value : new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}
