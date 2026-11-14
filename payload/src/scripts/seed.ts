import { getPayload } from 'payload'
import config from '@payload-config'
import { seedDemoSchools } from '../seed'
import { reindexSearch } from '../seo/reindex'

/* Run during the Vercel build (after migrations). Seeds the demo when SEED_DEMO=true. */
const payload = await getPayload({ config })
if (process.env.SEED_DEMO === 'true') await seedDemoSchools(payload)
await reindexSearch(payload)
process.exit(0)
