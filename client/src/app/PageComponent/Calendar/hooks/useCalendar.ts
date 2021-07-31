import dayjs from "dayjs";
import { useState } from "react";
import { getMonthYearDetails, getNewMonthYear, MonthYear } from "./monthYear";

interface UseCalendar {
  monthYear: MonthYear;
  updateMonthYear: (monthIncrement: number) => void;
}

const useCalendar = (): UseCalendar => {
  const currentMonthYear = getMonthYearDetails(dayjs());

  const [monthYear, setMonthYear] = useState(currentMonthYear);

  function updateMonthYear(monthIncrement: number): void {
    setMonthYear((prevData) => getNewMonthYear(prevData, monthIncrement));
  }

  return { monthYear, updateMonthYear };
};

export { useCalendar };
