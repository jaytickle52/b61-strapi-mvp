/*
 * Banner 61 marks for the admin. Brand colors: ink #3F3B4C, paper #F0F1EE,
 * text #101827, accent #EE5758. To use the real logo file instead, swap the
 * <svg> for an <img src="/b61-logo.svg"> and put the file in payload/public.
 */

function Mark({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" aria-hidden="true" focusable="false">
      <rect width="40" height="40" rx="8" fill="#3F3B4C" />
      <path d="M8 8h6v24l-3-2.5L8 32z" fill="#EE5758" />
      <text x="26.5" y="27" textAnchor="middle" fontFamily="Inter, system-ui, sans-serif" fontWeight="800" fontSize="16" fill="#F0F1EE">
        61
      </text>
    </svg>
  )
}

/** Login page and other large spots. */
export function Logo() {
  return (
    <div className="b61-logo">
      <Mark size={48} />
      <span className="b61-logo__text">
        <span className="b61-logo__name">Banner 61</span>
        <span className="b61-logo__tag">School website editor</span>
      </span>
    </div>
  )
}

/** Small mark at the top of the left-hand menu and the step-nav. */
export function Icon() {
  return (
    <span className="b61-icon" title="Banner 61">
      <Mark size={18} />
    </span>
  )
}
