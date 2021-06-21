import React, { useEffect } from "react";
import {
  DragDropContext,
  DragUpdate,
  Droppable,
  DroppableProvided,
} from "react-beautiful-dnd";
import { useStore } from "../../stores/store";
import Head from "next/head";
import ListModal from "react-modal";
import { observer, Observer } from "mobx-react-lite";
import KanbanModal from "./KanbanModal";
import KanbanAddAction from "./KanbanAddAction";
import KanbanList from "./KanbanList";

const ModalLayout = {
  content: {
    top: "40rem",
    left: "50%",
    right: "auto",
    bottom: "auto",
    transform: "translate(-50%, -30rem)",

    width: "60rem",
    borderRadius: "5rem",
    backgroundColor: "transparent",
    border: "none",
  },
  overlay: {
    top: "0%",
    left: "0%",
    right: "0",
    bottom: "0",
    overflow: "auto",
    backgroundColor: "rgba(70,69,72,0.5)",
  },
};

const KanbanLayout = () => {
  const {
    kanbanStore: {
      sortKanban,
      openEditTodoModal,
      setOpenEditTodoModal,
      GetList,
      currentBoardId,
      allBoards,
      listOrder,
      listInCurrentBoard,
      getAllList,
      AllCards,
      LoadingNotes,
    },
  } = useStore();

  const BoardTitle = () => {
    return allBoards?.boards.find((res) => res._id === currentBoardId)?.title;
  };

  const HandleOnDragEnd = (result: DragUpdate) => {
    const { draggableId, destination, source, type } = result;
    if (!destination) {
      return;
    }

    sortKanban(
      source.droppableId,
      destination.droppableId,
      source.index,
      destination.index,
      draggableId,
      type
    );
  };
  useEffect(() => {
    GetList(currentBoardId);
  }, []);

  return (
    <>
      <Head>
        <title>Kanban App</title>
      </Head>
      <div className="flex flex-row justify-center h-screen pt-12 bg-dark-main">
        <ListModal
          style={ModalLayout}
          isOpen={openEditTodoModal}
          onRequestClose={() => setOpenEditTodoModal(false)}
          ariaHideApp={false}
        >
          <KanbanModal />
        </ListModal>

        {LoadingNotes ? (
          <h1>Loading...</h1>
        ) : (
          <div className="w-full p-3 overflow-hidden">
            <DragDropContext onDragEnd={HandleOnDragEnd}>
              <Droppable
                droppableId="all-lists"
                direction="horizontal"
                type="list"
              >
                {(provided: DroppableProvided) => (
                  <Observer>
                    {() => (
                      <div
                        className="grid justify-start w-full h-full grid-flow-col gap-2 p-10 overflow-hidden auto-rows-auto grid-rows-min min-w-max grid-cols-fit"
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                      >
                        {listInCurrentBoard &&
                          listInCurrentBoard!.map((res, index) => {
                            return (
                              <KanbanList
                                key={res._id}
                                title={res.title}
                                cards={res.cardIds}
                                id={res._id}
                                index={index}
                              />
                            );
                          })}
                        {provided.placeholder}
                        <KanbanAddAction list={true} />
                      </div>
                    )}
                  </Observer>
                )}
              </Droppable>
            </DragDropContext>
          </div>
        )}
      </div>
    </>
  );
};

export default observer(KanbanLayout);
