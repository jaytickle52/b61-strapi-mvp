import type { Core } from '@strapi/strapi';
import { seedDemoSchool } from './seed';
import { secret } from '../config/secrets';

// Content types whose changes should refresh the website and parent feed.
const WATCHED_MODELS = [
  'api::page.page',
  'api::event.event',
  'api::news-post.news-post',
  'api::staff-member.staff-member',
  'api::program.program',
  'api::school-setting.school-setting',
];

let revalidateTimer: NodeJS.Timeout | null = null;

/** Tell the frontend to refresh. Debounced so a burst of saves sends one request. */
function scheduleRevalidate(strapi: Core.Strapi) {
  const url = process.env.FRONTEND_URL;
  if (!url) return;
  const revalidateSecret = secret('REVALIDATE_SECRET');
  if (revalidateTimer) clearTimeout(revalidateTimer);
  revalidateTimer = setTimeout(async () => {
    try {
      const res = await fetch(`${url.replace(/\/$/, '')}/api/revalidate`, {
        method: 'POST',
        headers: { 'x-revalidate-secret': revalidateSecret },
      });
      strapi.log.info(`[b61] frontend revalidate -> ${res.status}`);
    } catch (err) {
      strapi.log.warn(`[b61] frontend revalidate failed: ${(err as Error).message}`);
    }
  }, 1500);
}

/**
 * Make sure the read-only token the frontend uses exists, with the key from
 * FRONTEND_API_TOKEN. This lets every school instance be set up from env vars
 * alone, without anyone copying a token out of the admin panel.
 */
async function ensureFrontendToken(strapi: Core.Strapi) {
  const key = secret('FRONTEND_API_TOKEN');
  const tokenService = strapi.service('admin::api-token') as any;
  const hashed = tokenService.hash(key);
  const existing = await strapi.db.query('admin::api-token').findOne({ where: { name: 'Website (read-only)' } });
  if (existing) {
    if (existing.accessKey !== hashed) {
      await strapi.db.query('admin::api-token').update({ where: { id: existing.id }, data: { accessKey: hashed } });
      strapi.log.info('[b61] Rotated website API token to match FRONTEND_API_TOKEN.');
    }
    return;
  }
  const encryption = strapi.service('admin::encryption') as any;
  await strapi.db.query('admin::api-token').create({
    data: {
      name: 'Website (read-only)',
      description: 'Used by the school website and parent feed. Managed from env; do not delete.',
      kind: 'content-api',
      type: 'read-only',
      accessKey: hashed,
      encryptedKey: encryption?.encrypt ? encryption.encrypt(key) : null,
      lifespan: null,
      expiresAt: null,
    },
  });
  strapi.log.info('[b61] Created website API token.');
}

export default {
  register() {},

  async bootstrap({ strapi }: { strapi: Core.Strapi }) {
    await ensureFrontendToken(strapi);

    strapi.db.lifecycles.subscribe({
      models: WATCHED_MODELS,
      afterCreate: () => scheduleRevalidate(strapi),
      afterUpdate: () => scheduleRevalidate(strapi),
      afterDelete: () => scheduleRevalidate(strapi),
    });

    if (process.env.SEED_DEMO === 'true') {
      try {
        await seedDemoSchool(strapi, process.env.SEED_SCHOOL || 'cedar-ridge');
      } catch (err) {
        strapi.log.error(`[b61] Demo seed failed: ${(err as Error).message}`);
      }
    }
  },
};
