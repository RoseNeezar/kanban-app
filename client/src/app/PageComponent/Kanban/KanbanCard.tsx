import React from "react";
import { FC } from "react";
import { useStore } from "../../stores/store";
import { Draggable, DraggableProvided } from "react-beautiful-dnd";
import { observer, Observer } from "mobx-react-lite";

interface IKanbanCard {
  text: string;
  id: string;
  index: number;
  listID: string;
}
const KanbanCard: FC<IKanbanCard> = ({ text, id, index, listID }) => {
  const {
    kanbanStore: { setOpenEditTodoModal, setEditCardID },
  } = useStore();

  const HandleEditCard = () => {
    setEditCardID(listID, id);
    setOpenEditTodoModal(true);
  };
  return (
    <>
      {id !== null && (
        <Draggable draggableId={id} index={index}>
          {(provided: DraggableProvided) => (
            <Observer>
              {() => (
                <div
                  className="w-full mb-2 "
                  ref={provided.innerRef}
                  {...provided.draggableProps}
                  {...provided.dragHandleProps}
                >
                  <div className="flex flex-row justify-between p-2 overflow-hidden rounded-md max-h-9 bg-dark-main">
                    <p className="w-5/6 overflow-hidden text-sm overflow-ellipsis whitespace-nowrap text-dark-txt">
                      {text}
                    </p>
                    <button
                      className="flex items-center text-xl rounded-full text-dark-txt hover:bg-gray-300"
                      onClick={() => HandleEditCard()}
                    >
                      <i className="bx bx-dots-vertical-rounded"></i>
                    </button>
                  </div>
                </div>
              )}
            </Observer>
          )}
        </Draggable>
      )}
    </>
  );
};

export default observer(KanbanCard);
