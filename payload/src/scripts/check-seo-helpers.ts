import { countH1 } from '@/b61/kit/headings'
import { clip, descriptionFrom } from '@/seo/text'

/*
 * Checks the small SEO helpers that run without a site: the page editor's
 * one-H1 rule and the automatic meta descriptions. Part of the CI checks.
 *   npx payload run src/scripts/check-seo-helpers.ts
 */
let failed = 0
const check = (ok: boolean, what: string) => {
  if (!ok) failed++
  console.log(`${ok ? '  ok ' : 'FAIL '} ${what}`)
}
const f = (o: Record<string, unknown>) => Object.fromEntries(Object.entries(o).map(([k, value]) => [k, { value }]))

// ----- One H1 per page -------------------------------------------------------
check(countH1(f({ title: 'About' })) === null, 'no sections yet: no note')
check(countH1(f({ 'sections.0.headingLevel': 'auto', 'sections.0.lines.0.text': 'Welcome' })) === 1, 'first section on Automatic is the H1')
check(
  countH1(f({ 'sections.0.headingLevel': 'auto', 'sections.0.lines.0.text': '', 'sections.1.headingLevel': 'auto', 'sections.1.lines.0.text': 'Second' })) === 0,
  'a first section without heading words gives no H1 (later sections stay H2)',
)
check(
  countH1(f({ 'sections.0.headingLevel': 'auto', 'sections.0.lines.0.text': 'Hero', 'sections.2.headingLevel': 'h1', 'sections.2.lines.0.text': 'Prose' })) === 2,
  'an extra section set to H1 makes two',
)
check(countH1(f({ 'sections.0.headingLevel': 'h2', 'sections.0.lines.0.text': 'Hero' })) === 0, 'first section set to H2: no H1')
check(
  countH1(
    f({
      'sections.0.headingLevel': 'h2',
      'sections.0.lines.0.text': 'Band',
      'sections.0.columns.0.blocks.0.headingLevel': 'auto',
      'sections.0.columns.0.blocks.0.lines.0.text': 'Inner',
    }),
  ) === 0,
  'Automatic inside a container never becomes H1',
)
check(
  countH1(
    f({
      'sections.0.headingLevel': 'auto',
      'sections.0.lines.0.text': 'Hero',
      'sections.1.tabs.0.content.0.headingLevel': 'h1',
      'sections.1.tabs.0.content.0.lines.0.text': 'Tab prose',
    }),
  ) === 2,
  'an explicit H1 inside a container counts',
)
check(countH1(f({ 'sections.0.design.headingLevel': 'auto', 'sections.0.lines.0.text': 'Hero' })) === 1, 'heading level inside a named group still counts')

// ----- Automatic descriptions --------------------------------------------------
const lexical = (t: string) => ({ root: { type: 'root', children: [{ type: 'paragraph', children: [{ type: 'text', text: t }] }] } })
check(descriptionFrom(lexical('Our robotics team placed second.')) === 'Our robotics team placed second.', 'rich text becomes the description')
check(
  descriptionFrom([{ blockType: 'b61Hero', eyebrow: 'Welcome', lines: [{ text: 'Rooted' }], subheadline: 'A K-12 school in Greenville.', primary: { label: 'Schedule a tour' } }]) ===
    'A K-12 school in Greenville.',
  'sections: running text only, not eyebrows, headings or button labels',
)
const long = 'Cedar Ridge is a K-12 Christian school in Greenville. '.repeat(6)
const d = descriptionFrom(lexical(long))
check(d.length <= 155 && d.endsWith('.'), `long text is cut at a sentence (${d.length} characters)`)
check(clip('word '.repeat(60)).endsWith('…') && clip('word '.repeat(60)).length <= 155, 'no sentence end: cut at a word with an ellipsis')
check(descriptionFrom([{ blockType: 'b61Divider' }]) === '', 'nothing to say: empty, so the page default is used')

console.log(failed ? `\n${failed} failed` : '\nSEO helper checks passed')
process.exit(failed ? 1 : 0)
