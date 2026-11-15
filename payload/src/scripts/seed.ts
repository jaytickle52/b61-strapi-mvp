import { getPayload } from 'payload'
import config from '@payload-config'
import { seedDemoSchools } from '../seed'
import { reindexSearch } from '../seo/reindex'
import { regenerateMissingSizes } from '../media/regenerate'

/* Runs during the Vercel build, after migrations. Seeds the demo when SEED_DEMO=true. */
const payload = await getPayload({ config })
if (process.env.SEED_DEMO === 'true') await seedDemoSchools(payload)
await reindexSearch(payload)
// Photos uploaded before the current image sizes get them now (a batch per build).
await regenerateMissingSizes(payload).catch((e) => payload.logger.error(`[b61] Photo sizes: ${e.message}`))
process.exit(0)
