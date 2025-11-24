"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toSafeInt = toSafeInt;
exports.isDateNotExpired = isDateNotExpired;
exports.getGuardState = getGuardState;
exports.toStringDate = toStringDate;
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
function isDateNotExpired(dateToCheck) {
    const formatDate = new Date().toLocaleDateString("en-CA", {
        timeZone: "America/Mexico_City",
    });
    const today = new Date(formatDate);
    today.setHours(0, 0, 0, 0);
    dateToCheck.setHours(0, 0, 0, 0);
    return dateToCheck.getTime() >= today.getTime();
}
function getGuardState(dateToCheck) {
    const formatDate = new Date().toLocaleDateString("en-CA", {
        timeZone: "America/Mexico_City",
    });
    const today = new Date(formatDate);
    today.setHours(0, 0, 0, 0);
    dateToCheck.setHours(0, 0, 0, 0);
    if (dateToCheck.getTime() > today.getTime())
        return "Nueva";
    if (dateToCheck.getTime() === today.getTime())
        return "En curso";
    else
        return "Cerrada";
}
function toStringDate(d) {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
}
