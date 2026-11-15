/** Joins class names, skipping falsy values: cn('a', cond && 'b', ['c']) */
export function cn(...parts) {
  return parts.flat(Infinity).filter(Boolean).join(' ')
}
