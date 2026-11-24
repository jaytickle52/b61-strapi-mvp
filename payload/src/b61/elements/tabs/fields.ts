import { defineElement, panel } from '../../kit/element'
import { dropdown, segmented, toggle } from '../../kit/controls'
import { bandHeadFields, entranceField, eyebrowRuleField, headingAlignField, list, paddingFields, photo, surfaceField } from '../../kit/groups'
import { itemBodyWithButtonEditor } from '../../kit/body'
import { innerField, tabBlocks } from '../../inner'

/*
 * B61 TABS: one element for every "click a name, see its content" pattern
 * (Jay, 20 Nov 2026). It replaces both Tabs (tabs holding elements) and
 * Tabbed Features (Pillars: tabs with a photo each), which looked alike and
 * left editors guessing which to use.
 *
 * Every tab has a Title, Text (with buttons) and a Photo. Layout decides how
 * they show: Tabs on top or beside (the tab's text and photo side by side,
 * plus "More in this tab" elements if any), Feature list (titles with their
 * text beside one large photo; was Tabbed Features) or Scroll story.
 * The editor shows the tabs as a row of names (kit/admin/TabStrip.tsx).
 */
const usesPanels = (_: unknown, __: unknown, ctx?: { blockData?: any }) => ['top', 'beside', undefined, null].includes(ctx?.blockData?.layout)

export const B61Tabs = defineElement({
  slug: 'b61Tabs',
  name: 'Tabs',
  plural: 'Tabs',
  mode: { field: 'layout', labels: { top: 'Tabs on top', beside: 'Tabs beside', list: 'Feature list', story: 'Scroll story' } },
  content: [
    dropdown(
      'layout',
      'Layout',
      [
        ['top', 'Tabs on top'],
        ['beside', 'Tabs beside'],
        ['list', 'Feature list'],
        ['story', 'Scroll story'],
      ],
      { default: 'top' },
    ),
    panel('Heading', bandHeadFields({ intro: true })),
    list(
      'tabs',
      'Tabs',
      'Tab',
      [
        { name: 'label', label: 'Title', type: 'text', required: true },
        { name: 'body', label: 'Text', type: 'richText', editor: itemBodyWithButtonEditor(), admin: { description: 'Use + or / to add a button.' } },
        photo('image', 'Photo'),
        innerField('content', 'More in this tab', {
          only: tabBlocks,
          description: 'Other elements under the text and photo.',
          condition: usesPanels,
        }),
      ],
      { admin: { components: { Field: '@/b61/kit/admin/TabStrip#TabStrip' } } as any },
    ),
    { ...toggle('firstItemOpen', 'First tab open'), defaultValue: true } as any,
  ],
  design: {
    layout: [
      segmented('side', 'Tab side', [['left', 'Left', 'side-left'], ['right', 'Right', 'side-right']], {
        default: 'left',
        when: { field: 'layout', in: ['beside', 'list', 'story'] },
      }),
      segmented('tabAlign', 'Tab alignment', [['left', 'Left'], ['center', 'Center'], ['full', 'Full width']], {
        default: 'left',
        when: { field: 'layout', in: ['top', null] },
      }),
      // Pills: rounded buttons, the open one filled (design fidelity, Nov 2026).
      segmented('tabStyle', 'Tab style', [['line', 'Underline'], ['pills', 'Pills']], {
        default: 'line',
        when: { field: 'layout', in: ['top', null] },
      }),
      headingAlignField(),
    ],
    size: [paddingFields()],
    color: [surfaceField()],
    accents: [eyebrowRuleField(), entranceField()],
  },
})
