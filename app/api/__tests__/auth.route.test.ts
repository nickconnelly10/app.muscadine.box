import { NextRequest } from 'next/server';
import * as authRoute from '../auth/route';

vi.mock('@farcaster/quick-auth', () => {
  const verifyMock = vi.fn(async ({ token, domain }: { token: string; domain: string }) => ({ sub: 123, token, domain }));
  class InvalidTokenError extends Error {}
  return {
    Errors: { InvalidTokenError },
    createClient: () => ({ verifyJwt: verifyMock }),
    __mocks: { verifyMock },
  };
});

const makeRequest = (headers: Record<string, string>) =>
  new NextRequest('http://localhost/api/auth', { headers: new Headers(headers) });

describe('api/auth GET', () => {
  it('returns 401 when missing token', async () => {
    const req = makeRequest({});
    const res = await authRoute.GET(req as NextRequest);
    expect(res.status).toBe(401);
  });

  it('returns 200 with userFid when token is valid', async () => {
    const req = makeRequest({ Authorization: 'Bearer valid' });
    const res = await authRoute.GET(req as NextRequest);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.userFid).toBe(123);
  });

  it('returns 401 on invalid token', async () => {
    const { __mocks, Errors } = await import('@farcaster/quick-auth');
    (__mocks.verifyMock as vi.MockedFunction<unknown>).mockRejectedValueOnce(new (Errors as { InvalidTokenError: typeof Error }).InvalidTokenError('bad'));
    const req = makeRequest({ Authorization: 'Bearer invalid' });
    const res = await authRoute.GET(req as NextRequest);
    expect(res.status).toBe(401);
  });
});


