import dayjs from "dayjs";

export interface MonthYear {
  startDate: dayjs.Dayjs; // first day of the month
  firstDOW: number; // day of week; 0 === Sunday
  lastDate: number; // last date of the month
  monthName: string; // name of the month
  month: string; // two digit month number
  year: string; // four digit year
}

// for incrementing MonthYear
export const getUpdatedMonthYear = (
  monthYear: MonthYear,
  monthIncrement: number
): dayjs.Dayjs => {
  // to prevent mutation
  return monthYear.startDate.clone().add(monthIncrement, "months");
};

export const getMonthYearDetails = (initialDate: dayjs.Dayjs): MonthYear => {
  const month = initialDate.format("MM");
  const year = initialDate.format("YYYY");
  const startDate = dayjs(`${year}${month}01`);
  const firstDOW = Number(startDate.format("d"));
  const lastDate = Number(startDate.clone().endOf("month").format("DD"));
  const monthName = startDate.format("MMMM");
  return { startDate, firstDOW, lastDate, monthName, month, year };
};

export function getNewMonthYear(
  prevData: MonthYear,
  monthIncrement: number
): MonthYear {
  const newMonthYear = getUpdatedMonthYear(prevData, monthIncrement);

  return getMonthYearDetails(newMonthYear);
}
