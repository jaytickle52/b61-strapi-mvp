import type { Core } from '@strapi/strapi';

const config = ({ env }: Core.Config.Shared.ConfigParams): Core.Config.Middlewares => {
  const frontend = env('FRONTEND_URL', '');
  return [
    'strapi::logger',
    'strapi::errors',
    {
      name: 'strapi::security',
      config: {
        contentSecurityPolicy: {
          useDefaults: true,
          directives: {
            // Let the admin panel show the website inside its Preview panel.
            'frame-src': ["'self'", ...(frontend ? [frontend] : [])],
            'img-src': ["'self'", 'data:', 'blob:', 'market-assets.strapi.io'],
            'media-src': ["'self'", 'data:', 'blob:'],
          },
        },
      },
    },
    'strapi::cors',
    'strapi::poweredBy',
    'strapi::query',
    'strapi::body',
    'strapi::session',
    'strapi::favicon',
    'strapi::public',
  ];
};

export default config;
