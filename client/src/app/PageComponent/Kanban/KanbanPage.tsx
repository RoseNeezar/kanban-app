import React, { useEffect, useState } from "react";
import { useKanbanStore } from "../../stores/useKanbanStore";
import Navigate from "../../utils/Navigate";
import { useGetKanban } from "./hooks/useGetKanban";

const KanbanPage = () => {
  const { GetAllBoards, kanbanBoards, DeleteBoard, setListInCurrentBoard } =
    useKanbanStore();

  const [boardTitle, setBoardTitle] = useState("");

  const { FetchKanban, KanbanLoading } = useGetKanban(boardTitle);

  useEffect(() => {
    GetAllBoards();
  }, []);

  const HandleBoard = (boardId: string) => {
    setListInCurrentBoard(null);
    Navigate?.push(`/board/${boardId}`);
  };
  const HandleAddBoard = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (boardTitle.length > 0) {
      if (e.key === "Enter") {
        FetchKanban();
        setBoardTitle("");
      }
    }
  };
  const HandleAddBoardButton = () => {
    if (boardTitle.length > 0) {
      FetchKanban();
      setBoardTitle("");
    }
  };
  const HandleDeleteBoard = (boardId: string) => {
    DeleteBoard(boardId);
  };
  return (
    <>
      {KanbanLoading ? (
        <h1>Loading...</h1>
      ) : (
        <div className="flex flex-col items-center justify-center w-full mt-10 overflow-hidden b ">
          <div className="flex flex-col items-center ">
            <p className="text-2xl text-dark-txt">Create Board</p>
            <div className="flex flex-row items-center">
              <input
                className="p-2 mt-8 mb-8 rounded-md w-96"
                value={boardTitle}
                onChange={(e) => setBoardTitle(e.target.value)}
                onKeyDown={(e) => HandleAddBoard(e)}
              />
              <button
                onClick={() => HandleAddBoardButton()}
                className="w-20 h-10 ml-4 cursor-pointer hover:bg-dark-second rounded-xl bg-dark-third text-dark-txt"
              >
                Create
              </button>
            </div>
          </div>

          <div className="grid justify-center w-full grid-flow-row gap-10 overflow-scroll auto-rows-min grid-rows-min grid-cols-fit">
            {kanbanBoards?.boards
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
                    className="w-full h-20 rounded-md hover:text-black hover:bg-gray-200 bg-dark-second text-dark-txt"
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

export default KanbanPage;
