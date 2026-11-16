# B61 editing standard

How every B61 element's editing form is laid out, so a school editor who learns
one element knows them all. The kit in `src/b61/kit/` enforces most of this:
build elements with `defineElement()` and the shared field groups, never by hand.

## 1. Two tabs, always

- **Content**: what an editor types and chooses (words, photos, links, which
  items to show). Heading level stays here, because it shapes the page outline.
- **Design**: arrangement and finish (spacing, widths, colour, accents).
  School staff see both tabs. Defaults must be good enough to leave alone.

## 2. Content order

1. **Shape choice first.** If one choice changes what the editor is asked to
   supply (Cover vs Band, Image vs Video, Text vs Meta line), it goes at the
   top of its panel, before the fields it switches.
2. **Heading**: eyebrow, heading lines, heading level (Automatic by default).
3. **Supporting text**: subheadline / intro / body.
4. **The element's own items**: cards, stats, slides, panels.
5. **Buttons.**
6. **Media**: photos, video, background.

## 3. Design panels, in this order, with these names

| Panel | Holds |
|---|---|
| Layout | arrangement: height, position, alignment, column balance |
| Size & spacing | widths (step sliders) and padding |
| *Element's part* (e.g. Cards) | treatment of the element's own items |
| Color | surface, overlay, item colours |
| Accents | eyebrow rule, frames, entrance animation |
| Advanced | CSS class (Banner 61 admins only; school staff never see it) |

A panel with nothing to show for the current choices is left out.
Layout opens by default; the others start closed and show their current
values in the header ("Padding · Normal / Tight"), so nothing is hidden.

## 4. Controls

- **Two to five fixed choices: segmented buttons**, with icons where an icon is
  clearer than a word (alignment, position). Six or more: a dropdown.
- **On/off: a toggle.** Never a two-option radio for yes/no.
- **Site-wide scales (1–7): step slider** with named ends and a reset to the
  site default. Never a bare number box.
- **Links: one compact control**: A page / A web address, then the field.
  Page links survive slug changes, so they come first.
- **Repeater rows are named by their content** ("Schedule a tour"), not "Button 01".
- **A list is not wrapped in a panel of the same name.** The list is the section.

## 5. Words

- Terse labels, no parenthetical hints. Help text only when the label cannot
  carry it, and then one short line.
- The same thing has the same name in every element: Eyebrow, Heading lines,
  Subheadline, Buttons, Surface, Padding, Entrance animation.
- A control shows only when it does something (Eyebrow rule only with an
  eyebrow; Column balance only in Band).

## 6. Photos

- Focal point and crop are saved on the photo itself, in Media, so they follow
  the photo everywhere it is used. Set them from any photo field with the
  pencil icon (opens that photo in a drawer) > Edit image.
- Alt text is required on upload. Decorative backgrounds render with empty alt.
- Photos and videos live in **Photos and videos**; PDFs and other downloads in **Documents**.
  Both can be sorted into folders (each school has its own). A link control offers
  Page / Document / Web address, and the Content editor's link tool can pick a page or a document.
- Each photo, document and page shows **Where this is used**. Anything still in use can't be
  deleted; the message says where to replace it first.

## 7. Data

- Panels, rows and tabs only arrange the form; they never nest the stored data.
  Regrouping controls later needs no migration.
- Stored values match the Breakdance plugin wherever they exist, so content can
  move between the two.

## 8. Containers

- Tabs, Carousel and Section hold other elements. Each tab, slide or column is a row
  whose content is a list of elements, added with the same block picker as a page.
- Only one level of nesting: a container offers the elements in `src/b61/inner.ts`,
  which leaves containers out. A Section's side column also offers the B61 Rail.
- Inside a container, Automatic heading level means H2 (never H1).
- A container passes `path` on to `Inner` (`${path}.content`, `${path}.tabs.${i}.content`,
  ...) so click-to-edit (section 12) can reach its children. A new container must do the same.

## 9. Header and footer

- Edited in School settings, using the same kit controls (lists, compact links, photos).
- A menu item's first choice is what it opens: a page, a dropdown or a mega menu.
  Only that kind's fields show.
- Phones get the same items as a slide-in menu. There is nothing to set up for it.

## 10. Writing (the Content editor)

- Split, Prose and CTA Band have one Content editor, typed like a document.
- Its + / slash menu offers the band's own pieces as cards: Pull quote, Icon list, Emphasis,
  Button, Callout and Table (and Divider in Prose). One way to make each thing.
- Button: one button in the flow of the text ("Schedule a tour"), same four styles as
  everywhere else. Reach for a CTA Band only when the button needs a whole band.
- Callout: a short notice set apart from the text ("Applications due March 1"). Tone is
  Note, Important or Celebrate; title, a line of text and an optional link. Colours come
  from role tokens, so it follows the theme and a dark site. Rendered as `role="note"`.
- Table: Payload's built-in table (still marked experimental). We render it ourselves
  (`render/converters.tsx`) without Payload's inline grey borders, so themes and dark
  sites style it; a top row of header cells becomes `<thead>`. It scrolls sideways on a
  phone. Adding a Lexical feature that has an editor piece means running
  `npm run generate:importmap` and committing `importMap.js`, or the editor breaks.
