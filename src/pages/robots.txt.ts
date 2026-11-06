export function GET() {
  return new Response(
    [
      'User-agent: *',
      'Allow: /',
      '',
      'Sitemap: https://sunhuahai.github.io/sitemap.xml',
      '',
    ].join('\n'),
    { headers: { 'Content-Type': 'text/plain; charset=utf-8' } },
  );
}
