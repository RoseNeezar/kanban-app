import React, { useEffect, useState } from "react";
import { useKanbanStore } from "../../stores/useKanbanStore";
import Navigate from "../../utils/Navigate";

const KanbanLayout = () => {
  const {
    GetAllBoards,
    kanbanBoards,
    CreateBoard,
    DeleteBoard,
    setListInCurrentBoard,
  } = useKanbanStore();

  const [boardTitle, setBoardTitle] = useState("");
  useEffect(() => {
    GetAllBoards();
  }, []);

  const HandleBoard = (boardId: string) => {
    setListInCurrentBoard(null);
    Navigate?.push(`/board/${boardId}`);
  };
  const HandleAddBoard = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.keyCode === 13) {
      CreateBoard(boardTitle);

      setBoardTitle("");
    }
  };
  const HandleDeleteBoard = (boardId: string) => {
    DeleteBoard(boardId);
  };
  return (
    <>
      {!kanbanBoards ? (
        <h1>Loading...</h1>
      ) : (
        <div className="flex flex-col items-center justify-center w-full mt-10">
          <p className="text-lg text-dark-txt">
            Fill the input with a board name, then press 'Enter'
          </p>
          <input
            className="p-2 mt-8 mb-8 rounded-md w-96"
            value={boardTitle}
            onChange={(e) => setBoardTitle(e.target.value)}
            onKeyDown={(e) => HandleAddBoard(e)}
          />
          <div className="grid justify-center w-full grid-flow-row gap-10 auto-rows-min grid-rows-min grid-cols-fit">
            {kanbanBoards.boards
              .filter((fil) => fil.title !== "")
              .map((res) => (
                <div className="p-2 rounded-md bg-dark-third" key={res._id}>
                  <div className="flex justify-end ">
                    <button
                      className="text-3xl rounded-full text-dark-main hover:text-gray-200"
                      onClick={() => HandleDeleteBoard(res._id)}
                    >
                      <i className=" bx bxs-x-circle"></i>
                    </button>
                  </div>

                  <button
                    className="w-full rounded-md h-60 hover:text-black hover:bg-gray-200 bg-dark-second text-dark-txt"
                    onClick={() => HandleBoard(res._id)}
                  >
                    {res.title}
                  </button>
                </div>
              ))}
          </div>
        </div>
      )}
    </>
  );
};

export default KanbanLayout;
