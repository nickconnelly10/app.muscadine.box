import * as farcasterRoute from '../farcaster/route';

vi.mock('../../../minikit.config', () => ({
  minikitConfig: {
    frame: {
      name: 'TestApp', subtitle: 'Sub', description: 'Desc', screenshotUrls: [], iconUrl: '', splashImageUrl: '', splashBackgroundColor: '#fff', homeUrl: 'https://x', webhookUrl: 'https://x/hook', primaryCategory: 'defi', tags: [], heroImageUrl: '', tagline: '', ogTitle: '', ogDescription: '', ogImageUrl: '', version: '1'
    },
    baseBuilder: { a: 1 },
  },
}));

describe('api/farcaster GET', () => {
  it('returns manifest json and cache headers', async () => {
    const res = await farcasterRoute.GET();
    expect(res.status).toBe(200);
    expect(res.headers.get('Content-Type')).toMatch(/application\/json/);
    expect(res.headers.get('Cache-Control')).toBe('public, max-age=3600');
    const body = await res.json();
    expect(body.name).toBe('TestApp');
    expect(body.frame?.name).toBe('TestApp');
  });
});


