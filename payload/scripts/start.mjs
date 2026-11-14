// Starts the production site. Railway stops the old copy with SIGTERM on every
// redeploy; this makes that a clean exit (0) so it isn't reported as a crash.
import { spawn } from 'node:child_process'

const child = spawn(process.execPath, ['node_modules/next/dist/bin/next', 'start', '-p', process.env.PORT || '3000'], {
  stdio: 'inherit',
  env: { ...process.env, NODE_OPTIONS: '--no-deprecation' },
})
let stopping = false
for (const sig of ['SIGTERM', 'SIGINT']) {
  process.on(sig, () => {
    stopping = true
    child.kill(sig)
  })
}
child.on('exit', (code) => process.exit(stopping ? 0 : (code ?? 1)))
