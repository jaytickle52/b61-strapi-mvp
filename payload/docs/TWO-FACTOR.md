# Two-factor sign-in

Staff can protect their editor account with a 6-digit code from an
authenticator app (Google Authenticator, Microsoft Authenticator, 1Password,
Authy, etc.). Built on the community plugin
[payload-totp](https://github.com/GeorgeHulpoi/payload-totp) plus
`src/users/two-factor.ts`.

## Who has to use it (decided 17 Nov 2026)

- **Banner 61 admins: required on the live site.** After the next sign-in they
  are sent to the setup page and can't do anything else until it's done.
- **School staff: optional.** Account (top right) > Authenticator app > Set up.
- Previews, CI and local copies don't require it. `B61_REQUIRE_ADMIN_2FA` in
  Vercel overrides that: `true` requires it anywhere, `false` switches the
  requirement off (emergency only; people who already set it up still need
  their code).

## Setting it up

1. Sign in with email and password.
2. On the setup page, scan the QR code with the authenticator app (or type the
   key shown under it).
3. Enter the 6-digit code the app shows. Done: from now on, each sign-in asks
   for the code after the password.

The app entry is named "Banner 61" with your email. The account gets an email
whenever two-factor is turned on or reset, so a change someone else made
doesn't go unnoticed.

## Turning it on for Banner 61 (right after the merge)

Until a Banner 61 admin has set it up, anyone holding that admin's password
could set it up first and lock the owner out (the email above would flag
it). So straight after the deploy, each Banner 61 admin should sign in at
b61-schools.vercel.app/admin and complete the setup page.

## What a password alone gets you once it's on

Nothing staff-only. Until the code is entered, every collection refuses the
session (except reading your own account and your schools' names, which the
code page needs), and the custom endpoints (uploads, invites, exports, etc.)
treat it as signed out. The public sites are unaffected. Too many wrong codes
lock the account for a while, like wrong passwords do.

MCP keys (Claude) keep working without a code: a key isn't a password.

## Lost or new phone

- **School staff or another Banner 61 admin:** a Banner 61 admin opens their
  account (Users) and presses **Reset two-factor** in the sidebar. They sign in
  with their password and set it up again. The reset also signs them out on
  every device and emails them.
- **You can't reset your own.** Ask another Banner 61 admin.
- **The only Banner 61 admin is locked out:** in the Neon console > SQL Editor
  on the production branch, run
  ```sql
  UPDATE users SET totp_secret = NULL WHERE email = 'you@banner61.com';
  ```
  then sign in and set it up again.

Tip: most authenticator apps can back up to the cloud (Google Authenticator,
1Password, Authy). Turn that on, and having two Banner 61 admins avoids the
SQL step.

## How it's built

- `src/users/two-factor-rules.ts`: `twoFactorPending(user)` (has it, or must have it
  as a Banner 61 admin, and this session hasn't entered a code; keys never owe
  one); no imports, so the public site code can use it. `src/users/two-factor.ts`:
  `guardEverything` (wraps every collection and global's access and every
  custom endpoint registered before it; anonymous visitors go straight to the
  normal rules), then `payloadTotp(...)`, then `providersFirst` (the two-factor
  redirects run before any other admin provider; also emails the account after
  setup, `src/users/two-factor-email.ts`). Must stay last in `plugins`.
- Also treated as signed out while a code is owed: the preview route
  (`/next/preview`), draft reads in `src/lib/data.ts`, the Analytics view and the
  dashboard welcome (custom views can render without the editor's layout, so
  they check for themselves). Any new custom admin view should do the same.
- Known gap (plugin): Payload's own folders, saved list filters and job
  collections are wrapped by payload-totp itself, which doesn't know MCP keys;
  the MCP tools don't use them.
- `src/users/TwoFactorRequired.tsx`: sends Banner 61 admins without it to
  `/admin/setup-totp`. `src/proxy.ts` passes the editor's path in `x-pathname`
  for this and for the plugin's own pages.
- `src/users/two-factor-reset.ts` + `TwoFactorReset.tsx`: the reset.
- `jobs.access.run` in `payload.config.ts` also refuses a session owing a code.
- Database: `users.totp_secret` and the plugin's `totp_attempts` table (wrong
  code count), migration `*_two_factor`.
- Tests: `scripts/two-factor.mjs` (CI runs it twice: optional mode, then with
  the server restarted with `B61_REQUIRE_ADMIN_2FA=true`).
- Any new collection or endpoint added in a plugin listed after `...twoFactor`
  would not be guarded: add new plugins before it.
