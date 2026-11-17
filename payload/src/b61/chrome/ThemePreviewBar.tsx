import { THEMES, type ThemeName } from '../lib/style'

/**
 * Shown while /next/theme/<name> previews a theme on a demo or preview
 * address: which theme, a switch to the others, and a way back to the
 * school's own. Styles in themes.css (.b61-theme-bar).
 */
export default function ThemePreviewBar({ theme }: { theme: ThemeName }) {
  const others = (['heritage', 'warm', 'bold'] as ThemeName[]).filter((t) => t !== theme)
  return (
    <div className="b61-theme-bar" role="status">
      <span>
        Previewing the <strong>{THEMES[theme].label}</strong> theme
      </span>
      {others.map((t) => (
        <a key={t} href={`/next/theme/${t}`}>
          {THEMES[t].label}
        </a>
      ))}
      <a href="/next/theme/off">The school&rsquo;s own</a>
    </div>
  )
}
