"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toSafeInt = toSafeInt;
function toSafeInt(n, def = 1, min = 1, max = 1000) {
    let v = Number(n);
    if (!Number.isFinite(v))
        v = def;
    v = Math.floor(v);
    if (v < min)
        v = min;
    if (v > max)
        v = max;
    return v;
}
