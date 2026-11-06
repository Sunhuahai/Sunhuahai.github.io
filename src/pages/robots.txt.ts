import { site } from '../config/site';

export function GET() {
  return new Response(
    [
      'User-agent: *',
      'Allow: /',
      '',
      `Sitemap: ${site.url}/sitemap.xml`,
      '',
    ].join('\n'),
    { headers: { 'Content-Type': 'text/plain; charset=utf-8' } },
  );
}
