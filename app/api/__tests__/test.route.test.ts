import * as testRoute from '../../test/route';

describe('app/test GET', () => {
  it('returns ok and message', async () => {
    const res = await testRoute.GET();
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.status).toBe('ok');
    expect(body.message).toMatch(/Test endpoint working/);
  });
});


