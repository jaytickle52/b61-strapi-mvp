import { support } from './support'

/** A short note above the sign-in form. */
export function BeforeLogin() {
  const help = support()
  return (
    <div className="b61-login-note">
      <p>Sign in to update your school&apos;s website.</p>
      <p>
        Forgot your password? Use the link below the form.
        {help.email && (
          <>
            {' '}
            Still stuck? Email <a href={`mailto:${help.email}`}>{help.email}</a>.
          </>
        )}
      </p>
    </div>
  )
}
