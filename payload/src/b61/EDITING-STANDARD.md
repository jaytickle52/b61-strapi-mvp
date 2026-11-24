# B61 editing standard

How every B61 element's editing form is laid out, so a school editor who learns
one element knows them all. The kit in `src/b61/kit/` enforces most of this:
build elements with `defineElement()` and the shared field groups, never by hand.

## 1. Two tabs, always

- **Content**: what an editor types and chooses (words, photos, links, which
  items to show). Heading level stays here, because it shapes the page outline.
- **Design**: arrangement and finish (spacing, widths, colour, accents).
  School staff see both tabs. Defaults must be good enough to leave alone.
- No third tab. A tab has to match a separate reason for opening the element
  (change the words, change the look). Buttons and media stay with the words they
  belong to; length is handled by panels (section 2), not more tabs.
- Element-wide settings (like the CSS class) go in a panel at the end of Design
  (Advanced), not a new tab.

## 2. Content panels, in this order, with these names

Content uses closed panels like Design, so an editor sees the whole element
without scrolling, and each panel says what is in it.

1. **Shape choice first, above the panels.** If one choice changes what the editor
   is asked to supply (Cover vs Band, Image vs Video, Text vs Meta line), it sits
   at the top, because it decides which fields and panels appear.
2. **Heading**, in this order: Eyebrow, **Heading**, then the element's one supporting-text
   field (Subheadline or Intro, section 5; Hero adds Changing words before it), then Heading
   level (Automatic by default) last, because people touch it least. `headingFields({ after })`.
   - **Heading is one box** typed like a sentence, with one **Emphasize** button: select any
     words and press it (Jay, 19 Nov 2026; replaces heading lines). Shift+Enter starts a new
     line. Stored as Lexical JSON (`kit/heading.ts`); emphasized words carry the highlight
     format and render as `<em class="…-line--em">`, a line emphasized whole keeps the line's
     `--em` class. Templates, demo content and the connector may write it as text:
     `"Rooted in faith.\n*Ready for life.*"` (stars emphasize, a new line breaks).
   - **On the page**, typed lines break on wider screens and each line is balanced; phones
     run the lines together and balance the whole heading, so no word is left alone.
