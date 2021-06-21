import React, { useState } from "react";
import { useStore } from "../../stores/store";
import TextAreaAuto from "react-textarea-autosize";
import { observer } from "mobx-react-lite";

const KanbanModal = () => {
  const {
    kanbanStore: {
      GetCardText,
      editCardID,
      deleteList,
      setOpenEditTodoModal,
      DeleteCard,
      UpdateCard,
    },
  } = useStore();
  const [textInput, setTextInput] = useState(GetCardText);

  const HandleDelete = () => {
    DeleteCard(editCardID!.cardID);
    setOpenEditTodoModal(false);
  };
  const HandleEdit = () => {
    if (textInput !== undefined && textInput.length !== 0) {
      UpdateCard(textInput, editCardID!.cardID);
    }
    setOpenEditTodoModal(false);
  };
  return (
    <div className="w-3/4 p-10 pt-3 m-auto rounded-md bg-dark-main">
      <div className="flex justify-end w-full">
        <button
          className="text-4xl -mr-7 text-dark-txt"
          onClick={() => setOpenEditTodoModal(false)}
        >
          <i className=" bx bxs-x-circle"></i>
        </button>
      </div>

      <div>
        {typeof GetCardText === "string" && (
          <TextAreaAuto
            autoFocus
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            className="w-full p-2 mt-5 mb-10 overflow-scroll rounded-md outline-none resize-none"
          />
        )}
      </div>
      <div className="flex justify-between ">
        <button
          className="w-20 p-2 text-white bg-green-900 rounded-md hover:bg-green-800"
          onClick={() => HandleEdit()}
        >
          Save
        </button>
        <button
          className="w-20 p-2 text-white bg-red-900 rounded-md hover:bg-red-800"
          onClick={() => HandleDelete()}
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default observer(KanbanModal);
