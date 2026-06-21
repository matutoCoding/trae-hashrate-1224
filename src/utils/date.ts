import dayjs from 'dayjs';
import weekday from 'dayjs/plugin/weekday';

dayjs.extend(weekday);

export const WEEKDAY_NAMES = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];

export const TIME_PERIODS = [
  { key: 'morning', label: '上午 (9:00-12:00)' },
  { key: 'afternoon', label: '下午 (14:00-17:00)' },
  { key: 'evening', label: '晚上 (18:30-21:30)' },
  { key: 'weekend', label: '周末全天' }
];

export const formatDate = (date: string | Date, format = 'YYYY-MM-DD'): string => {
  return dayjs(date).format(format);
};

export const formatDateTime = (date: string | Date, format = 'YYYY-MM-DD HH:mm'): string => {
  return dayjs(date).format(format);
};

export const getWeekday = (date: string | Date): number => {
  const d = dayjs(date);
  return (d.day() + 6) % 7;
};

export const getWeekdayName = (date: string | Date): string => {
  return WEEKDAY_NAMES[getWeekday(date)];
};

export const generateWeekDates = (baseDate: string | Date, weeks: number): string[] => {
  const dates: string[] = [];
  const start = dayjs(baseDate);
  for (let i = 0; i < weeks * 7; i++) {
    dates.push(start.add(i, 'day').format('YYYY-MM-DD'));
  }
  return dates;
};

export const generateScheduleDates = (
  startDate: string,
  weekdays: number[],
  weeksCount: number
): string[] => {
  const dates: string[] = [];
  const start = dayjs(startDate);
  const totalDays = weeksCount * 7;

  for (let i = 0; i < totalDays; i++) {
    const current = start.add(i, 'day');
    const wd = (current.day() + 6) % 7;
    if (weekdays.includes(wd)) {
      dates.push(current.format('YYYY-MM-DD'));
    }
  }
  return dates;
};

export const isSameDay = (d1: string | Date, d2: string | Date): boolean => {
  return dayjs(d1).isSame(d2, 'day');
};

export const getRelativeTime = (date: string | Date): string => {
  const now = dayjs();
  const target = dayjs(date);
  const diffDays = target.diff(now, 'day');

  if (diffDays === 0) return '今天';
  if (diffDays === 1) return '明天';
  if (diffDays === -1) return '昨天';
  if (diffDays > 0 && diffDays < 7) return `${diffDays}天后`;
  if (diffDays < 0 && diffDays > -7) return `${Math.abs(diffDays)}天前`;
  return target.format('MM-DD');
};

export const formatDuration = (startTime: string, endTime: string): string => {
  const [sh, sm] = startTime.split(':').map(Number);
  const [eh, em] = endTime.split(':').map(Number);
  const startMins = sh * 60 + sm;
  const endMins = eh * 60 + em;
  const diffMins = endMins - startMins;
  const hours = Math.floor(diffMins / 60);
  const mins = diffMins % 60;
  if (mins === 0) return `${hours}小时`;
  return `${hours}小时${mins}分钟`;
};
