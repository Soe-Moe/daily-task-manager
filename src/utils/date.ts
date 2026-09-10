import { DueOption } from '@/types/todo';

export const DUE_OPTION_LABELS: Record<DueOption, string> = {
  none: 'No date',
  today: 'Today',
  tomorrow: 'Tomorrow',
  weekend: 'This weekend',
  next_week: 'Next week',
};

const startOfDay = (date: Date): Date =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate());

export const resolveDueDate = (option: DueOption): string | null => {
  const base = startOfDay(new Date());

  switch (option) {
    case 'none':
      return null;
    case 'today':
      return base.toISOString();
    case 'tomorrow':
      base.setDate(base.getDate() + 1);
      return base.toISOString();
    case 'weekend': {
      const day = base.getDay();
      const daysUntilSaturday = ((6 - day) % 7) || 7;
      base.setDate(base.getDate() + daysUntilSaturday);
      return base.toISOString();
    }
    case 'next_week':
      base.setDate(base.getDate() + 7);
      return base.toISOString();
    default:
      return null;
  }
};

const isSameDay = (a: Date, b: Date): boolean =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

export const isSameDueDate = (a: string | null, b: string | null): boolean => {
  if (a === null || b === null) return a === b;
  return isSameDay(new Date(a), new Date(b));
};

export const isToday = (isoDate: string | null): boolean => {
  if (!isoDate) return false;
  return isSameDay(new Date(isoDate), new Date());
};

export const isOverdue = (isoDate: string | null, completed: boolean): boolean => {
  if (!isoDate || completed) return false;
  return startOfDay(new Date(isoDate)) < startOfDay(new Date());
};

export const formatDueLabel = (isoDate: string | null): string | null => {
  if (!isoDate) return null;

  const date = new Date(isoDate);
  const today = startOfDay(new Date());
  const target = startOfDay(date);
  const diffDays = Math.round((target.getTime() - today.getTime()) / 86_400_000);

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Tomorrow';
  if (diffDays === -1) return 'Yesterday';

  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
};

export const getGreeting = (): string => {
  const hour = new Date().getHours();
  if (hour < 5) return 'Good night';
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  if (hour < 21) return 'Good evening';
  return 'Good night';
};

export const formatHeaderDate = (): string =>
  new Date().toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });
