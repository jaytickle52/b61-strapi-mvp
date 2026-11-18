/*
 * Banner 61 marks for the admin, from the real logo files in payload/public:
 *   b61-logo.png       full logo (ink letters) for the light theme
 *   b61-logo-dark.png  same logo with light letters for the dark theme
 *   b61-icon.png       the round flag mark (menu, step-nav)
 * Brand colors: ink #3F3B4C, paper #F0F1EE, text #101827, accent #EE5758.
 */

/** Login page and other large spots. */
export function Logo() {
  return (
    <div className="b61-logo">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="b61-logo__img b61-logo__img--light" src="/b61-logo.png" alt="Banner 61" width={140} height={60} />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="b61-logo__img b61-logo__img--dark" src="/b61-logo-dark.png" alt="Banner 61" width={140} height={60} />
      <span className="b61-logo__tag">School website editor</span>
    </div>
  )
}

/** Small mark at the top of the left-hand menu and the step-nav. */
export function Icon() {
  return (
    <span className="b61-icon" title="Banner 61">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/b61-icon.png" alt="" width={18} height={18} />
    </span>
  )
}
