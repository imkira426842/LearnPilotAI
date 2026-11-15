const NODES = [
  [30, 30], [52, 18], [78, 26], [104, 16], [130, 32], [40, 54], [66, 50], [92, 46], [118, 58],
  [140, 70], [28, 84], [56, 78], [84, 90], [110, 84], [136, 98],
]
const EDGES = [
  [0, 1], [1, 2], [2, 3], [3, 4], [0, 5], [1, 6], [2, 6], [2, 7], [3, 7], [4, 8], [5, 6], [6, 7],
  [7, 8], [8, 9], [5, 10], [6, 11], [7, 12], [8, 13], [9, 14], [10, 11], [11, 12], [12, 13], [13, 14],
]

/** Abstract "neural network" artwork used when a lecture has no real thumbnail. */
export default function LectureThumbnail({ className }) {
  return (
    <svg viewBox="0 0 165 118" className={className} preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="lt-bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#0a1648" />
          <stop offset="1" stopColor="#1b3a9e" />
        </linearGradient>
        <radialGradient id="lt-glow" cx="55%" cy="45%" r="60%">
          <stop offset="0" stopColor="#4cc9ff" stopOpacity=".5" />
          <stop offset="1" stopColor="#4cc9ff" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="165" height="118" fill="url(#lt-bg)" />
      <rect width="165" height="118" fill="url(#lt-glow)" />
      <g stroke="#6fd3ff" strokeOpacity=".55" strokeWidth="1">
        {EDGES.map(([a, b]) => (
          <line key={`${a}-${b}`} x1={NODES[a][0]} y1={NODES[a][1]} x2={NODES[b][0]} y2={NODES[b][1]} />
        ))}
      </g>
      <g fill="#a8e6ff">
        {NODES.map(([x, y], i) => <circle key={i} cx={x} cy={y} r={i % 4 === 0 ? 3 : 2} />)}
      </g>
    </svg>
  )
}
