import { getPayload } from 'payload'
import config from '@payload-config'
import { seedDemoSchools } from '../seed'

/* Run during the Vercel build (after migrations) when SEED_DEMO=true. */
const payload = await getPayload({ config })
if (process.env.SEED_DEMO === 'true') await seedDemoSchools(payload)
process.exit(0)
