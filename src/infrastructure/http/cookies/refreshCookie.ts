import type { Response, CookieOptions } from "express";

const isProd = process.env.NODE_ENV === "production";
const isCrossSite = process.env.CROSS_SITE === "true";

export const REFRESH_COOKIE_NAME = isProd ? "__Host-refresh" : "refresh_token";

export function setRefreshCookie(res: Response, token: string) {
  const opts: CookieOptions = {
    httpOnly: true,
    secure: isProd || isCrossSite,
    sameSite: isCrossSite ? "none" : "lax",
    path: REFRESH_COOKIE_NAME.startsWith("__Host-") ? "/" : "/",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 dias
    signed: true,
  };

  if (!REFRESH_COOKIE_NAME.startsWith("__Host-") && process.env.COOKIE_DOMAIN) {
    opts.domain = process.env.COOKIE_DOMAIN;
  }

  res.cookie(REFRESH_COOKIE_NAME, token, opts);
}

export function clearRefreshCookie(res: Response) {
  const opts: CookieOptions = {
    httpOnly: true,
    secure: isProd || isCrossSite,
    sameSite: isCrossSite ? "none" : "lax",
    path: REFRESH_COOKIE_NAME.startsWith("__Host-") ? "/" : "/",
    signed: true,
  };

  if (!REFRESH_COOKIE_NAME.startsWith("__Host-") && process.env.COOKIE_DOMAIN) {
    opts.domain = process.env.COOKIE_DOMAIN;
  }

  res.clearCookie(REFRESH_COOKIE_NAME, opts);
}
