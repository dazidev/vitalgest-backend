export function toSafeInt(n: unknown, def = 1, min = 1, max = 1000) {
  let v = Number(n);
  if (!Number.isFinite(v)) v = def;
  v = Math.floor(v);
  if (v < min) v = min;
  if (v > max) v = max;
  return v;
}