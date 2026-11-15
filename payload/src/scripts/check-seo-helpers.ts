import { countH1 } from '@/b61/kit/headings'
import { clip, descriptionFrom } from '@/seo/text'
import { joinAddress, profileUrl, splitAddress } from '@/school/fields'
import { officeHours } from '@/school/facts'
import { factSentence, faqSchema } from '@/seo/schema'

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

// ----- Address, links and facts (structured data) -------------------------------
const same = (a: unknown, b: unknown) => JSON.stringify(a) === JSON.stringify(b)
check(same(splitAddress('410 Cedar Ridge Road\nGreenville, SC 29601'), { street: '410 Cedar Ridge Road', city: 'Greenville', state: 'SC', postalCode: '29601' }), 'two-line address splits into parts')
check(same(splitAddress('123 Elm St, Taylors, SC 29687'), { street: '123 Elm St', city: 'Taylors', state: 'SC', postalCode: '29687' }), 'one-line address splits too')
check(same(splitAddress('100 Main St, Suite 2\nSpartanburg, SC 29301-1234'), { street: '100 Main St, Suite 2', city: 'Spartanburg', state: 'SC', postalCode: '29301-1234' }), 'suite and ZIP+4 kept')
check(joinAddress({ street: '410 Cedar Ridge Road', city: 'Greenville', state: 'SC', postalCode: '29601' }) === '410 Cedar Ridge Road\nGreenville, SC 29601', 'parts join back into the footer address')
check(profileUrl('https://facebook.com/') !== true && profileUrl('https://facebook.com/cedarridge') === true && profileUrl('facebook.com/x') !== true, 'social links must be a full profile address')
check(officeHours(['Mo', 'Tu', 'We', 'Th', 'Fr'], '07:30', '16:00') === 'Mon–Fri, 7:30 AM–4:00 PM', 'office hours read like a person wrote them')
check(officeHours(['Mo', 'We'], '08:00', '12:00') === 'Mon, Wed, 8:00 AM–12:00 PM', '… with gaps between days')
check(factSentence({ grades: 'PreK–12', denomination: 'Nondenominational', city: 'Greenville', state: 'SC', foundedYear: 1987 }) === 'A PreK–12 nondenominational school in Greenville, SC, founded in 1987.', 'facts make one plain sentence')
check(faqSchema([{ title: 'Is there a bus?', body: lexical('Yes, from Greer.') }])?.mainEntity?.[0]?.acceptedAnswer?.text === 'Yes, from Greer.', 'an FAQ accordion item becomes a question and answer')
check(faqSchema([{ title: 'No answer', body: null }]) === null, 'questions without answers are left out')

console.log(failed ? `\n${failed} failed` : '\nSEO helper checks passed')
process.exit(failed ? 1 : 0)
