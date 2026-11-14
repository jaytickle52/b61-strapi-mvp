'use client'
import Script from 'next/script'
import { useCallback, useMemo, useRef, useState, type FormEvent, type ReactNode } from 'react'
import { isVisible, type Answers, type FormQuestion } from '@/forms/logic'
import { HONEYPOT } from '@/forms/constants'

export type ClientQuestion = FormQuestion & {
  id?: string
  help?: string | null
  width: string
  placeholder?: string | null
  defaultValue?: string | boolean | null
  multiple?: boolean | null
  accept?: string
  statement?: string | null
  message?: ReactNode
}

type Props = {
  formId: number | string
  anchor: string
  stamp: string
  questions: ClientQuestion[]
  submitLabel: string
  redirect?: string
  turnstileSiteKey?: string
  confirmation: ReactNode
}

const autoComplete = (q: ClientQuestion): string | undefined => {
  const n = `${q.name} ${q.label}`.toLowerCase()
  if (q.blockType === 'email') return 'email'
  if (q.blockType === 'phone') return 'tel'
  if (q.blockType === 'state') return 'address-level1'
  if (q.blockType === 'country') return 'country-name'
  if (q.blockType !== 'text') return undefined
  if (/first.?name|given/.test(n)) return 'given-name'
  if (/last.?name|surname|family.?name/.test(n)) return 'family-name'
  if (/(zip|postal)/.test(n)) return 'postal-code'
  if (/city|town/.test(n)) return 'address-level2'
  if (/address|street/.test(n)) return 'street-address'
  if (/(parent|your|full).?name|^name/.test(n)) return 'name'
  return undefined
}

const initialAnswers = (qs: ClientQuestion[]): Answers =>
  Object.fromEntries(
    qs
      .filter((q) => q.name)
      .map((q) => [
        q.name!,
        q.blockType === 'checkbox' ? (q.defaultValue ? 'Yes' : 'No') : String(q.defaultValue ?? ''),
      ]),
  )

