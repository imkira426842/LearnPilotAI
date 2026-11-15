/** Small mountain-and-flag graphic for the quote card. */
export default function MountainIllustration({ className }) {
  return (
    <svg viewBox="0 0 160 90" className={className} aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="mi-back" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#8fb0ff" />
          <stop offset="1" stopColor="#5d86f5" />
        </linearGradient>
        <linearGradient id="mi-front" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3f6ef4" />
          <stop offset="1" stopColor="#1d46c9" />
        </linearGradient>
      </defs>
      <path d="M0 90 52 30 82 62 106 40 160 90z" fill="url(#mi-back)" />
      <path d="M60 90 112 14 160 90z" fill="url(#mi-front)" />
      <path d="M112 14 100 34l8-4 5 6 5-6 6 5z" fill="#fff" fillOpacity=".85" />
      <path d="M112 14V2" stroke="#1d3ba0" strokeWidth="2" strokeLinecap="round" />
      <path d="M112 2h14l-4 5 4 5h-14z" fill="#f97316" />
    </svg>
  )
}
