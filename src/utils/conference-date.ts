/**
 * Conference dates stay a single string: YYYY, YYYY-MM, YYYY-MM-DD, or an
 * inclusive range YYYY-MM-DD/YYYY-MM-DD. Year and year-month values keep their
 * existing text. Day values render as an English calendar date.
 */
const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
] as const;

export interface ConferenceDateText {
  /** Compact label for the narrow index column. */
  index: string;
  /** Full label used in the venue line. */
  label: string;
}

function isYmd(value: string): boolean {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return false;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(Date.UTC(year, month - 1, day));
  return (
    date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day
  );
}

function formatDay(value: string): string {
  const [, year, month, day] = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value)!;
  return `${MONTHS[Number(month) - 1]} ${Number(day)}, ${year}`;
}

export function parseConferenceDate(date: string): ConferenceDateText | null {
  if (/^\d{4}$/.test(date)) return { index: date, label: date };
  if (/^\d{4}-\d{2}$/.test(date)) {
    const month = Number(date.slice(5, 7));
    if (month < 1 || month > 12) return null;
    return { index: date, label: date };
  }
  if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    if (!isYmd(date)) return null;
    return { index: date.slice(0, 7), label: formatDay(date) };
  }
  const range = /^(\d{4}-\d{2}-\d{2})\/(\d{4}-\d{2}-\d{2})$/.exec(date);
  if (!range || !isYmd(range[1]) || !isYmd(range[2]) || range[1] > range[2]) return null;
  const [startYear, startMonth] = range[1].split('-');
  const [endYear, endMonth, endDay] = range[2].split('-');
  if (startYear === endYear && startMonth === endMonth) {
    const [, , startDay] = range[1].split('-');
    return {
      index: `${startYear}-${startMonth}`,
      label: `${MONTHS[Number(startMonth) - 1]} ${Number(startDay)}–${Number(endDay)}, ${startYear}`,
    };
  }
  return {
    index: `${startYear}-${startMonth}`,
    label: `${formatDay(range[1])}–${formatDay(range[2])}`,
  };
}
