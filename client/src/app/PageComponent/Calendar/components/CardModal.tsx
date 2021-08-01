import { Dialog } from "@headlessui/react";
import dayjs from "dayjs";
import React from "react";
import { useCalendarStore } from "../../../stores/useCalendarStore";
import Navigate from "../../../utils/Navigate";

const CardModal = () => {
  const { cardDueDateList, setOpenCardModal } = useCalendarStore();
  const goToBoard = (boardId?: string) => {
    setOpenCardModal(false);
    Navigate?.push(`/board/${boardId}`);
  };
  return (
    <div className="flex flex-col w-full p-5 pt-3 m-auto rounded-md bg-dark-main">
      <div className="flex justify-end mr-4 ">
        <button
          className="text-4xl -mr-7 text-dark-txt"
          onClick={() => setOpenCardModal(false)}
        >
          <i className=" bx bxs-x-circle"></i>
        </button>
      </div>
      <div className="flex flex-row justify-center">
        <div className="flex flex-col w-5/6 pr-4">
          <Dialog.Title>
            <p className="mb-2 text-3xl font-bold text-center text-dark-txt">
              {cardDueDateList
                ? dayjs(
                    Object.entries(cardDueDateList)[0][1][0].dueDate
                  ).format("dddd DD/MM/YYYY")
                : "Task List"}
            </p>
          </Dialog.Title>
          {cardDueDateList &&
            Object.entries(cardDueDateList).map((re) =>
              re[1].map((res) => (
                <div
                  onClick={() => goToBoard(res.boardId)}
                  className="p-3 my-2 text-center rounded-lg cursor-pointer text-dark-txt bg-dark-third"
                >
                  <p>{res.title}</p>
                </div>
              ))
            )}
        </div>
      </div>
    </div>
  );
};

export default CardModal;
