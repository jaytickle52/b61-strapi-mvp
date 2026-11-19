import { createServerFeature } from '@payloadcms/richtext-lexical'

/** Server half of the Emphasize button (EmphasizeClient.tsx). */
export const EmphasizeFeature = createServerFeature({
  feature: { ClientFeature: '@/b61/kit/editor/EmphasizeClient#EmphasizeFeatureClient' },
  key: 'b61Emphasize',
})
