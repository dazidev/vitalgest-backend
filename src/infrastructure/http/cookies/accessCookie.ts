
import type { Response, CookieOptions } from 'express';

const isProd = process.env.NODE_ENV === 'production';
const isCrossSite = process.env.CROSS_SITE === 'true';

export const ACCESS_COOKIE_NAME =
  isProd ? '__Host-access' : 'access_token';

export function setAccessCookie(res: Response, token: string) {
  const opts: CookieOptions = {
    httpOnly: true,
    secure: isProd || isCrossSite,
    sameSite: (isCrossSite ? 'none' : 'lax'),
    path: ACCESS_COOKIE_NAME.startsWith('__Host-') ? '/' : '/',
    maxAge: 2 * 60 * 60 * 1000, // 2 horas
    signed: false,
  };


  if (!ACCESS_COOKIE_NAME.startsWith('__Host-') && process.env.COOKIE_DOMAIN) {
    opts.domain = process.env.COOKIE_DOMAIN;
  }

  res.cookie(ACCESS_COOKIE_NAME, token, opts);
}

export function clearAccessCookie(res: Response) {
  const opts: CookieOptions = {
    httpOnly: true,
    secure: isProd || isCrossSite,
    sameSite: (isCrossSite ? 'none' : 'lax'),
    path: ACCESS_COOKIE_NAME.startsWith('__Host-') ? '/' : '/',
    signed: true,
  };

  if (!ACCESS_COOKIE_NAME.startsWith('__Host-') && process.env.COOKIE_DOMAIN) {
    opts.domain = process.env.COOKIE_DOMAIN;
  }

  res.clearCookie(ACCESS_COOKIE_NAME, opts);
}

