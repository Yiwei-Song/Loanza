import type { Lang } from '../types';

/** Fixed "today" so the prototype's closing-soon / closed states stay believable. */
export const TODAY = new Date('2026-06-11T08:00:00');

const DAY_MS = 24 * 60 * 60 * 1000;

export function parseDate(iso: string): Date {
  return new Date(`${iso}T00:00:00`);
}

export function daysUntil(iso: string): number {
  const target = parseDate(iso);
  const today = new Date(TODAY.getFullYear(), TODAY.getMonth(), TODAY.getDate());
  return Math.round((target.getTime() - today.getTime()) / DAY_MS);
}

export function isPast(iso: string): boolean {
  return daysUntil(iso) < 0;
}

export function isClosingSoon(iso: string | undefined): boolean {
  if (!iso) return false;
  const d = daysUntil(iso);
  return d >= 0 && d <= 7;
}

/** Open = rolling (no deadline) or deadline today/future. */
export function isOpen(deadline: string | undefined): boolean {
  if (!deadline) return true;
  return daysUntil(deadline) >= 0;
}

const MONTHS_EN = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const MONTHS_EN_FULL = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export function formatDate(iso: string, lang: Lang, opts?: { short?: boolean }): string {
  const d = parseDate(iso);
  if (lang === 'zh') {
    return `${d.getFullYear()} 年 ${d.getMonth() + 1} 月 ${d.getDate()} 日`;
  }
  const month = opts?.short ? MONTHS_EN[d.getMonth()] : MONTHS_EN_FULL[d.getMonth()];
  return `${month} ${d.getDate()}, ${d.getFullYear()}`;
}

export function formatMonth(ym: string, lang: Lang): string {
  const [y, m] = ym.split('-').map(Number);
  if (lang === 'zh') return `${y} 年 ${m} 月`;
  return `${MONTHS_EN[m - 1]} ${y}`;
}

export function formatDateRange(start: string | undefined, end: string | undefined, lang: Lang): string {
  if (!start) return lang === 'zh' ? '待定' : 'TBA';
  const s = formatDate(start, lang, { short: true });
  if (!end) return s;
  return `${s} – ${formatDate(end, lang, { short: true })}`;
}

/** 'YYYY-MM' for a date string. */
export function monthOf(iso: string): string {
  return iso.slice(0, 7);
}

/** Build an inclusive list of 'YYYY-MM' between two bounds. */
export function monthRange(from: string, to: string): string[] {
  const out: string[] = [];
  let [y, m] = from.split('-').map(Number);
  const [ey, em] = to.split('-').map(Number);
  while (y < ey || (y === ey && m <= em)) {
    out.push(`${y}-${String(m).padStart(2, '0')}`);
    m += 1;
    if (m > 12) {
      m = 1;
      y += 1;
    }
  }
  return out;
}

export function compareMonth(a: string, b: string): number {
  return a.localeCompare(b);
}
