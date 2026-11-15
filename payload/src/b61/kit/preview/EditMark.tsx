/*
 * Click-to-edit (live preview only). An invisible marker in front of each
 * element says which part of the editor it comes from. EditOverlay reads the
 * markers in the browser. <template> is used because the plugin CSS already
 * ignores it when counting children (see Section's rail rules), so layout is
 * unchanged. Outside the live preview nothing is rendered.
 */
const NAMES: Record<string, string> = { b61Cta: 'CTA Band' }

export const elementName = (blockType: string) =>
  NAMES[blockType] ?? blockType.replace(/^b61/, '').replace(/([a-z])([A-Z])/g, '$1 $2')

export default function EditMark({ path, label, tab }: { path?: string | null; label: string; tab?: string }) {
  if (!path && !tab) return null
  return <template data-b61-edit={path ?? ''} data-b61-edit-tab={tab} data-b61-edit-label={label} />
}
