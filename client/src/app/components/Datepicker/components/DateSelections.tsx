import React, { useContext } from "react";
import {
  beginningDayOfWeek,
  daysInMonth,
  buttonClassName,
} from "../hooks/datepicker.utils";
import { monthNames, daysOfWeekNames } from "../hooks/dayMonth";
import { ChevronLeft, ChevronRight } from "react-feather";
import { useDatePickerStore } from "../../../stores/useDatePicker";

interface CalendarProps {
  style: React.CSSProperties;
  placement: string;
  ref: React.Ref<HTMLDivElement>;
}

const DateSelections: React.FC<CalendarProps> = React.forwardRef<
  HTMLDivElement,
  CalendarProps
>((props, ref) => {
  const { nextMonth, prevMonth, selectDate, visible, isSelectedDate } =
    useDatePickerStore();
  const { month, year } = visible!;
  const dates = [];

  for (let i = 0; i < beginningDayOfWeek(month, year); i++) {
    dates.push(<div key={`emptybefore${i}`}></div>);
  }

  for (let i = 1; i <= daysInMonth(month, year); i++) {
    dates.push(
      <button
        key={`day${i}`}
        className={`hover:bg-gray-200 rounded p-1 text-sm ${
          isSelectedDate(i) ? "bg-gray-300 font-semibold" : ""
        }`}
        onClick={() => selectDate(i)}
        style={{ textAlign: "center" }}
      >
        {i}
      </button>
    );
  }

  return (
    <div
      className="relative z-50 w-64 max-w-xs p-2 bg-white rounded-lg shadow-lg"
      ref={ref}
      data-placement={props.placement}
      style={props.style}
    >
      <div
        className="text-gray-800"
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr 1fr 1fr",
          gridTemplateRows: "2rem auto",
          alignItems: "stretch",
        }}
      >
        <button className={buttonClassName} onClick={(e) => prevMonth()}>
          <ChevronLeft size={20} className="stroke-current" />
        </button>

        <div
          className={`rounded p-1 text-sm flex align-center justify-center  font-semibold`}
          style={{ gridColumn: "2/5" }}
        >
          {monthNames[month]}
        </div>

        <div
          className={`rounded p-1 text-sm flex align-center justify-center  font-semibold`}
          style={{ gridColumn: "5/7" }}
        >
          {year}
        </div>

        <button className={buttonClassName} onClick={(e) => nextMonth()}>
          <ChevronRight size={20} className="stroke-current" />
        </button>

        {daysOfWeekNames.map((day) => (
          <div
            key={(200 + day).toString()}
            className="p-1 text-sm font-semibold"
            style={{ textAlign: "center" }}
          >
            {day[0]}
          </div>
        ))}

        {dates}
      </div>
    </div>
  );
});
export default DateSelections;