- Built-in items that break the design are left out: Heading 1, uploads, relationships,
  check lists, plain blockquotes. Headings are H2-H4.
- Intros and item bodies (accordion, pillars, cards) use a short editor: paragraphs,
  bold, italic, links and lists.

## 11. Forms

- A form's questions, emails and thank-you live in **Forms > Forms**; the **Form** element only
  places a form on a page (heading, width, surface, card), like every other element.
- Questions are named by their label; the technical name fills itself in.
  Width is Full / Half / Third. "Show only when" hides a question until another answer matches,
  and a hidden question is never required.
- Forms always send from the school's sender (School settings > Email). Editors choose who
  receives each email, never the From address.

## 12. Click-to-edit (live preview)

- In the live preview, hovering an element outlines it with "Edit <name>"; clicking it opens
  that element in the form (other sections close), scrolls to it and flashes it. Elements
  inside a Tab, Slide or Section column open all the way down. Opening a section in the form
  scrolls the preview to it.
- Clicking the header or footer opens that tab in School settings (on a page, a note says
  where they are edited). Links in the preview are not followed; buttons, tabs, accordions
  and carousels still work.
- Nothing to do per element: `Sections` and `Inner` add the markers. Code in
  `src/b61/kit/preview/` (EditMark, EditOverlay) and `src/b61/kit/admin/PreviewFocus.tsx`.
  The markers are `<template>` tags, only in the preview, which the plugin CSS already ignores.

## 13. Site tone and custom CSS

- School settings > Look > **Site tone**: Light (default) or Dark. Dark puts light letters on a
  dark page; coloured bands (primary, accent, photos) keep their colours. **Page background** and
  **Text** set the two grounds; empty uses white/#111 (light) or #101218/#F2EFE9 (dark).
- Dark is one layer of role-token overrides in `src/b61/styles/tone.css`, keyed on
  `<html data-b61-tone="dark">`. Element CSS (copied from the plugin) is not edited. A new element
  that uses role tokens (ink, muted, surface, on-*) works on dark sites for free; one that names
  `--b61-white` / `--b61-black` as a ground needs a line in tone.css.
- In Payload-only CSS, "primary as a letter colour" is `var(--b61-primary-text, var(--b61-primary))`,
  so dark sites can lighten it.
- **Custom CSS** (School settings > Look, Banner 61 admins only) goes on every page of that school,
  after all element styles. Target one element with its **Design > Advanced > CSS class**: the
  class goes on a `display: contents` wrapper (`.my-class .b61-hero`). Elements without a class get
  no wrapper, because a wrapper breaks plugin rules that rely on two elements being neighbours.
- Overlay strength on Hero, CTA Band and Section is exactly what the editor sets (0-100%); the old
  hidden floors (80% on Hero, 70-75% elsewhere) are gone, and the help text asks editors to check
  readability. Section patterns have a Strength (default 6%, the plugin's value).

## 14. Style: themes and dials (Banner 61)

- School settings > Look > **Style (Banner 61)**: a **Theme** (Classic, Modern, Bold, Soft, Editorial) and
  15 dials: corners, button shape and letters, heading letters, weight, spacing and sizes, accent heading
  line, eyebrow line and letters, photo frames, section spacing, page width, hero edge line, entrance motion.
  An empty dial follows the theme; a set dial overrides it. Classic is the original B61 look and emits nothing.
- Banner 61 admins only (group access + hidden for school staff). School staff keep colours, fonts and every
  element's Design tab, as before.
- Definitions live in `src/b61/lib/style.ts` (DIALS, THEMES, `b61Style`): each position sets tokens the
  elements already read, or one `data-b61-*` attribute on `<html>` that `src/b61/styles/style.css` keys on.
  Admin fields are generated from DIALS (`style-fields.ts`), so a new dial or theme is one edit there.
- Payload owns its element CSS (decided 15 Nov 2026; no Breakdance parity). Element CSS should read tokens,
  not literals, so the dials reach it: e.g. the accent heading line reads `--b61-emph-style`,
  `--b61-emph-decoration`, `--b61-emph-offset`.
- Heading weight snaps to the nearest weight the heading font has, and that weight is loaded with the font.

## 15. Header, footer and hero layouts (L2)

- Style (Banner 61) has **Header layout** (Classic, Centred logo, Over the hero) and **Footer layout**
  (Classic, Big wordmark). They set `data-b61-header` / `data-b61-footer` on `<html>`; the layouts are
  CSS in `chrome.css`. Modern uses Over the hero, Editorial Centred logo, Bold Big wordmark.
- **Over the hero** only applies when the page opens on a hero dark enough for white words: the hero
  marks itself `data-b61-over-ok` on the server (Cover with the Gradient or a Primary wash; Band or Big
  headline on Primary; never Split screen), so there is no flash. Elsewhere the header stays solid. It
  turns solid once the page scrolls. "Logo on dark" (School settings > School) shows while it is over.
- **Hero type** adds **Split screen** (one photo filling half the hero from the screen edge, Photo side
  left/right, text on the surface; stacks photo-first on phones) and **Big headline** (no photo, a very
  large title on the surface). Both use the Background photo field, Height and Surface the band uses.
  School editors choose them like the other hero types.
