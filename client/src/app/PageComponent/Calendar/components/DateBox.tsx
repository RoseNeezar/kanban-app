import { Dialog, Popover, Transition } from "@headlessui/react";
import dayjs from "dayjs";
import React, { FC, Fragment, useMemo } from "react";
import { ICard } from "../../../stores/types/kanban.types";
import { useCalendarStore } from "../../../stores/useCalendarStore";
import Navigate from "../../../utils/Navigate";
import CardModal from "./CardModal";
interface DateBoxProps {
  date: number;
  gridColumn?: number;
  dueDateItems?: ICard[];
  currentMonth: string;
}
const DateBox: FC<DateBoxProps> = ({
  date,
  gridColumn,
  currentMonth,
  dueDateItems = [],
}) => {
  const { setOpenCardModal } = useCalendarStore();

  const getDate = () => {
    return {
      day: dayjs().date(),
      month: dayjs().month() + 1,
    };
  };
  const today = useMemo(() => getDate(), []);

  return (
    <>
      <div
        className="grid w-full h-20 rounded-lg bg-dark-third"
        style={gridColumn ? { gridColumnStart: `${gridColumn}` } : {}}
      >
        <div className="flex mt-1 ml-2 ">
          <p
            className={`mr-2 ${
              today.day === date &&
              today.month === Number(currentMonth) &&
              "bg-yellow-400  rounded-full p-3 flex items-center justify-center text-dark-main h-5 w-5"
            }`}
          >
            {date}
          </p>
          <div className="grid w-full grid-cols-2 ">
            {dueDateItems.length < 7 ? (
              dueDateItems.map((res) => (
                <Popover key={res._id} className="relative h-5 ">
                  {({ open }) => (
                    <>
                      <Popover.Button
                        className={`
        ${open ? "" : "text-opacity-90"}
        w-5 h-5 rounded-full ${
          dueDateItems.length < 4 ? " bg-blue-600" : "bg-purple-700"
        } cursor-pointer`}
                      />
                      <Transition
                        as={Fragment}
                        enter="transition ease-out duration-200"
                        enterFrom="opacity-0 translate-y-1"
                        enterTo="opacity-100 translate-y-0"
                        leave="transition ease-in duration-150"
                        leaveFrom="opacity-100 translate-y-0"
                        leaveTo="opacity-0 translate-y-1"
                      >
                        <Popover.Panel
                          onClick={() =>
                            Navigate?.push(`/board/${res.boardId}`)
                          }
                          className="absolute z-10 w-40 max-w-sm px-4 transform -translate-x-1/2 cursor-pointer left-1/2 sm:px-0 lg:max-w-3xl"
                        >
                          <div className="overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
                            <div className="relative grid gap-1 p-3 text-center bg-dark-second text-dark-txt">
                              {res.title}
                            </div>
                          </div>
                        </Popover.Panel>
                      </Transition>
                    </>
                  )}
                </Popover>
              ))
            ) : (
              <div
                onClick={() => setOpenCardModal(true)}
                className="bg-red-700 rounded-full cursor-pointer mt-2qw w-14 h-14"
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default DateBox;
