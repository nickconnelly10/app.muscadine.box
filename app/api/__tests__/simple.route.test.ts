import * as simpleRoute from '../../simple/route';

describe('app/simple GET', () => {
  it('returns message and timestamp', async () => {
    const res = await simpleRoute.GET();
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.message).toMatch(/Simple test working/);
    expect(typeof body.timestamp).toBe('string');
  });
});


