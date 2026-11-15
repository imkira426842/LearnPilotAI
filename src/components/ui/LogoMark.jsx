/** LearnPilot mortarboard mark (inline SVG, no external asset). */
export default function LogoMark({ className }) {
  return (
    <svg viewBox="0 0 64 64" className={className} role="img" aria-label="LearnPilot AI logo">
      <defs>
        <linearGradient id="lm-top" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#5b8cff" />
          <stop offset="1" stopColor="#1f4fd8" />
        </linearGradient>
        <linearGradient id="lm-base" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3b6df6" />
          <stop offset="1" stopColor="#1c3fae" />
        </linearGradient>
      </defs>
      <path d="M14 30v11c0 6 8.5 10 18 10s18-4 18-10V30L32 38.5z" fill="url(#lm-base)" />
      <path d="M32 9 62 23 32 37 2 23z" fill="url(#lm-top)" />
      <path d="M32 9 62 23 32 29 2 23z" fill="#fff" fillOpacity=".22" />
      <path d="M55 26v15" stroke="#f5b82e" strokeWidth="3" strokeLinecap="round" />
      <circle cx="55" cy="44" r="3.4" fill="#f5b82e" />
    </svg>
  )
}
