import { useId } from 'react'

/** Round robot avatar used in the chat (inline SVG, no external asset). */
export function BotAvatar({ className }) {
  const uid = useId().replace(/:/g, '')
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id={`${uid}-ring`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#6c92fa" />
          <stop offset="1" stopColor="#1c45c4" />
        </linearGradient>
      </defs>
      <circle cx="24" cy="24" r="23" fill="#eef3ff" stroke="#c3d4ff" />
      <circle cx="7.5" cy="26" r="3.2" fill={`url(#${uid}-ring)`} />
      <circle cx="40.5" cy="26" r="3.2" fill={`url(#${uid}-ring)`} />
      <rect x="10.5" y="11" width="27" height="25" rx="11" fill="#fff" stroke="#c6d4f6" />
      <rect x="13.5" y="16" width="21" height="15" rx="7.5" fill="#0f1b4d" />
      <ellipse cx="20" cy="22.5" rx="2.2" ry="3" fill="#45c8ff" />
      <ellipse cx="28" cy="22.5" rx="2.2" ry="3" fill="#45c8ff" />
      <path d="M21.5 27.5q2.5 2 5 0" fill="none" stroke="#45c8ff" strokeWidth="1.3" strokeLinecap="round" />
      <path d="M24 5 35 9.5 24 14 13 9.5z" fill="#0f1b4d" />
      <path d="M33.5 10.5v5" stroke="#f5b82e" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  )
}

/** Larger robot with graduation cap and speech bubble for the hero banner. */
export function BotHero({ className }) {
  const uid = useId().replace(/:/g, '')
  return (
    <svg viewBox="0 0 360 210" className={className} preserveAspectRatio="xMaxYMax meet" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id={`${uid}-head`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff" />
          <stop offset="1" stopColor="#d9e3fb" />
        </linearGradient>
        <linearGradient id={`${uid}-visor`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1d2f78" />
          <stop offset="1" stopColor="#0c1544" />
        </linearGradient>
        <linearGradient id={`${uid}-body`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#6e97ff" />
          <stop offset="1" stopColor="#2f5bec" />
        </linearGradient>
      </defs>
      <ellipse cx="215" cy="140" rx="150" ry="80" fill="#fff" fillOpacity=".35" />
      {/* sparkles */}
      <path d="M330 52v18M321 61h18" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
      <path d="M96 150v12M90 156h12" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" />
      <circle cx="120" cy="40" r="3" fill="#fff" />
      {/* speech bubble */}
      <g>
        <rect x="52" y="52" width="76" height="46" rx="20" fill="#fff" />
        <path d="M108 96l16 14-4-18z" fill="#fff" />
        <circle cx="76" cy="75" r="4.5" fill="#3f6ef4" />
        <circle cx="90" cy="75" r="4.5" fill="#3f6ef4" />
        <circle cx="104" cy="75" r="4.5" fill="#3f6ef4" />
      </g>
      {/* waving arm */}
      <path d="M170 168c-18-4-30-20-30-38" fill="none" stroke="#3f6ef4" strokeWidth="16" strokeLinecap="round" />
      <circle cx="140" cy="126" r="11" fill="#fff" stroke="#c6d4f6" />
      {/* body */}
      <path d="M200 150h70c10 0 16 7 16 17v43H184v-43c0-10 6-17 16-17z" fill={`url(#${uid}-body)`} />
      <rect x="222" y="160" width="26" height="9" rx="4.5" fill="#fff" fillOpacity=".4" />
      {/* head */}
      <circle cx="176" cy="104" r="12" fill="#3f6ef4" />
      <circle cx="294" cy="104" r="12" fill="#3f6ef4" />
      <rect x="182" y="58" width="106" height="92" rx="40" fill={`url(#${uid}-head)`} stroke="#c6d4f6" strokeWidth="1.5" />
      <rect x="193" y="74" width="84" height="58" rx="27" fill={`url(#${uid}-visor)`} />
      <ellipse cx="219" cy="96" rx="8" ry="11" fill="#45c8ff" />
      <ellipse cx="251" cy="96" rx="8" ry="11" fill="#45c8ff" />
      <circle cx="222" cy="91" r="2.8" fill="#fff" />
      <circle cx="254" cy="91" r="2.8" fill="#fff" />
      <path d="M227 115q8 7 16 0" fill="none" stroke="#45c8ff" strokeWidth="3.2" strokeLinecap="round" />
      {/* graduation cap */}
      <path d="M208 58v12c0 7 54 7 54 0V58l-27 10z" fill="#16256b" />
      <path d="M235 16 305 40 235 64 165 40z" fill="#0f1b4d" />
      <path d="M235 16 305 40 235 46 165 40z" fill="#fff" fillOpacity=".12" />
      <path d="M299 42v32" stroke="#f5b82e" strokeWidth="3" strokeLinecap="round" />
      <circle cx="299" cy="78" r="5" fill="#f5b82e" />
    </svg>
  )
}
