import React from "react";
import { FC } from "react";
import { Link, useLocation } from "react-router-dom";

interface ISidebar {
  url: string;
}

const Sidebar: FC<ISidebar> = ({ url }) => {
  const kanbanRoute = "/kanban";
  const calendarRoute = "/calendar";
  const { pathname } = useLocation();
  console.log(pathname);
  return (
    <>
      <ul className="flex flex-col items-center justify-evenly h-1/2">
        <li
          className={`w-5/6 rounded-3xl py-2 pl-3 hover:bg-dark-third ${
            pathname === kanbanRoute && "bg-dark-third "
          }`}
        >
          <Link
            to={`${url}kanban`}
            className={`text-center text-2xl  text-dark-txt flex justify-center xl:justify-start items-center`}
          >
            <i className="pr-5 bx bx-notepad"></i>
            <span className="hidden xl:inline-block"> Kanban</span>
          </Link>
        </li>

        <li
          className={`w-5/6   rounded-3xl py-2 pl-3 hover:bg-dark-third ${
            pathname === calendarRoute && "bg-dark-third "
          }`}
        >
          <Link
            to={`${url}calendar`}
            className={`text-center text-2xl  text-dark-txt flex justify-center xl:justify-start items-center`}
          >
            <i className="pr-5 bx bx-calendar"></i>
            <span className="hidden xl:inline-block"> Calendar</span>
          </Link>
        </li>
        <li className="mt-6 border-b border-gray-200 "></li>
      </ul>
    </>
  );
};

export default Sidebar;
