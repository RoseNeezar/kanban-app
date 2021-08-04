import dayjs from "dayjs";
import React from "react";
import { useCalendarStore } from "../../../stores/useCalendarStore";
import Navigate from "../../../utils/Navigate";

const CalendarAction = () => {
  const { cardDueDateList } = useCalendarStore();
  const goToBoard = (boardId?: string, cardId?: string) => {
    Navigate?.push(`/board/${boardId}/card/${cardId}`);
  };
  return (
    <div className="flex flex-col items-center justify-between w-full p-2 pt-4 rounded-l-lg mt-9 bg-dark-second">
      <span className="text-lg font-semibold text-dark-txt dark:text-dark-txt">
        Task List
      </span>
      <div className="flex flex-col items-center w-full ">
        {cardDueDateList &&
          Object.entries(cardDueDateList).map((re) =>
            re[1].map((res) => (
              <div
                key={res._id}
                onClick={() => goToBoard(res.boardId, res._id)}
                className="flex flex-row w-full p-3 my-2 text-center truncate rounded-lg cursor-pointer hover:bg-dark-main text-dark-txt bg-dark-third "
              >
                <p className="mr-4">{dayjs(res.dueDate).format("DD/MM")}</p>
                <p>{res.title}</p>
              </div>
            ))
          )}
      </div>
    </div>
  );
};

export default CalendarAction;
