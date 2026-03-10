export default function XpDonut({ xp = 0, level = 1, size = 170 }) {
  const xpInLevel = xp % 100
  const pct = (xpInLevel / 100) * 100

  return (
    <div className="xp-donut-wrap">
      <div
        className="xp-donut"
        style={{
          width: size,
          height: size,
          background: `conic-gradient(var(--orange) 0% ${pct}%, rgba(255,255,255,0.1) ${pct}% 100%)`
        }}
      >
        <div className="xp-donut-inner">
          <h3 className="xp-donut-label">Level</h3>
          <h2 className="xp-donut-level">{level}</h2>
          <p className="xp-donut-sub">{xpInLevel}/100 XP</p>
        </div>
      </div>
    </div>
  )
}