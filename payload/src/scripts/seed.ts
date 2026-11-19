import { getPayload } from 'payload'
import config from '@payload-config'
import { seedDemoSchools } from '../seed'
import { reindexSearch } from '../seo/reindex'
import { regenerateMissingSizes } from '../media/regenerate'
import { moveVideosToBunny } from '../video/moveToBunny'
import { addPageVideosToLibrary } from '../video/libraryBackfill'

/* Runs during the Vercel build, after migrations. Seeds the demo when SEED_DEMO=true. */
const payload = await getPayload({ config })
if (process.env.SEED_DEMO === 'true') await seedDemoSchools(payload)
await reindexSearch(payload)
// Photos uploaded before the current image sizes get them now (a batch per build).
await regenerateMissingSizes(payload).catch((e) => payload.logger.error(`[b61] Photo sizes: ${e.message}`))
// Videos belong on Bunny Stream: any still in the Photos library move there (once the Bunny keys are set).
await moveVideosToBunny(payload).catch((e) => payload.logger.error(`[b61] Videos to Bunny: ${e.message}`))
await addPageVideosToLibrary(payload).catch((e) => payload.logger.error(`[b61] Videos list: ${e.message}`))
process.exit(0)
