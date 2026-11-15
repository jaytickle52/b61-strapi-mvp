/*
 * Crawlers that only collect text to train AI models. Turned away when a school
 * switches off "Let AI companies learn from this site". The crawlers that put a
 * school in AI answers (OAI-SearchBot, ChatGPT-User, Claude-SearchBot,
 * Claude-User, PerplexityBot) and Google-Extended (which also feeds Gemini's
 * answers) are left alone, so the school stays findable and citable.
 */
export const AI_TRAINING_BOTS = ['GPTBot', 'ClaudeBot', 'CCBot', 'Applebot-Extended', 'Bytespider', 'meta-externalagent', 'cohere-training-data-crawler']
