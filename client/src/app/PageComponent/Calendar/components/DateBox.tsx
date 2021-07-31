import React from "react";
import { FC } from "react";
interface DateBoxProps {
  date: number;
  gridColumn?: number;
}
const DateBox: FC<DateBoxProps> = ({ date, gridColumn }) => {
  return (
    <div
      className="grid w-full h-20 rounded-lg bg-dark-third"
      style={gridColumn ? { gridColumnStart: `${gridColumn}` } : {}}
    >
      <div className="flex mt-1 ml-2">{date}</div>
    </div>
  );
};

export default DateBox;
