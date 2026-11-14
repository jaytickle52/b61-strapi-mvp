import type { Block, Field } from 'payload'
import { B61Hero } from './b61/elements/hero/fields'
import { B61Split } from './b61/elements/split/fields'
import { B61Prose } from './b61/elements/prose/fields'
import { B61Cta } from './b61/elements/cta/fields'

// The sections an editor can add, reorder and remove on any page.
// Each mirrors a Banner 61 design element; the website decides how it looks.

const tone: Field = {
  name: 'tone',
  type: 'select',
  defaultValue: 'light',
  options: [
    { label: 'Light', value: 'light' },
    { label: 'Muted', value: 'muted' },
    { label: 'School color', value: 'brand' },
    { label: 'Dark', value: 'dark' },
  ],
  admin: { description: 'Background color for this section' },
}

const button = (name: string, label: string): Field => ({
  name,
  label,
  type: 'group',
  fields: [
    { name: 'label', type: 'text' },
    { name: 'url', type: 'text' },
    {
      name: 'style',
      type: 'select',
      defaultValue: 'primary',
      options: ['primary', 'secondary', 'link'],
    },
  ],
})

export const CardGrid: Block = {
  slug: 'cardGrid',
  admin: { components: { Label: { path: '@/b61/kit/admin/ElementLabel#ElementLabel', clientProps: { name: 'Card grid' } } } },
  labels: { singular: 'Card grid', plural: 'Card grids' },
  fields: [
    { name: 'heading', type: 'text' },
    { name: 'intro', type: 'textarea' },
    {
      name: 'source',
      type: 'select',
      defaultValue: 'manual',
      options: [
        { label: 'Cards I write here', value: 'manual' },
        { label: 'Programs', value: 'programs' },
        { label: 'Upcoming events', value: 'upcoming-events' },
        { label: 'Latest news', value: 'latest-news' },
        { label: 'Staff', value: 'staff' },
      ],
      admin: { description: 'Fill automatically from your programs, events, news or staff, or write cards by hand.' },
    },
    { name: 'limit', type: 'number', defaultValue: 3, min: 1, max: 12 },
    { name: 'columns', type: 'select', defaultValue: 'three', options: ['two', 'three', 'four'] },
    tone,
    {
      name: 'cards',
      type: 'array',
      admin: { condition: (_, sibling) => sibling?.source === 'manual' },
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'body', type: 'textarea' },
        { name: 'image', type: 'upload', relationTo: 'media' },
        { name: 'link', type: 'text' },
      ],
    },
  ],
}

export const StatsBand: Block = {
  slug: 'statsBand',
  admin: { components: { Label: { path: '@/b61/kit/admin/ElementLabel#ElementLabel', clientProps: { name: 'Stats band' } } } },
  labels: { singular: 'Stats band', plural: 'Stats bands' },
  fields: [
    { name: 'heading', type: 'text' },
    tone,
    {
      name: 'stats',
      type: 'array',
      maxRows: 6,
      fields: [
        { name: 'value', type: 'text', required: true },
        { name: 'label', type: 'text', required: true },
      ],
    },
  ],
}

export const sectionBlocks = [B61Hero, B61Split, B61Prose, B61Cta, CardGrid, StatsBand]
