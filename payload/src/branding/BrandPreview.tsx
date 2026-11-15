'use client'
import { useFormFields } from '@payloadcms/ui'
import { FONT_STACKS, fontsHref, TONE_DEFAULTS } from '../b61/lib/theme'
import { contrast, normalizeHex, readableOn, textOn } from './color'

/**
 * School settings > Look: a small sample of the school's colors and fonts that
 * updates as staff change them, before anything is saved.
 */
export function BrandPreview() {
  const v = useFormFields(([f]) => ({
    name: f?.schoolName?.value as string | undefined,
    primary: f?.primaryColor?.value,
    secondary: f?.secondaryColor?.value,
    accent: f?.accentColor?.value,
    paper: f?.paperColor?.value,
    tone: f?.siteTone?.value as string | undefined,
    background: f?.backgroundColor?.value,
    text: f?.textColor?.value,
    heading: f?.headingFont?.value as string | undefined,
    body: f?.bodyFont?.value as string | undefined,
    ui: f?.uiFont?.value as string | undefined,
  }))
  const primary = normalizeHex(v.primary) ?? '#1f3a5f'
  const secondary = normalizeHex(v.secondary) ?? '#c8a24a'
  const accent = normalizeHex(v.accent) ?? '#b23a2e'
  const paper = normalizeHex(v.paper) ?? '#f7f3ec'
  const dark = v.tone === 'dark'
  const tone = TONE_DEFAULTS[dark ? 'dark' : 'light']
  // A light site previews on its soft paper (as before); a dark site on its page.
  const ground = dark ? (normalizeHex(v.background) ?? tone.background) : paper
  const letters = normalizeHex(v.text) ?? (dark ? tone.text : '#1a1a1a')
  // On a dark page, primary-coloured headings and accent words lighten toward the text (as tone.css does).
  const headingColor = dark ? `color-mix(in srgb, ${primary} 40%, ${letters})` : primary
  const accentText = dark ? `color-mix(in srgb, ${accent} 62%, ${letters})` : accent
  const font = (name: string | undefined, fallback: string) => FONT_STACKS[name ?? ''] ?? FONT_STACKS[fallback]
  const onPrimary = textOn(primary).text === 'white' ? '#fff' : '#1a1a1a'
  const onSecondary = textOn(secondary).text === 'white' ? '#fff' : '#1a1a1a'
  // The secondary colour is also the accent text and focus ring on dark (primary) grounds.
  const pair = contrast(secondary, primary)
  const onDark = readableOn(secondary, primary, 4.5)

  return (
    <div className="field-type" style={{ marginBottom: 24 }}>
      <link rel="stylesheet" href={fontsHref({ headingFont: v.heading, bodyFont: v.body, uiFont: v.ui })} />
      <p className="field-label">Preview</p>
      <div style={{ background: ground, color: letters, borderRadius: 6, padding: '28px 28px 24px', border: '1px solid var(--theme-elevation-100)' }}>
        <div style={{ font: `600 12px/1.2 ${font(v.ui, 'Montserrat')}`, letterSpacing: '0.12em', textTransform: 'uppercase', color: accentText }}>
          Welcome
        </div>
        <div style={{ width: 40, height: 3, background: accent, margin: '10px 0 14px' }} />
        <div style={{ font: `600 30px/1.15 ${font(v.heading, 'Fraunces')}`, color: headingColor }}>{v.name || 'Your school name'}</div>
        <p style={{ font: `400 16px/1.6 ${font(v.body, 'Inter')}`, margin: '12px 0 20px', maxWidth: 560 }}>
          Body text looks like this. A Christ-centered education where every student is known, challenged and loved.
        </p>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <span style={{ font: `600 14px/1 ${font(v.ui, 'Montserrat')}`, background: primary, color: onPrimary, padding: '12px 18px', borderRadius: 4 }}>
            Schedule a tour
          </span>
          <span style={{ font: `600 14px/1 ${font(v.ui, 'Montserrat')}`, background: secondary, color: onSecondary, padding: '12px 18px', borderRadius: 4 }}>
            Apply now
          </span>
        </div>
      </div>
      <div style={{ background: primary, borderRadius: 6, padding: '18px 28px', marginTop: 8 }}>
        <div style={{ font: `700 12px/1.2 ${font(v.ui, 'Montserrat')}`, letterSpacing: '0.12em', textTransform: 'uppercase', color: onDark }}>Footer heading</div>
        <div style={{ font: `400 15px/1.5 ${font(v.body, 'Inter')}`, color: onPrimary, marginTop: 6 }}>Links and text on the dark footer and dark bands.</div>
      </div>
      {pair < 4.5 && (
        <p className="field-description" role="note">
          The secondary color on the primary color is {pair.toFixed(1)}:1, too faint for text (aim for 4.5:1). On dark backgrounds the site uses a lighter shade of it ({onDark}), shown above, for headings and the keyboard focus outline.
        </p>
      )}
      <p className="field-description">Updates as you change the colors and fonts below. The live preview beside the form shows the whole site.</p>
    </div>
  )
}