export default function FormClient(p: Props) {
  const formRef = useRef<HTMLFormElement>(null)
  const summaryRef = useRef<HTMLDivElement>(null)
  const doneRef = useRef<HTMLDivElement>(null)
  const [answers, setAnswers] = useState<Answers>(() => initialAnswers(p.questions))
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [message, setMessage] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const [done, setDone] = useState(false)

  const visible = useMemo(() => {
    const out: Record<string, boolean> = {}
    for (const q of p.questions) out[q.id ?? q.name ?? ''] = isVisible(q, p.questions, answers)
    return out
  }, [answers, p.questions])

  const read = useCallback(() => {
    const el = formRef.current
    if (!el) return
    const next: Answers = {}
    for (const q of p.questions) {
      if (!q.name) continue
      if (q.blockType === 'checkbox')
        next[q.name] = (el.elements.namedItem(q.name) as HTMLInputElement | null)?.checked
          ? 'Yes'
          : 'No'
      else if (q.blockType === 'radio')
        next[q.name] =
          (
            el.querySelector(
              `input[name="${CSS.escape(q.name)}"]:checked`,
            ) as HTMLInputElement | null
          )?.value ?? ''
      else
        next[q.name] = String(
          (el.elements.namedItem(q.name) as HTMLInputElement | null)?.value ?? '',
        ).trim()
    }
    setAnswers(next)
  }, [p.questions])

  const internal = p.redirect && p.redirect.startsWith('/') ? p.redirect : undefined

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (busy) return
    setBusy(true)
    setMessage(null)
    setErrors({})
    try {
      const res = await fetch('/next/form', {
        method: 'POST',
        body: new FormData(e.currentTarget),
        headers: { Accept: 'application/json' },
      })
      const data = await res
        .json()
        .catch(() => ({
          ok: false,
          message: 'Your answers could not be sent. The files may be too large.',
        }))
      if (data.ok) {
        if (p.redirect) {
          window.location.assign(p.redirect)
          return
        }
        setDone(true)
        requestAnimationFrame(() => doneRef.current?.focus())
        return
      }
      setErrors(data.errors ?? {})
      setMessage(data.message ?? 'Something went wrong. Please try again.')
      // Turnstile tokens are single-use.
      ;(window as any).turnstile?.reset?.()
      requestAnimationFrame(() => summaryRef.current?.focus())
    } catch {
      setMessage('Your answers could not be sent. Please check your connection and try again.')
      requestAnimationFrame(() => summaryRef.current?.focus())
    } finally {
      setBusy(false)
    }
  }

  if (done) {
    return (
      <div className="b61-form__done" ref={doneRef} tabIndex={-1} role="status">
        {p.confirmation}
      </div>
    )
  }

  const errorList = Object.entries(errors)

  return (
    <form
      ref={formRef}
      className="b61-form__form"
      action="/next/form"
      method="post"
      encType="multipart/form-data"
      noValidate
      onSubmit={onSubmit}
      onChange={read}
      onInput={read}
      aria-busy={busy}
    >
      <input type="hidden" name="form" value={String(p.formId)} />
      <input type="hidden" name="b61_t" value={p.stamp} />
      {internal && <input type="hidden" name="b61_done" value={internal} />}
      <div className="b61-form__hp" aria-hidden="true">
        <label>
          Leave this empty
          <input type="text" name={HONEYPOT} tabIndex={-1} autoComplete="off" defaultValue="" />
        </label>
      </div>

      <div
        className="b61-form__summary"
        ref={summaryRef}
        tabIndex={-1}
        role="alert"
        hidden={!message}
      >
        {message && <p className="b61-form__summary-title">{message}</p>}
        {errorList.length > 0 && (
          <ul>
            {errorList.map(([name, msg]) => (
              <li key={name}>
                <a href={`#${p.anchor}-${name}`}>{msg}</a>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="b61-form__grid">
        {p.questions.map((q, i) => {
          const key = q.id ?? q.name ?? String(i)
          const shown = visible[key] !== false
          return (
            <Question
              key={key}
              q={q}
              id={`${p.anchor}-${q.name ?? i}`}
              shown={shown}
              error={q.name ? errors[q.name] : undefined}
              onSigned={read}
            />
          )
        })}
      </div>

      {p.turnstileSiteKey && (
        <>
          <Script
            src="https://challenges.cloudflare.com/turnstile/v0/api.js"
            strategy="afterInteractive"
          />
          <div className="cf-turnstile b61-form__turnstile" data-sitekey={p.turnstileSiteKey} />
        </>
      )}

      <div className="b61-form__actions">
        <button type="submit" className="b61-btn b61-btn--primary" disabled={busy}>
          {busy ? 'Sending…' : p.submitLabel}
        </button>
      </div>
    </form>
  )
}

function Question({
  q,
  id,
  shown,
  error,
  onSigned,
}: {
  q: ClientQuestion
  id: string
  shown: boolean
  error?: string
  onSigned: () => void
}) {
  const width = q.width === '50' ? 'w50' : q.width === '33' ? 'w33' : 'w100'
  const cls = [
    'b61-form__field',
    `b61-form__field--${width}`,
    `b61-form__field--${q.blockType}`,
    error && 'b61-form__field--error',
  ]
    .filter(Boolean)
    .join(' ')
  const helpId = q.help ? `${id}-help` : undefined
  const errId = error ? `${id}-error` : undefined
  const describedBy = [helpId, errId].filter(Boolean).join(' ') || undefined
  const required = Boolean(q.required) && shown
  const common = {
    id,
    name: q.name ?? undefined,
    required,
    disabled: !shown,
    'aria-invalid': error ? true : undefined,
    'aria-describedby': describedBy,
  } as const

  if (q.blockType === 'message') {
    return (
      <div className={cls} hidden={!shown}>
        <div className="b61-form__message">{q.message}</div>
      </div>
    )
  }

  const label = (
    <>
      {q.label || q.name}
      {q.required && (
        <span className="b61-form__req">
          <span aria-hidden="true"> *</span>
          <span className="b61-sr-only"> (required)</span>
        </span>
      )}
    </>
  )
  const help = q.help ? (
    <p className="b61-form__help" id={helpId}>
      {q.help}
    </p>
  ) : null
  const err = error ? (
    <p className="b61-form__error" id={errId}>
      {error}
    </p>
  ) : null

  if (q.blockType === 'radio') {
    return (
      <fieldset
        className={cls}
        hidden={!shown}
        disabled={!shown}
        aria-describedby={describedBy}
        id={id}
        tabIndex={-1}
      >
        <legend className="b61-form__label">{label}</legend>
        {help}
        <div className="b61-form__choices">
          {(q.options ?? []).map((o, i) => (
            <label key={o.value + i} className="b61-form__choice">
              <input
                type="radio"
                name={q.name ?? undefined}
                value={o.value}
                required={required}
                defaultChecked={q.defaultValue === o.value}
              />
              <span>{o.label}</span>
            </label>
          ))}
        </div>
        {err}
      </fieldset>
    )
  }

  if (q.blockType === 'checkbox') {
    return (
      <div className={cls} hidden={!shown}>
        <label className="b61-form__choice b61-form__choice--single">
          <input type="checkbox" {...common} value="Yes" defaultChecked={Boolean(q.defaultValue)} />
          <span>{label}</span>
        </label>
        {help}
        {err}
      </div>
    )
  }

  if (q.blockType === 'signature')
    return (
      <Signature
        q={q}
        id={id}
        cls={cls}
        shown={shown}
        label={label}
        help={help}
        err={err}
        describedBy={describedBy}
        onSigned={onSigned}
      />
    )

  let control: ReactNode
  switch (q.blockType) {
    case 'textarea':
      control = (
        <textarea
          {...common}
          rows={5}
          defaultValue={String(q.defaultValue ?? '')}
          placeholder={q.placeholder ?? undefined}
        />
      )
      break
    case 'select':
    case 'state':
    case 'country':
      control = (
        <select
          {...common}
          defaultValue={String(q.defaultValue ?? '')}
          autoComplete={autoComplete(q)}
        >
          <option value="">{q.placeholder || 'Choose…'}</option>
          {(q.options ?? []).map((o, i) => (
            <option key={o.value + i} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      )
      break
    case 'upload':
      control = <input {...common} type="file" multiple={Boolean(q.multiple)} accept={q.accept} />
      break
    default: {
      const type =
        { email: 'email', phone: 'tel', number: 'number', date: 'date' }[q.blockType] ?? 'text'
      control = (
        <input
          {...common}
          type={type}
          defaultValue={String(q.defaultValue ?? '')}
          placeholder={q.placeholder ?? undefined}
          autoComplete={autoComplete(q)}
          inputMode={q.blockType === 'phone' ? 'tel' : undefined}
        />
      )
    }
  }

  return (
    <div className={cls} hidden={!shown}>
      <label className="b61-form__label" htmlFor={id}>
        {label}
      </label>
      {help}
      {control}
      {q.blockType === 'upload' && <p className="b61-form__help">Up to 4 MB.</p>}
      {err}
    </div>
  )
}

/** Draw with a finger, mouse or pen; or type your name instead (keyboard and screen reader users). */
function Signature({
  q,
  id,
  cls,
  shown,
  label,
  help,
  err,
  describedBy,
  onSigned,
}: {
  q: ClientQuestion
  id: string
  cls: string
  shown: boolean
  label: ReactNode
  help: ReactNode
  err: ReactNode
  describedBy?: string
  onSigned: () => void
}) {
  const canvas = useRef<HTMLCanvasElement>(null)
  const drawing = useRef(false)
  const [data, setData] = useState('')
  const [typing, setTyping] = useState(false)

  const ctx = () => {
    const c = canvas.current
    if (!c) return null
    const g = c.getContext('2d')
    if (g && c.width !== c.clientWidth * 2) {
      c.width = c.clientWidth * 2
      c.height = c.clientHeight * 2
      g.scale(2, 2)
      g.lineWidth = 2.2
      g.lineCap = 'round'
      g.lineJoin = 'round'
      g.strokeStyle = '#111'
    }
    return g
  }
  const pos = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const r = e.currentTarget.getBoundingClientRect()
    return [e.clientX - r.left, e.clientY - r.top] as const
  }
  const clear = () => {
    const c = canvas.current
    c?.getContext('2d')?.clearRect(0, 0, c.width, c.height)
    setData('')
    onSigned()
  }

  return (
    <fieldset
      className={cls}
      hidden={!shown}
      disabled={!shown}
      id={id}
      tabIndex={-1}
      aria-describedby={describedBy}
    >
      <legend className="b61-form__label">{label}</legend>
      {q.statement && <p className="b61-form__statement">{q.statement}</p>}
      {help}
      {typing ? (
        <div className="b61-form__typed">
          <label htmlFor={`${id}-typed`} className="b61-form__label b61-form__label--sub">
            Type your full name to sign
          </label>
          <input
            id={`${id}-typed`}
            name={`${q.name}__typed`}
            type="text"
            autoComplete="name"
            required={Boolean(q.required) && shown}
          />
        </div>
      ) : (
        <>
          <canvas
            ref={canvas}
            className="b61-form__pad"
            aria-label="Signature pad. Draw your signature, or choose Type instead."
            role="img"
            onPointerDown={(e) => {
              const g = ctx()
              if (!g) return
              e.currentTarget.setPointerCapture(e.pointerId)
              drawing.current = true
              const [x, y] = pos(e)
              g.beginPath()
              g.moveTo(x, y)
            }}
            onPointerMove={(e) => {
              if (!drawing.current) return
              const g = ctx()
              const [x, y] = pos(e)
              g?.lineTo(x, y)
              g?.stroke()
            }}
            onPointerUp={() => {
              drawing.current = false
              setData(canvas.current?.toDataURL('image/png') ?? '')
              onSigned()
            }}
          />
          <input type="hidden" name={q.name ?? undefined} value={data} />
        </>
      )}
      <div className="b61-form__pad-actions">
        {!typing && (
          <button type="button" className="b61-form__link" onClick={clear}>
            Clear
          </button>
        )}
        <button type="button" className="b61-form__link" onClick={() => setTyping((t) => !t)}>
          {typing ? 'Draw instead' : 'Type instead'}
        </button>
      </div>
      {err}
    </fieldset>
  )
}
