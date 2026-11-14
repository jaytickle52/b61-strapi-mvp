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

## 9. Header and footer

- Edited in School settings, using the same kit controls (lists, compact links, photos).
- A menu item's first choice is what it opens: a page, a dropdown or a mega menu.
  Only that kind's fields show.
- Phones get the same items as a slide-in menu. There is nothing to set up for it.

## 10. Writing (the Content editor)

- Split, Prose and CTA Band have one Content editor, typed like a document.
- Its + / slash menu offers the band's own pieces as cards: Pull quote, Icon list, Emphasis
  (and Divider in Prose). One way to make each thing.
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
