// XP progress donut component
// Displays the user's level and progress toward the next level
export default function XpDonut({ xp = 0, level = 1, size = 170 }) {
  // Calculate how much XP the user has earned within the current level
  // Example: if xp = 245 → xpInLevel = 45
  const xpInLevel = xp % 100
  // Convert XP progress into a percentage for the donut fill
  const pct = (xpInLevel / 100) * 100

  return (
    <div className="xp-donut-wrap">
      {/* Outer donut ring that visually fills based on XP progress */}
      <div
        className="xp-donut"
        style={{
          width: size,
          height: size,
          // Conic gradient creates the circular progress indicator
          // Orange portion = earned XP
          // Transparent portion = remaining XP
          background: `conic-gradient(var(--orange) 0% ${pct}%, rgba(255,255,255,0.1) ${pct}% 100%)`
        }}
      >
        {/* Inner content of the donut displaying level information */}
        <div className="xp-donut-inner">
          <h3 className="xp-donut-label">Level</h3>
        {/* Current player level */}
          <h2 className="xp-donut-level">{level}</h2>
         {/* XP progress within this level */}
          <p className="xp-donut-sub">{xpInLevel}/100 XP</p>
        </div>
      </div>
    </div>
  )
}