3. **The element's main content**: the items list (cards, stats, slides, questions),
   the Content editor (Split, Prose, CTA Band) or the column of elements (Section).
   A list or editor stands on its own, outside the panels; a group of settings around
   the items (Card Grid's "Fill with") is a panel named for them (Cards).
4. **Buttons** (`buttonsPanel()`).
5. **Media**: photos, video, background. Media comes before Buttons only where it is
   the element's main content (Gallery), per item 3.

How the kit does it (`defineElement`, nothing per element):
- Every Content panel starts closed, with what is in it in the header: the heading
  text, the button labels ("Buttons · Schedule a tour, Apply now"), the photo's alt
  text, or a count ("6 photos").
- **One panel opens first.** If the main content sits outside the panels (a list, the
  Content editor, a column of elements), it is already in view and every panel starts
  closed. Otherwise the first panel opens. An element can name it with `open`
  (Hero: Heading; Card Grid: Cards; Gallery: Media).
- Panels only arrange the form; stored data does not change (section 7).

## 3. Design panels, in this order, with these names

| Panel | Holds |
|---|---|
| Layout | arrangement: height, position, alignment, column balance |
| Size & spacing | widths (step sliders) and padding |
| *Element's part* (e.g. Cards) | treatment of the element's own items |
| Color | surface, overlay, item colours |
| Accents | eyebrow rule, frames, entrance animation |
| Advanced | Anchor (everyone; section 21); CSS class and Banner 61 layout options (Banner 61 admins only; school staff never see them) |

A panel with nothing to show for the current choices is left out.
Layout opens by default; the others start closed and show their current
values in the header ("Padding · Normal / Tight"), so nothing is hidden.

## 4. Controls

- **Segmented buttons only for up to five short choices** (about 36 characters together)
  or icons, where an icon is clearer than a word (alignment, position). Anything longer
  is a dropdown (Jay, 19 Nov 2026: Hero type crowded its row). One control keeps one form
  in every element: Photo shape is always a dropdown, Surface always buttons.
- **On/off: a toggle.** Never a two-option radio for yes/no.
- **Site-wide scales (1–7): step slider** with named ends and a reset to the
  site default. Never a bare number box.
- **Links: one compact control**: Page / Document / Web address, then the field.
  Page links survive slug changes, so they come first. **No "Open in a new tab"** (Jay,
  19 Nov 2026): pages, and web addresses on the same site ("/apply"), open in place;
  documents and other websites open in a new tab. Email and phone links open in place.
  One rule for every link, the Content editor's included: `opensNewTab()` in `lib/media.ts`.
- **Repeater rows are named by their content** ("Schedule a tour"), not "Button 01".
- **A list is not wrapped in a panel of the same name.** The list is the section.
  The exception is Buttons, which sits in a closed panel so it can say what it holds;
  the list's own title is hidden there, so the name shows once.

## 5. Words

- Terse labels, no parenthetical hints, no "Optional." in help text (an empty field
  already reads as optional). Help text only when the label cannot carry it, and then
  one short line. Units go after the field with `unit(field, '%')`, never in the label.
- The same thing has the same name in every element: Eyebrow, Heading,
  Subheadline, Intro, Buttons, Surface, Padding, Entrance animation.
- **One supporting-text field per element, never both** (decided 15 Nov 2026; applied
  16 Nov: `bandHeadFields({ intro: true })` leaves Subheadings out).
  - Hero-type elements (Hero, CTA Band) get **Subheadline**: plain text, read as part of
    the heading. One style, the body font: no style choice, no Short facts (Jay, 19 Nov 2026).
  - Elements with their own items (Card Grid, Accordion, Stats, Tabs, Gallery,
    Carousel) get **Intro**: the short editor (section 10), body size, setting up the items.
  - If an Intro ever needs display size, that is a Design choice (Intro size:
    Normal / Large), not a second field.
- A control shows only when it does something (Eyebrow rule only with an
  eyebrow; Column balance only in Band; Prose's Icon list panel only once the text has
  an Icon list; Card Grid's Card media only when the text sits below the photo). A Design
  part panel takes a `condition` for this. Split and Framed Image's Frame color is the
  accepted exception: a site whose tokens set no frame can't hide it.
- **One vocabulary** (audit of plugin 1.78.0, applied 16 Nov 2026):
  - **Fills**: None · White · Light wash · Dark · Accent, in that order (no fill first,
    lightest to darkest, Accent last). Panels say White card; item fills add Outline
    (first) and Page (the page's own ground) from `ITEM_SURFACES`. Hero's Secondary is
    the one extra: a brand colour, not a fill.
  - **Photo shape**: Fixed height · Portrait · Square · Landscape · Wide · Custom ratio,
    or the subset that applies. One label even when two stored fields carry it (Card Grid).
  - **Overlay** for the tint over a photo; **Overlay strength** 0–100 with a % unit.
  - **Type** for what a media slot holds (Photo · Gallery · Video; Hero: Photo · Slideshow · Video).
  - **Block position** for where a narrowed text block sits; it lives in Size & spacing
    beside Width. Text alignment stays in Layout.
  - Behaviour switches (First item open, One open at a time) live in Content.
- **Stored values never change with a label.** Rename the words freely; to rename or
  move a stored value, ship a migration that rewrites old data, the defaults and the
  demo content in the same PR. CI catches a structure change without a migration, but
  not a renamed option value. Where a label disagreed with its value, fix the label.
- Editors never see where files are kept: no "Bunny", no service names, in labels, help
  text or errors (Jay, 19 Nov 2026). Videos are "Upload a video"; links are YouTube or Vimeo.

## 6. Photos

- Focal point and crop are saved on the photo itself, in Media, so they follow
  the photo everywhere it is used. Set them from any photo field with the
  pencil icon (opens that photo in a drawer) > Edit image.
- Alt text is required on upload. Decorative backgrounds render with empty alt.
- Photos live in **Photos**; PDFs and other downloads in **Documents**.
  Both can be sorted into folders (each school has its own). A link control offers
  Page / Document / Web address, and the Content editor's link tool can pick a page or a document.
- **Videos** (Files > Videos): every uploaded video, so one upload can go on any number of
  pages (Jay, 19 Nov 2026). An upload from any video field joins the list; each video field
  has **Choose a video** to pick one again. Editors see a video's title, never its address.
  Deleting an unused video also removes the file, so storage doesn't fill with copies.
- Each photo, document, video and page shows **Where this is used**. Anything still in use can't be
  deleted; the message says where to replace it first.

## 7. Data

- Panels, rows and tabs only arrange the form; they never nest the stored data.
  Regrouping controls later needs no migration.
- Stored values match the Breakdance plugin wherever they exist, so content can
  move between the two.

## 8. Containers

- Tabs, Carousel and Section hold other elements. Each slide or column is a row whose
  content is a list of elements, added with the same block picker as a page. A tab has its
  own Title, Text and Photo, and its **More in this tab** list holds elements (section 21).
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
- Intros and item bodies (accordion, cards) use a short editor: paragraphs,
  bold, italic, links and lists. Accordion answers add a **Button** from + or / (Jay, 19 Nov
  2026; `itemBodyWithButtonEditor()` in `kit/body.ts`).

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
- **Click to the field.** Clicking a part of an element (a heading line, the subheadline or
  intro, a button, a stat, a card title, words in the Content editor, a photo) opens the
  element, then the item's row and the Content panel that holds the field, scrolls to it and
  puts the cursor in it. Clicking the element's padding, or a part filled from elsewhere
  (cards from Programs), opens the element as before. Accordion questions, tabs and carousel
  arrows keep working when clicked, so they don't jump to the form; click beside them.
- How: the preview sends what was clicked (its words, or the photo's address) with the
  element's path; `PreviewFocus` matches the words against the element's own values (exact
  words first), or the photo by file name. Each Content panel's header lists the fields it
  holds (`data-b61-holds`), so the right closed panel can be opened. Nothing per element.
  Checked in a real browser by `scripts/click-to-field.mjs` (CI).

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

- School settings > Look > **Style (Banner 61)**: a **Theme** (Classic, Heritage, Warm, Bold) and
  the dials: corners, button shape and letters, heading letters, weight, spacing and sizes, accent heading
  line, eyebrow line and letters, photo frames, section spacing, page width, hero edge line, entrance motion,
  card link letters and size, and how much of the next carousel card peeks in.
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
- **Schoolbox themes (Heritage, Warm, Bold; 16 Nov 2026)** replace Modern, Soft and Editorial (the migration
  maps Soft to Warm, Editorial to Heritage, Modern to Classic). Each sets dials, **fonts** and
  `data-b61-theme` on `<html>`; `src/b61/styles/themes.css` holds each theme's own element treatment
  (Heritage: keylined boxed cards, rules under headings, quotes between rules; Warm: curved hero corner, soft
  card shadows, icons in circles; Bold: accent bars on cards, heavy rules, capital card titles). Rules there
  key on the theme attribute only, so Classic schools never change. Picking a theme in the admin also sets
  its three fonts in the form (`ThemeSelect.tsx`); the school can change them after.
- The **arrangement** of a Schoolbox home page comes from the **Home (Schoolbox)** page template
  (`src/templates/schoolbox.ts`): the same slots for every theme, laid out with ordinary element options
  (Heritage: centred photo hero, boxed cards; Warm: curved photo hero, icon cards on a wash; Bold: split hero
  with cards pulled up over it, overlay outcome cards, colour bands). Changing theme later changes the finish,
  not a page already made.
- **Theme preview:** `/next/theme/<heritage|warm|bold|classic|off>` shows the current school in that theme on
  demo and preview addresses only (never a school's own domain); `?school=<slug>` picks the school,
  `?to=/path` the page. A bar at the bottom switches themes. The Schoolbox demo school (`schoolbox`,
  Hourglass Christian School, `src/b61/schoolbox-demo.ts`) has `/home-heritage`, `/home-warm`, `/home-bold`.

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

## 16. Banner 61 layout options and the Wake patterns (Nov 2026)

Added after reviewing wakechristianacademy.com. Rule: **school staff keep a short form**. Bigger
arrangement choices are Banner 61-only; content a school updates stays where staff already work.

- **Design > Advanced (Banner 61 only).** `defineElement({ design: { advanced: [...] } })` puts
  fields above the CSS class in the Advanced panel, hidden from school staff (they see only the
  Anchor there, section 21). `bannerOnly()`
  (kit/element.ts) gives each one create/update access for Banner 61 admins only, so a staff save
  keeps what Banner 61 set. Use it for layout, not for words or photos.
  - Card Grid: **Heading beside the cards** (the head in a side column; section 19),
    **Staggered cards** (every other column lower, wide screens), **Run off the screen edge**
    (any carousel, every screen size; top-level bands only), **Show card text on hover** (text on the photo;
    touch screens always show it; keyboard focus opens it), **Accent tint on every other photo**
    (grey photo multiplied by the accent, so contrast only improves).
  - Section: **Duotone photo** (the background photo in greys, so the wash tints it one colour).
  - Stats Band: **Band width** Full / Right part / Left part (wide screens) and **Pull up over the
    band above** (same hook as Section's pull-up, so the band above makes room).
- **For school staff (Content):**
  - Hero > Heading > **Changing words**: words that take turns with the heading's first
    emphasized words, separated by commas (checked on save: something must be emphasized).
    Works anywhere in the heading, best at the end. A text box, not a list, keeps the Heading
    panel short. It plays once, ending on the emphasized words, inside five seconds (WCAG 2.2.2),
    and not at all for visitors who ask for less motion. The page text is the heading as typed.
    Older content listed every word with the first in the heading; that still plays.
    Styled by the Accent heading line dial.
  - Every Buttons list: **Opens: A link / A video**. A video plays in a pop-up over the page
    (`kit/render/VideoDialog.tsx`, mounted once in the layout); without JavaScript it is a link.
  - Split > Media > **Badge**: a seal or award on the photo's outer corner.
  - School settings > Header > **Side buttons** (up to 3, icon + words): docked at the right
    edge, along the bottom on phones. Empty = none. Each school picks each button's icon; icons
    take the button's text colour (white on the dark surface). The icon set includes Question
    mark (Nov 2026; Cedar Ridge's Inquire uses it).
  - Announcements > **Show as: Pop-up** (+ optional graphic): opens 1.5 s after load, one at a
    time, never again for that visitor once closed.
- **Style (Banner 61) > Menu on wide screens:** Menu bar / Slide-in panel (desktop uses the
  phone's slide-in menu, larger).
- Click-to-field now scrolls the row (or panel) holding the field into view while it waits: the
  editor only draws fields near the screen, so on a long element form the field never appeared.
- CSS for all of these: `src/b61/styles/patterns.css`. Demo: the **Layout ideas** page
  (`/layout-ideas`) on both demo schools; Cedar Ridge also has Side buttons.

## 17. Options from the Canterbury review (Nov 2026)

Same rule as section 16: bigger layout choices are Banner 61-only (Design > Advanced).

- **School settings > Look > Accent heading font** (optional): emphasized heading words, and
  the Hero's changing word, use this second font and keep their letters as typed, even when
  Heading letters is Capitals ("AN EDUCATION THAT'S *personal*"). Loaded from Google Fonts with
  the others (400/500, upright and italic). `[data-b61-accent-font]` in `styles/style.css`.
- **Tabs can hold a Card Grid** (`tabBlocks` in `inner.ts`): a set of cards per tab. Carousel
  slides keep the short set (Testimonial, Split, Prose).
- **Card Grid > Advanced > Larger middle card** (3 columns): the middle column is wider, so its
  card is taller; side cards sit centred.
- **Duotone photos** (Card Grid and Gallery > Advanced): photos in greys, tinted with the
  primary colour. With Card text on the photo the tint multiplies (darkens, so
  contrast holds); otherwise it screens (colour in the shadows, pale highlights).
- **Scroll story** (`kit/render/ScrollStory.tsx` + `ScrollStoryInit.tsx`; now Tabs > Layout, section 21): a
  shared arrangement, not an element. Titles stay in view on one side as a list of links with a
  progress line; each item (photo + words on a card) scrolls past on the other side and its
  title lights up at mid-screen. Every item is in the page and readable without a script;
  phones stack the items. Other elements with titled items (Tabs, Accordion) can adopt it by
  passing their items to `<ScrollStory>`.
- **Logos** element (Payload-only): a row of logos, Still (wraps, lines up with the heading) or
  Scrolling (loops slowly; a Pause button comes first in tab order; it stops on hover and
  keyboard focus; no motion for visitors who ask for less, where the row wraps instead). Logos in
  one colour: grey on light bands, white on dark ones. The logo's alt text is its name.
- CSS: `styles/patterns.css` sections 10-13. Demo: **More layout ideas** (`/more-layout-ideas`)
  on both demo schools; Element library version 4 adds Logos.

## 18. A Section's colour is shared (Nov 2026)

Elements inside a Section, Tabs or Carousel share the container's background colour unless an
element sets its own Surface (Jay, 16 Nov 2026). Most elements start at None, so they already do.
Stats Band and CTA Band have their own colour when they stand alone, so their Surface stores no
starting value (`surfaceField({ standalone: 'soft' })`): on their own they show Light wash; inside
a container they show None. The editor highlights the choice in effect (Segmented's `unset`,
nesting read from the field's path) and the element applies the same rule (`Inner` passes
`nested`). Picking any Surface stores it and wins in both places.

## 19. Card Grid review (Jay, 19 Nov 2026)

- **Card text: Below the photo / On the photo** is the first Content control. On the photo is
  what used to be the Overlay card style: it always uses a photo, so Card media, the card style
  (Plain · Flat · Bordered) and the card fill hide, and a card without a photo is refused on save.
  The migration moved every Overlay grid to On the photo.
- **Your own icons.** Every icon picker (Card Grid cards, Rail links, Prose icon rows, header
  Quick links) ends with **Your own…**, which shows **Your icon** (an SVG or PNG on a see-through
  background) and **Keep its colours**. By default the icon takes the text colour, like the
  built-in set (drawn through its own shape as a mask); Keep its colours shows it as drawn. One
  helper builds the three fields: `iconChoice()` in `kit/groups.ts`; `B61Icon` renders it.
- **Set once per site, not per carousel** (Banner 61 style dials, section 14): how much of the
  next card peeks in (None · Small · Medium · Large), and card link letters (Capitals · As typed)
  and size (Small · Medium · Large). The per-grid Peek, Link text case and Link text size are gone.
- Carousel controls at the bottom left: the arrows come first, then the counter and the progress
  line to their right. Centred and top-right controls are unchanged.
- Text on the photo at the top or the middle uses a long, eased gradient across the whole card
  (no band behind the words), so the photo fades in without a visible edge.
- **Heading beside the cards** keeps the other choices working (Jay, 19 Nov 2026): the side
  column holds the head, plus the arrows when Controls is Top right. Every other Controls
  choice sits with the cards as usual, and the buttons always come after the cards. On
  phones the side column stacks above the cards.
- **Run off the screen edge** works on any carousel at every screen size (it used to need
  Heading beside and a wide screen, so it looked broken). The cards reach the right edge of
  the screen; the controls and buttons stay inside the page.

## 20. Split, CTA Band and Accordion review (Jay, 19 Nov 2026)

- **Split gallery: no column count.** Media > **Gallery layout**: Grid · Masonry · Strip, and the
  photos arrange themselves for however many there are, so a fourth photo just fits:
  - Grid: one photo fills the column, two to four sit two across, five or more three across.
    A short last row stretches its last photo, so there is never a hole.
  - Masonry: photos keep their own shapes, in two columns (three from seven), each photo
    going to the shorter column. Photo shape hides (it doesn't apply).
  - Strip: one row that scrolls sideways (keyboard focusable), photos at the row's height.
  - With **Text column height: Match the image**, the gallery fills the frame to the text's
    height (photos crop to fit; a floor keeps it from getting too short). `SplitGallery` in
    `Split.tsx`; CSS in `split.css`.
- **Overlap the image** shows only when Text column height is **Fit content**; matched to the
  image, the card would cover the photo whole, so it is ignored there too.
- **CTA Band:** Heritage's short rule under the heading follows the band's text alignment.
- **Add Section** shows a sketch of each element (`public/b61/blocks/<slug>.svg`, set by
  `defineElement` as the block's `imageURL`). A new element needs its own sketch there.

## 21. One Tabs element (Jay, 20 Nov 2026)

- **Tabs and Tabbed Features are one element, Tabs.** They looked alike on the page (click a
  name, see its content) and editors couldn't tell which to use; what differed was what a tab
  held, so that is now per tab, not a choice of element.
- **Layout** is the first Content choice: Tabs on top · Tabs beside · Feature list (titles with
  their text beside one photo; was Tabbed Features) · Scroll story (was a Banner 61-only switch).
  Design > Layout has **Tab side** (beside, list, story) and **Tab alignment** (on top).
- **Every tab** has Title, Text (the short editor plus a Button) and Photo. With Tabs on top or
  beside, the tab shows its text and photo side by side (photo first on phones), then anything
  in **More in this tab** (Prose, Split, Testimonial, Card Grid). Feature list and Scroll story
  use the text and photo only.
- **In the editor the tabs are a row of names**, like the site (`kit/admin/TabStrip.tsx`):
  click one to edit that tab alone; **+ Add tab**, move left/right and **Remove tab** sit beside
  the row. It is Payload's array field underneath, with every row but the selected one hidden,
  so validation, autosave and click-to-field are unchanged (the selected tab is the open row).
- Migration `tabs_merge` moved every Tabbed Features section into Tabs in place (Feature list,
  or Scroll story / Tabs on top as it was set) and turned old Tabs positions into Layout and
  Tab side. Tabs isn't offered inside a Section column (one level of nesting); an old nested
  Tabbed Features still renders.

## 21. Design fidelity options (Nov 2026)

From the first custom build on Payload (Banner 61's own site, from a Claude Design canvas). Each
closes a gap between a design and what the section library could show, for every school.

- **Design > Advanced > Anchor** (every element, school staff included). A name such as
  `pricing`; a button or menu link to `#pricing` (or `/page#pricing`) jumps there. The id goes on
  the element's own root (`kit/render/anchor.ts`), never a wrapper, so neighbour rules keep
  working; `html { scroll-padding-top }` (chrome.css) keeps it clear of the sticky header.
  Lower-case letters, digits and hyphens; one per page; `main` and `b61-*` are the page's own.
- **School settings > Look > Button color**: Primary (default, matches headings), Secondary or
  Accent. Sets the primary fill on the page and on White and Light wash bands
  (`--b61-btn-primary-fill`); the letters turn dark when white wouldn't read (4.5:1).
- **School settings > Look > Brand fonts (uploaded)**: a school's licensed font files (WOFF2,
  WOFF, OTF, TTF in Documents), one row per weight and style, then Headings / Body / Buttons
  pointed at a family by name. The Google font above stays the fallback. Served from the site's
  own address (`/next/brand-font/<id>?v=…`) because Blob is another domain; the version changes
  when the file is replaced. Upload only fonts licensed for the web.
- **Hero > Heading > Breadcrumb**: up to five steps above the eyebrow; the last is the current
  page (no link). For inner pages such as a product's use case.
- **Card Grid > Cards > Join as steps** (Show numbers on, grid, text below): the numbers sit in
  rings in the card's accent, joined by a line to the next card on wide screens.


## 22. Design-match options (Nov 2026)

From matching Banner 61's own product pages to their Claude Design artboards. Each is general:
any school's design with the same pattern can use it. All are opt-in; existing pages don't change.

- **Hero > Big headline > Background > Showcase picture**: a wide screenshot or photo under the
  centred words, in a window-like frame (rounded top, soft shadow) whose bottom edge meets the next
  band. The hero's height then follows its content and its edge line is hidden.
- **Tabs > Design > Layout > Tab style: Pills** (Tabs on top): rounded buttons, the open one filled
  in the ink colour; on Dark and Accent bands the open pill turns light with dark words.
- **Card Grid, per card**: **Large figure** (a price or number under the title), **Badge** (a small
  label in the corner, e.g. Recommended) and **Highlight this card** (an outline in the secondary
  colour and a lifted shadow).
- **Card Grid > Design > Cards > Card link: Button**: each card's link becomes a full-width button
  at the card's foot, filled on a highlighted card and outlined on the others (pricing, plans).
- **Card Grid > Design > Layout > Buttons: Beside the heading**: the grid's buttons sit at the
  right of the heading row (a "See all" link). Not with Heading beside the cards.
- **Card Grid > Design > Layout > Heading alignment**: Match cards (default, as before), Left or
  Center, so a centred heading can sit over left-aligned cards.
- **CTA Band > Design > Layout > Buttons: Beside the words** (left-aligned bands): the words on the
  left, the buttons at the right, centred on them; stacked again below 900px.
