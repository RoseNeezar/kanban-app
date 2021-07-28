import React, { FC, KeyboardEvent, useState } from "react";
import { useKanbanStore } from "../../../stores/useKanbanStore";

interface IKanbanAddAction {
  list: boolean | number;
  id?: string;
}

const KanbanAddAction: FC<IKanbanAddAction> = ({ list, id }) => {
  const { currentKanbanBoardId, CreateList, CreateCard } = useKanbanStore();
  const [openForm, setOpenForm] = useState(false);
  const [textInput, setTextInput] = useState("");

  const HandleAdd = () => {
    if (list && textInput.length !== 0) {
      CreateList(textInput, currentKanbanBoardId);
      setTextInput("");
      setOpenForm(false);
    }
    if (!list && textInput.length !== 0 && id !== undefined) {
      CreateCard(id, textInput);
      setTextInput("");
      setOpenForm(false);
    }
  };
  const handleAddCard = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && textInput.length > 0) {
      HandleAdd();
    }
  };
  return (
    <>
      {openForm ? (
        <div className="max-h-full p-3 rounded-md h-28 bg-dark-third">
          <input
            placeholder={list ? "Enter title for list" : "Enter title for card"}
            autoFocus
            value={textInput}
            onKeyDown={(e) => handleAddCard(e)}
            onChange={(e) => setTextInput(e.target.value)}
            className="p-2 mb-3 border-none rounded-md outline-none resize-none w-60"
          />

          <div className="flex justify-between ">
            <button
              className="p-2 text-white bg-green-900 rounded-md"
              onClick={() => HandleAdd()}
            >
              {list ? "Enter list" : "Enter card"}
            </button>
            <button
              className="p-2 text-white bg-red-900 rounded-md"
              onClick={() => setOpenForm(false)}
            >
              cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center w-64 h-10 min-w-full rounded-md">
          <button
            className="flex items-center justify-between w-full h-full pl-2 pr-2 rounded-md hover:bg-gray-200 hover:text-black bg-dark-second text-dark-txt text-md"
            onClick={() => setOpenForm(true)}
          >
            {list ? "Add  list" : "Add  card"}
            <i className="text-xl bx bxs-plus-circle"></i>
          </button>
        </div>
      )}
    </>
  );
};

export default KanbanAddAction;
