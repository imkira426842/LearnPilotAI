/**
 * Friendly study-robot illustration (inline SVG approximation of the design artwork).
 * To use the original artwork instead, render <img src="/hero-robot.png" alt="" /> from public/.
 */
export default function HeroIllustration({ className }) {
  return (
    <svg viewBox="0 0 560 230" className={className} preserveAspectRatio="xMaxYMax meet" aria-hidden="true" focusable="false">
      <defs>
        <radialGradient id="hi-glow" cx="50%" cy="55%" r="55%">
          <stop offset="0" stopColor="#fff" stopOpacity=".8" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="hi-head" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff" />
          <stop offset="1" stopColor="#d9e3fb" />
        </linearGradient>
        <linearGradient id="hi-visor" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1d2f78" />
          <stop offset="1" stopColor="#0c1544" />
        </linearGradient>
        <linearGradient id="hi-body" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#6e97ff" />
          <stop offset="1" stopColor="#2f5bec" />
        </linearGradient>
        <linearGradient id="hi-book" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#4a7bff" />
          <stop offset="1" stopColor="#1d46c9" />
        </linearGradient>
      </defs>

      <ellipse cx="330" cy="122" rx="215" ry="108" fill="url(#hi-glow)" />
      <ellipse cx="330" cy="150" rx="222" ry="44" fill="none" stroke="#fff" strokeOpacity=".75" strokeWidth="2" transform="rotate(-9 330 150)" />

      {/* floating tiles */}
      <g transform="rotate(-8 144 58)">
        <rect x="118" y="32" width="52" height="52" rx="15" fill="#5b8cff" />
        <circle cx="144" cy="58" r="11" fill="none" stroke="#fff" strokeWidth="5" strokeDasharray="5 3.2" />
        <circle cx="144" cy="58" r="4" fill="#fff" />
      </g>
      <g transform="rotate(8 481 70)">
        <rect x="456" y="45" width="50" height="50" rx="15" fill="#3f7bf0" />
        <circle cx="481" cy="70" r="11" fill="none" stroke="#fff" strokeWidth="6" />
      </g>
      <g transform="rotate(-14 106 160)">
        <rect x="84" y="138" width="44" height="46" rx="11" fill="#7b5cf0" />
        <path d="M94 154h24M94 162h24M94 170h14" stroke="#fff" strokeWidth="3.4" strokeLinecap="round" />
      </g>
      <circle cx="226" cy="30" r="4" fill="#fff" fillOpacity=".9" />
      <circle cx="430" cy="30" r="3" fill="#fff" fillOpacity=".8" />
      <path d="M200 96v10M195 101h10" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" />
      <path d="M452 148v10M447 153h10" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" />

      <g transform="translate(330 220) scale(0.9) translate(-330 -230)">
      {/* body */}
      <path d="M288 164h84c11 0 18 8 18 19v47H270v-47c0-11 7-19 18-19z" fill="url(#hi-body)" />
      <rect x="312" y="176" width="36" height="12" rx="6" fill="#fff" fillOpacity=".35" />

      {/* open book */}
      <path d="M252 186 330 202 408 186v44l-78 14-78-14z" fill="url(#hi-book)" />
      <path d="M262 184 330 197v40l-68-12z" fill="#fff" />
      <path d="M398 184 330 197v40l68-12z" fill="#eef3ff" />
      <path d="M272 196l48 9M272 206l48 9M272 216l40 7" stroke="#b9c9f5" strokeWidth="2.4" strokeLinecap="round" />
      <circle cx="266" cy="196" r="9" fill="#fff" />
      <circle cx="394" cy="196" r="9" fill="#fff" />

      {/* head */}
      <circle cx="266" cy="114" r="13" fill="#3f6ef4" />
      <circle cx="394" cy="114" r="13" fill="#3f6ef4" />
      <rect x="272" y="64" width="116" height="100" rx="44" fill="url(#hi-head)" stroke="#c6d4f6" strokeWidth="1.5" />
      <rect x="284" y="82" width="92" height="64" rx="30" fill="url(#hi-visor)" />
      <ellipse cx="313" cy="106" rx="9" ry="12" fill="#45c8ff" />
      <ellipse cx="347" cy="106" rx="9" ry="12" fill="#45c8ff" />
      <circle cx="316" cy="101" r="3" fill="#fff" />
      <circle cx="350" cy="101" r="3" fill="#fff" />
      <path d="M321 127q9 8 18 0" fill="none" stroke="#45c8ff" strokeWidth="3.4" strokeLinecap="round" />

      {/* graduation cap */}
      <path d="M298 62v14c0 8 64 8 64 0V62l-32 12z" fill="#16256b" />
      <path d="M330 16 410 44 330 72 250 44z" fill="#0f1b4d" />
      <path d="M330 16 410 44 330 50 250 44z" fill="#fff" fillOpacity=".12" />
      <path d="M404 46v36" stroke="#f5b82e" strokeWidth="3.2" strokeLinecap="round" />
      <circle cx="404" cy="87" r="5.5" fill="#f5b82e" />
      </g>
    </svg>
  )
}
