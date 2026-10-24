import { MetadataRoute } from 'next';

// AI-training and SEO-tool crawlers: they bring no visitors but render thousands of pages
const BLOCKED_BOTS = [
  'GPTBot', 'ClaudeBot', 'anthropic-ai', 'CCBot', 'Bytespider', 'Amazonbot',
  'meta-externalagent', 'FacebookBot', 'cohere-ai', 'Diffbot', 'ImagesiftBot',
  'AhrefsBot', 'SemrushBot', 'MJ12bot', 'DotBot', 'PetalBot', 'DataForSeoBot', 'BLEXBot',
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: BLOCKED_BOTS, disallow: '/' },
      // /api/og stays crawlable: pages reference it as og:image (needed for Discover);
      // responses are CDN-cached, so crawling it is cheap
      { userAgent: '*', allow: ['/', '/api/og'], disallow: ['/api/'] },
    ],
    sitemap: 'https://www.ruyo.uz/sitemap.xml',
  };
}
