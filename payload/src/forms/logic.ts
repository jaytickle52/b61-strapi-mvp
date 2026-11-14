/*
 * Form rules shared by the browser and the server, so a question hidden on
 * screen is also skipped when the answers are checked and saved.
 */

export type FormQuestion = {
  blockType: string
  name?: string | null
  label?: string | null
  required?: boolean | null
  options?: { label: string; value: string }[] | null
  showIf?: string | null
  showIs?: 'equals' | 'notEquals' | 'filled' | 'empty' | null
  showValue?: string | null
  [k: string]: unknown
}

export type Answers = Record<string, string>

/** Kinds of question that collect an answer someone types or picks. */
export const ANSWER_TYPES = new Set([
  'text',
  'textarea',
  'email',
  'phone',
  'number',
  'select',
  'radio',
  'checkbox',
  'date',
  'state',
  'country',
])

const norm = (v: unknown) =>
  String(v ?? '')
    .trim()
    .toLowerCase()

/**
 * Whether a question is shown, given the answers so far. A question that
 * depends on a hidden question is hidden too (rules can chain).
 */
export function isVisible(
  q: FormQuestion,
  all: FormQuestion[],
  answers: Answers,
  depth = 0,
): boolean {
  if (!q.showIf || depth > 10) return true
  const parent = all.find((x) => x.name === q.showIf)
  if (!parent) return true
  if (!isVisible(parent, all, answers, depth + 1)) return false
  const value = answers[q.showIf] ?? ''
  const filled = norm(value) !== '' && !(parent.blockType === 'checkbox' && norm(value) === 'no')
  switch (q.showIs ?? 'equals') {
    case 'filled':
      return filled
    case 'empty':
      return !filled
    case 'notEquals':
      return norm(value) !== norm(q.showValue)
    default:
      return norm(value) === norm(q.showValue)
  }
}

export const MAX_UPLOAD_BYTES = 4 * 1024 * 1024
