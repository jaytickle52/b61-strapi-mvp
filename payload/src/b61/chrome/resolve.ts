import { resolveLink } from '../lib/media'
import type { SchoolSetting, Media } from '@/payload-types'
import { imgProps } from '../lib/media'

/** Plain, serialisable menu data for the header (links resolved to hrefs). */
export type NavLink = { label: string; href: string | null; newTab: boolean; description?: string | null }
export type NavItem =
  | ({ kind: 'link' } & NavLink)
  | { kind: 'dropdown'; label: string; links: NavLink[] }
  | {
      kind: 'mega'
      label: string
      columns: { heading?: string | null; links: NavLink[] }[]
      feature: { img: ReturnType<typeof imgProps>; alt: string; title?: string | null; text?: string | null; href: string | null; newTab: boolean } | null
    }

const nl = (x: any): NavLink => ({ label: x?.label ?? '', ...resolveLink(x?.link), description: x?.description ?? null })

export function resolveMenu(s: Partial<SchoolSetting>): { items: NavItem[]; utility: NavLink[]; button: NavLink | null } {
  const items: NavItem[] = (s.menu ?? []).filter((m) => m?.label).map((m: any) => {
    if (m.kind === 'dropdown') return { kind: 'dropdown', label: m.label, links: (m.links ?? []).filter((x: any) => x?.label).map(nl) }
    if (m.kind === 'mega') {
      const f = m.feature
      const img = f?.image ? imgProps(f.image, '360px') : null
      return {
        kind: 'mega',
        label: m.label,
        columns: (m.columns ?? []).map((c: any) => ({ heading: c?.heading ?? null, links: (c?.links ?? []).filter((x: any) => x?.label).map(nl) })),
        feature: f && (img || f.title) ? { img, alt: (f.image as Media)?.alt ?? '', title: f.title, text: f.text, ...resolveLink(f.link) } : null,
      }
    }
    return { kind: 'link', ...nl(m) }
  })
  const button = s.headerButton?.label ? nl(s.headerButton) : null
  return { items, utility: (s.utilityLinks ?? []).filter((x) => x?.label).map(nl), button }
}

/** Header > Side buttons: up to three links that stay on screen. */
export type QuickLink = NavLink & { icon: string; iconImage?: unknown; iconColours?: boolean | null }
export function resolveQuickLinks(s: Partial<SchoolSetting>): QuickLink[] {
  return (((s as any).quickLinks ?? []) as any[])
    .filter((x) => x?.label)
    .slice(0, 3)
    .map((x) => ({ ...nl(x), icon: x.icon ?? 'link', iconImage: x.iconImage, iconColours: x.iconColours }))
    .filter((x) => x.href)
}
