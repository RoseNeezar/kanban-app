import { Portal } from "react-portal";
import React, { FC, useEffect, useRef, useState } from "react";
import { Calendar as CalendarIcon } from "react-feather";
import { Manager, Popper, Reference } from "react-popper";
import { useDatePickerStore } from "../../../stores/useDatePicker";
import { formattedDate } from "../hooks/datepicker.utils";
import DateSelections from "./DateSelections";

export const inputStyle = {
  paddingTop: "0.375rem",
  paddingBottom: "0.375rem",
};

const CalendarPicker: FC = () => {
  const popupNode = useRef<HTMLElement>();

  const {
    setVisible,
    setMonthYear,
    isVisible,
    showCalendar,
    toggleCalendar,
    userAddDAte,
    date: newDate,
  } = useDatePickerStore();

  useEffect(() => {
    const mouseDownListener = (e: MouseEvent) => {
      if (popupNode.current && !popupNode.current.contains(e.target as Node)) {
        setVisible(false);
      }
    };

    if (isVisible) {
      setMonthYear({ month: newDate.getMonth(), year: newDate.getFullYear() });
      document.addEventListener("mousedown", mouseDownListener);
    }

    return () => {
      document.removeEventListener("mousedown", mouseDownListener);
    };
  }, [isVisible]);

  return (
    <Manager>
      <Reference>
        {({ ref }) => (
          <div className="flex w-40 h-10 " ref={ref}>
            <input
              className="w-full px-3 font-bold border-2 border-none rounded-l-lg outline-none cursor-pointer text-dark-txt bg-dark-third focus:border-gray-400"
              type="text"
              style={inputStyle}
              onFocus={(e) => showCalendar()}
              value={userAddDAte ? formattedDate(newDate) : "Select date"}
              readOnly
            />
            <button
              className="flex items-center justify-center px-2 text-sm font-bold text-gray-700 rounded-r-lg bg-dark-third focus:outline-none"
              onClick={(e) => toggleCalendar()}
            >
              <CalendarIcon size="20" color="#666" />
            </button>
          </div>
        )}
      </Reference>

      <Popper
        placement="bottom-start"
        innerRef={(node) => (popupNode.current = node)}
      >
        {({ ref, style, placement, arrowProps, update }) => {
          return isVisible ? (
            <DateSelections
              placement={placement}
              style={style}
              ref={ref as React.Ref<HTMLDivElement>}
            />
          ) : null;
        }}
      </Popper>
    </Manager>
  );
};

export default CalendarPicker;
