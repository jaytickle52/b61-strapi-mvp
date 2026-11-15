import type { CollectionConfig } from 'payload'

/** Adds click-to-edit (kit/admin/PreviewFocus) to a collection with a live preview. */
export const withPreviewFocus = (c: CollectionConfig): CollectionConfig => ({
  ...c,
  admin: {
    ...c.admin,
    components: {
      ...c.admin?.components,
      edit: {
        ...c.admin?.components?.edit,
        beforeDocumentControls: [...(c.admin?.components?.edit?.beforeDocumentControls ?? []), '@/b61/kit/admin/PreviewFocus#PreviewFocus'],
      },
    },
  },
})
