import { serviceAccountEmail } from './ga'

/*
 * School settings > Analytics: tells Banner 61 which email to give Viewer
 * access in the school's Google Analytics property.
 */
export function SetupNote({ user }: { user?: any }) {
  if (user?.role !== 'admin') return null
  const email = serviceAccountEmail()
  return (
    <div className="field-type b61-ga-note">
      <span className="field-label">Connecting this school (Banner 61 only)</span>
      {email ? (
        <p className="field-description">
          In the school&apos;s Google Analytics, open Admin &gt; Property access management and add{' '}
          <strong style={{ userSelect: 'all' }}>{email}</strong> as a Viewer. Then enter the property ID above.
        </p>
      ) : (
        <p className="field-description">
          The Banner 61 Google service account isn&apos;t connected yet: add its key as GA_SERVICE_ACCOUNT_JSON in Vercel. The tag
          ID above still works without it.
        </p>
      )}
    </div>
  )
}
