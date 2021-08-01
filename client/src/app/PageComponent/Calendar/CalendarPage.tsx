import React, { Fragment } from "react";
import { useCalendar } from "./hooks/useCalendar";
import DateBox from "./components/DateBox";
import { Transition, Dialog } from "@headlessui/react";
import CardModal from "./components/CardModal";
import { useCalendarStore } from "../../stores/useCalendarStore";

const CalendarPage = () => {
  const { monthYear, updateMonthYear, CardDueDate } = useCalendar();
  const { openCardModal, setOpenCardModal } = useCalendarStore();

  return (
    <div className="">
      <Transition appear show={openCardModal} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-50 overflow-y-auto top-24"
          onClose={() => setOpenCardModal(false)}
        >
          <div className="min-h-screen px-4 text-center">
            <Dialog.Overlay className="fixed inset-0 bg-gray-600 opacity-25" />
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <div className="inline-block my-16 overflow-hidden text-left transition-all transform shadow-xl w-96 rounded-2xl">
                <div className="flex flex-col w-full p-5 pt-3 m-auto rounded-md bg-dark-main">
                  <CardModal />
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
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
        <DateBox
          date={1}
          gridColumn={monthYear.firstDOW + 1}
          dueDateItems={CardDueDate[1]}
        />

        {[...Array(monthYear.lastDate)].map((_, i) =>
          i > 0 ? (
            <DateBox key={i} date={i + 1} dueDateItems={CardDueDate[i + 1]} />
          ) : null
        )}
      </div>
    </div>
  );
};

export default CalendarPage;
