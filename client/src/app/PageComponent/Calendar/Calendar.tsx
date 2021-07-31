import React from "react";
import { useCalendar } from "./hooks/useCalendar";
import DateBox from "./components/DateBox";

const Calendar = () => {
  const { monthYear, updateMonthYear } = useCalendar();
  return (
    <div className="">
      <div className="flex flex-row justify-between my-10 ">
        <button
          className="flex items-center justify-center p-1 pr-2 text-3xl rounded-full text-dark-txt hover:bg-dark-third"
          aria-label="previous month"
          onClick={() => updateMonthYear(-1)}
        >
          <i className="bx bx-left-arrow"></i>
        </button>
        <div className="text-3xl text-dark-txt">
          {monthYear.monthName} {monthYear.year}
        </div>
        <button
          className="flex items-center justify-center p-1 pl-2 text-3xl rounded-full text-dark-txt hover:bg-dark-third"
          aria-label="next month"
          onClick={() => updateMonthYear(1)}
        >
          <i className="bx bx-right-arrow"></i>
        </button>
      </div>

      <div className="grid gap-4 mx-1 my-2 grid-cols-calendar">
        {/* first day needs a grid column */}
        <DateBox date={1} gridColumn={monthYear.firstDOW + 1} />
        {/* the rest of the days will follow */}
        {[...Array(monthYear.lastDate)].map((_, i) =>
          i > 0 ? <DateBox key={i} date={i + 1} /> : null
        )}
      </div>
    </div>
  );
};

export default Calendar;
