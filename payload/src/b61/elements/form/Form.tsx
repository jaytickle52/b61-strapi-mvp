import type { CSSProperties } from 'react'
import type { Page } from '@/payload-types'
import RichText from '@/components/RichText'
import { currentSchool, payloadClient } from '@/lib/data'
import { formStamp } from '@/forms/submit'
import { countryOptions, US_STATES } from '@/forms/places'
import { resolveHeadingLevel } from '../../kit/groups'
import { HeadingLines, revealAttr } from '../../kit/render/parts'
import FormClient, { type ClientQuestion } from './FormClient'
import { headingText } from '../../kit/heading'

export type FormBlock = Extract<NonNullable<Page['sections']>[number], { blockType: 'b61Form' }>

/*
 * B61 Form: a school's form in the B61 design. The questions render here on
 * the server; FormClient adds "Show only when", the signature pad and sending.
 * Without JavaScript the form still posts to /next/form.
 */
export default async function B61Form({ block, index = 0 }: { block: FormBlock; index?: number }) {
  const ref = block.form as any
  const id = ref && typeof ref === 'object' ? ref.id : ref
  if (!id) return null
  const payload = await payloadClient()
  const school = await currentSchool()
  const form: any = await payload
    .findByID({ collection: 'forms', id, depth: 1, overrideAccess: true })
    .catch(() => null)
  const formSchool = form?.school && typeof form.school === 'object' ? form.school.id : form?.school
  if (!form || (school && formSchool !== school.id)) return null

  const ri = revealAttr(block.entrance)
  const rv = block.entrance === 'off' ? 'off' : 'on'
  const Heading = resolveHeadingLevel(block.headingLevel, index)
  const surface = block.surface ?? 'none'
  const align = block.textAlign === 'center' ? 'center' : 'left'
  const pt = block.padTop ?? 'normal'
  const pb = block.padBottom ?? 'normal'
  const card = block.card === 'card' || surface === 'dark' || surface === 'accent'
  const title = headingText(block.heading)
  const hasHeading = Boolean(title)
  const anchor = `b61-form-${block.id ?? index}`
  const headingId = `${anchor}-heading`
  const Wrap = hasHeading ? 'section' : 'div'
  const wStep = block.widthStep ? Math.min(Math.max(Math.round(block.widthStep), 1), 7) : null

  // Only what the browser needs: never the form's email settings.
  const questions: ClientQuestion[] = (form.fields ?? []).map((q: any) => ({
    id: q.id,
    blockType: q.blockType,
    name: q.name,
    label: q.label,
    help: q.help,
    required: Boolean(q.required),
    width: String(q.width ?? '100'),
    placeholder: q.placeholder,
    defaultValue: q.defaultValue,
    options:
      q.blockType === 'state'
        ? US_STATES.map(([, n]) => ({ label: n, value: n }))
        : q.blockType === 'country'
          ? countryOptions().map(([, n]) => ({ label: n, value: n }))
          : q.options,
    multiple: q.multiple,
    accept:
      (q.mimeTypes ?? [])
        .map((m: any) => m?.mimeType)
        .filter(Boolean)
        .join(',') || (q.blockType === 'upload' ? '.pdf,.doc,.docx,image/*' : undefined),
    statement: q.statement,
    showIf: q.showIf,
    showIs: q.showIs,
    showValue: q.showValue,
    message: q.blockType === 'message' ? <RichText content={q.message} /> : undefined,
  }))

  let redirect: string | undefined
  if (form.confirmationType === 'redirect') {
    const r = form.redirect ?? {}
    if (r.type === 'reference' && r.reference?.value && typeof r.reference.value === 'object') {
      const slug = r.reference.value.slug
      redirect = slug === 'home' ? '/' : `/${slug}`
    } else if (r.url) redirect = r.url
  }

  return (
    <div
      className={[
        'b61-form',
        `b61-talign-${align}`,
        block.eyebrowRule && block.eyebrowRule !== 'site' && `b61-erule-${block.eyebrowRule}`,
      ]
        .filter(Boolean)
        .join(' ')}
      style={wStep ? ({ '--b61-form-w': `var(--b61-box-${wStep})` } as CSSProperties) : undefined}
      id={anchor}
    >
      <Wrap
        className={[
          'b61-form__region',
          `b61-surface--${surface}`,
          surface !== 'none' && `b61-band--${surface}`,
          `b61-form__region--pt-${pt}`,
          `b61-form__region--pb-${pb}`,
        ]
          .filter(Boolean)
          .join(' ')}
        data-b61-reveal={rv}
        {...(hasHeading ? { 'aria-labelledby': headingId } : {})}
      >
        <div className="b61-form__inner">
          {(block.eyebrow || hasHeading || (block.subheads ?? []).length > 0) && (
            <div className="b61-form__head">
              {block.eyebrow && (
                <span className="b61-form__eyebrow b61-block" {...ri}>
                  {block.eyebrow}
                </span>
              )}
              <HeadingLines
                as={Heading}
                id={headingId}
                className="b61-form__heading b61-block"
                lineClass="b61-form__heading-line"
                heading={block.heading}
                ri={ri}
              />
              {(block.subheads ?? [])
                .filter((s) => s?.text)
                .map((s, i) => (
                  <p key={s.id ?? i} className="b61-form__subhead b61-block" {...ri}>
                    {s.text}
                  </p>
                ))}
            </div>
          )}
          <div
            className={[
              'b61-form__panel',
              card && 'b61-form__panel--card b61-surface--plain b61-band--plain b61-card',
            ]
              .filter(Boolean)
              .join(' ')}
            {...ri}
          >
            <FormClient
              formId={form.id}
              anchor={anchor}
              stamp={formStamp(form.id)}
              questions={questions}
              submitLabel={form.submitButtonLabel || 'Send'}
              redirect={redirect}
              turnstileSiteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || undefined}
              confirmation={<RichText content={form.confirmationMessage} />}
            />
          </div>
        </div>
      </Wrap>
    </div>
  )
}
