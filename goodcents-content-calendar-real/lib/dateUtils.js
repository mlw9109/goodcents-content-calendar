export function toISO(date) {
  return date.toISOString().slice(0, 10);
}

export function parseDate(value) {
  const [y, m, d] = value.split('-').map(Number);
  return new Date(y, m - 1, d);
}

export function daysBetween(dateString, base = new Date()) {
  const a = parseDate(dateString);
  const b = new Date(base.getFullYear(), base.getMonth(), base.getDate());
  return Math.round((a - b) / 86400000);
}

export function prettyDate(dateString) {
  return parseDate(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export function monthName(date) {
  return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
}

export function currentMonthDays(date) {
  const year = date.getFullYear();
  const month = date.getMonth();
  const first = new Date(year, month, 1);
  const last = new Date(year, month + 1, 0);
  const blanks = first.getDay();
  const days = [];
  for (let i = 0; i < blanks; i++) days.push(null);
  for (let d = 1; d <= last.getDate(); d++) days.push(new Date(year, month, d));
  while (days.length % 7 !== 0) days.push(null);
  return days;
}
