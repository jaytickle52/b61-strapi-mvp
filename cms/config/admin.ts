import type { Core } from '@strapi/strapi';

const config = ({ env }: Core.Config.Shared.ConfigParams): Core.Config.Admin => ({
  auth: {
    secret: env('ADMIN_JWT_SECRET')!,
  },
  apiToken: {
    salt: env('API_TOKEN_SALT')!,
  },
  transfer: {
    token: {
      salt: env('TRANSFER_TOKEN_SALT')!,
    },
  },
  secrets: {
    encryptionKey: env('ENCRYPTION_KEY')!,
  },
  flags: {
    nps: env.bool('FLAG_NPS', false),
    promoteEE: env.bool('FLAG_PROMOTE_EE', false),
    docLinks: env.bool('FLAG_DOC_LINKS', true),
  },
  // Free (Community) Preview: editors open the saved draft on the real website.
  preview: {
    enabled: Boolean(env('FRONTEND_URL')),
    config: {
      allowedOrigins: [env('FRONTEND_URL', '')].filter(Boolean),
      async handler(uid: string, { documentId, status }: { documentId: string; status?: string }) {
        const base = env('FRONTEND_URL', '').replace(/\/$/, '');
        const secret = env('PREVIEW_SECRET', '');
        const doc: any = await strapi.documents(uid as any).findOne({ documentId, status: 'draft' as any });
        const slug = doc?.slug;
        const paths: Record<string, string | null> = {
          'api::page.page': slug ? (slug === 'home' ? '/' : `/${slug}`) : null,
          'api::event.event': slug ? `/events/${slug}` : '/events',
          'api::news-post.news-post': slug ? `/news/${slug}` : '/news',
          'api::program.program': slug ? `/programs/${slug}` : '/programs',
          'api::staff-member.staff-member': '/staff',
          'api::school-setting.school-setting': '/',
        };
        const path = paths[uid];
        if (!path) return null;
        const params = new URLSearchParams({ secret, path, status: status ?? 'draft' });
        return `${base}/api/preview?${params.toString()}`;
      },
    },
  },
});

export default config;
