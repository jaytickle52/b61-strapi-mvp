/** The demo school's header menu and footer (School settings > Header, Footer). */
const u = (url: string) => ({ type: 'url', url })
/** A made-up social handle for a demo school: "Cedar Ridge Christian Academy" -> "cedarridgechristianacademy". */
export const handle = (name: string) => name.toLowerCase().replace(/[^a-z0-9]+/g, '')
const l = (label: string, url: string, description?: string) => ({ label, link: u(url), ...(description ? { description } : {}) })

export function demoChrome(o: { name: string; programs: { name: string; slug: string; grades?: string }[]; img?: number }) {
  return {
    menu: [
      {
        label: 'About',
        kind: 'mega',
        columns: [
          { heading: 'Our school', links: [l('About us', '/about', 'Our story and mission'), l('Our team', '/staff', 'Teachers and staff'), l('News', '/news', 'Stories from campus')] },
          { heading: 'Visit', links: [l('Plan a visit', '/visit', 'Tours, directions and contacts'), l('Upcoming events', '/events', 'Open houses and more')] },
          { heading: 'For families', links: [l('Parents', '/parents', 'The parent area'), l('Element library', '/elements', 'Every section on one page')] },
        ],
        feature: { image: o.img, title: 'Come see for yourself', text: 'Tours run most weekday mornings.', link: u('/visit') },
      },
      {
        label: 'Programs',
        kind: 'dropdown',
        links: [...o.programs.map((p) => ({ label: p.name, link: u(`/programs/${p.slug}`) })), { label: 'All programs', link: u('/programs') }],
      },
      { label: 'Events', kind: 'link', link: u('/events') },
      { label: 'News', kind: 'link', link: u('/news') },
      { label: 'Our team', kind: 'link', link: u('/staff') },
    ],
    utilityLinks: [{ label: 'Parents', link: u('/parents') }],
    headerButton: { label: 'Schedule a tour', link: u('/visit') },
    footerColumns: [
      { heading: 'Explore', links: [l('About', '/about'), l('Programs', '/programs'), l('Events', '/events'), l('News', '/news')] },
      { heading: 'Families', links: [l('Visit', '/visit'), l('Our team', '/staff'), l('Parents', '/parents')] },
    ],
    footerShowContact: true,
    social: [
      { platform: 'facebook', url: `https://facebook.com/${handle(o.name)}` },
      { platform: 'instagram', url: `https://instagram.com/${handle(o.name)}` },
      { platform: 'youtube', url: `https://youtube.com/@${handle(o.name)}` },
    ],
    footerNote: `${o.name} admits students of any race, color, and national or ethnic origin.`,
    legalLinks: [{ label: 'Staff sign in', link: u('/admin') }],
  }
}
