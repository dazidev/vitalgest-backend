"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ACCESS_COOKIE_NAME = void 0;
exports.setAccessCookie = setAccessCookie;
exports.clearAccessCookie = clearAccessCookie;
const isProd = process.env.NODE_ENV === 'production';
const isCrossSite = process.env.CROSS_SITE === 'true';
exports.ACCESS_COOKIE_NAME = isProd ? '__Host-access' : 'access_token';
function setAccessCookie(res, token) {
    const opts = {
        httpOnly: true,
        secure: isProd || isCrossSite,
        sameSite: (isCrossSite ? 'none' : 'lax'),
        path: exports.ACCESS_COOKIE_NAME.startsWith('__Host-') ? '/' : '/',
        maxAge: 2 * 60 * 60 * 1000, // 2 horas
        signed: false,
    };
    if (!exports.ACCESS_COOKIE_NAME.startsWith('__Host-') && process.env.COOKIE_DOMAIN) {
        opts.domain = process.env.COOKIE_DOMAIN;
    }
    res.cookie(exports.ACCESS_COOKIE_NAME, token, opts);
}
function clearAccessCookie(res) {
    const opts = {
        httpOnly: true,
        secure: isProd || isCrossSite,
        sameSite: (isCrossSite ? 'none' : 'lax'),
        path: exports.ACCESS_COOKIE_NAME.startsWith('__Host-') ? '/' : '/',
        signed: true,
    };
    if (!exports.ACCESS_COOKIE_NAME.startsWith('__Host-') && process.env.COOKIE_DOMAIN) {
        opts.domain = process.env.COOKIE_DOMAIN;
    }
    res.clearCookie(exports.ACCESS_COOKIE_NAME, opts);
}
