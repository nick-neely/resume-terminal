import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Calculates the total duration for a set of jobs at the same company.
 * @param jobs Array of experience objects for the same company
 * @param now Current date reference (for "Present")
 * @returns A formatted duration string
 */
export function getCompanyDuration(
  jobs: { startDate: string; endDate: string }[],
  now: Date = new Date()
): string {
  if (!jobs.length) return '';

  // More reliable date parsing
  const parseDate = (dateStr: string): Date => {
    if (dateStr.toLowerCase() === 'present') {
      return now;
    }

    // Handle formats like "September 2015"
    const parts = dateStr.split(' ');
    if (parts.length === 2) {
      const monthNames = [
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
      ];
      const monthIndex = monthNames.findIndex((m) => m.toLowerCase() === parts[0].toLowerCase());
      const year = parseInt(parts[1]);
      if (monthIndex !== -1 && !isNaN(year)) {
        return new Date(year, monthIndex, 1);
      }
    }

    // Fallback for other formats
    return new Date(dateStr);
  };

  // Find earliest start and latest end
  let earliest = parseDate(jobs[0].startDate);
  let latest = parseDate(jobs[0].endDate);

  for (const job of jobs) {
    const start = parseDate(job.startDate);
    const end = parseDate(job.endDate);

    if (start < earliest) {
      earliest = start;
    }

    if (end > latest) {
      latest = end;
    }
  }

  // Calculate months between dates
  const months =
    (latest.getFullYear() - earliest.getFullYear()) * 12 +
    (latest.getMonth() - earliest.getMonth());

  const years = Math.floor(months / 12);
  const remMonths = months % 12;

  let result = '';
  if (years > 0) result += `${years} yr${years > 1 ? 's' : ''}`;
  if (remMonths > 0) {
    result += (result ? ' ' : '') + `${remMonths} mo${remMonths > 1 ? 's' : ''}`;
  }
  if (!result) result = '< 1 mo';

  return result;
}
