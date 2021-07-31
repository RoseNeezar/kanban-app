import { monthNames } from "./dayMonth";

export const buttonClassName =
  "hover:bg-gray-200 rounded p-1 text-sm flex align-center justify-center focus:outline-none";

/**
 * For formatting date
 * @param date
 */
export const formattedDate = (date: Date): string => {
  return `${date.getDate()} ${
    monthNames[date.getMonth()]
  } ${date.getFullYear()}`;
};

/**
 * Beginning of Day of Week of a Month
 * @param date
 */
export const beginningDayOfWeek = (m: number, y: number): number => {
  return new Date(y, m, 1).getDay();
};

/**
 * Days in month
 */
export const daysInMonth = (month: number, year: number) => {
  switch (month) {
    case 0:
    case 2:
    case 4:
    case 6:
    case 7:
    case 9:
    case 11:
      return 31;
    case 1:
      return isLeapYear(year) ? 29 : 28;
    default:
      return 30;
  }
};

/**
 * Is Leap Year
 * @param year
 */
export const isLeapYear = (year: number): boolean => {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
};
