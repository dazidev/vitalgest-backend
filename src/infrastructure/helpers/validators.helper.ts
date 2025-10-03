
export function toSafeInt(n: unknown, def = 1, min = 1, max = 1000){
  let v = Number(n);
  if (!Number.isFinite(v)) v = def;
  v = Math.floor(v);
  if (v < min) v = min;
  if (v > max) v = max;
  return v;
}

export function isDateNotExpired(dateToCheck: Date): boolean {
  const formatDate = new Date().toLocaleDateString('en-CA', {timeZone: 'America/Mexico_City'});
  const today = new Date(formatDate)

  today.setHours(0, 0, 0, 0);
  dateToCheck.setHours(0, 0, 0, 0);

  return dateToCheck.getTime() >= today.getTime();
}

export function getGuardState(dateToCheck: Date): 'En curso' | 'Nueva' | 'Cerrada'  {
  const formatDate = new Date().toLocaleDateString('en-CA', {timeZone: 'America/Mexico_City'});
  const today = new Date(formatDate)

  today.setHours(0, 0, 0, 0);
  dateToCheck.setHours(0, 0, 0, 0);

  if (dateToCheck.getTime() > today.getTime()) return 'Nueva'
  if (dateToCheck.getTime() === today.getTime()) return 'En curso'
  else return 'Cerrada'
}

export function toStringDate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};