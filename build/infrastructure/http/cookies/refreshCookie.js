"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.REFRESH_COOKIE_NAME = void 0;
exports.setRefreshCookie = setRefreshCookie;
exports.clearRefreshCookie = clearRefreshCookie;
const isProd = process.env.NODE_ENV === 'production';
const isCrossSite = process.env.CROSS_SITE === 'true';
exports.REFRESH_COOKIE_NAME = isProd ? '__Host-refresh' : 'refresh_token';
function setRefreshCookie(res, token) {
    const opts = {
        httpOnly: true,
        secure: isProd || isCrossSite,
        sameSite: (isCrossSite ? 'none' : 'lax'),
        path: exports.REFRESH_COOKIE_NAME.startsWith('__Host-') ? '/' : '/',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 dias
        signed: true,
    };
    if (!exports.REFRESH_COOKIE_NAME.startsWith('__Host-') && process.env.COOKIE_DOMAIN) {
        opts.domain = process.env.COOKIE_DOMAIN;
    }
    res.cookie(exports.REFRESH_COOKIE_NAME, token, opts);
}
function clearRefreshCookie(res) {
    const opts = {
        httpOnly: true,
        secure: isProd || isCrossSite,
        sameSite: (isCrossSite ? 'none' : 'lax'),
        path: exports.REFRESH_COOKIE_NAME.startsWith('__Host-') ? '/' : '/',
        signed: true,
    };
    if (!exports.REFRESH_COOKIE_NAME.startsWith('__Host-') && process.env.COOKIE_DOMAIN) {
        opts.domain = process.env.COOKIE_DOMAIN;
    }
    res.clearCookie(exports.REFRESH_COOKIE_NAME, opts);
}
