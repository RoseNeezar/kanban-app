import React, { Fragment, useEffect } from "react";
import {
  DragDropContext,
  DragUpdate,
  Droppable,
  DroppableProvided,
} from "react-beautiful-dnd";
import { useStore } from "../../stores/store";
import Head from "next/head";
import { observer, Observer } from "mobx-react-lite";
import KanbanModal from "./KanbanModal";
import KanbanAddAction from "./KanbanAddAction";
import KanbanList from "./KanbanList";
import { Dialog, Transition } from "@headlessui/react";

const ModalLayout = {
  content: {
    top: "35rem",
    left: "50%",
    right: "auto",
    bottom: "auto",
    transform: "translate(-50%, -30rem)",

    width: "60rem",
    padding: "0px",
    backgroundColor: "transparent",
    border: "none",
  },
  overlay: {
    top: "0%",
    left: "0%",
    right: "0",
    bottom: "0",
    overflow: "auto",
    backgroundColor: "rgba(70,69,72,0.4)",
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

  const HandleClosingModal = () => {
    setOpenEditTodoModal(false);
  };

  return (
    <>
      <Head>
        <title>Kanban App</title>
      </Head>
      <div className="flex flex-row justify-center h-screen pt-12 overflow-scroll bg-dark-main ">
        <Transition appear show={openEditTodoModal} as={Fragment}>
          <Dialog
            as="div"
            className="fixed inset-0 z-50 overflow-y-auto"
            onClose={() => HandleClosingModal()}
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
                <div className="inline-block w-full max-w-6xl my-16 overflow-hidden text-left align-middle transition-all transform shadow-xl rounded-2xl">
                  <KanbanModal />
                </div>
              </Transition.Child>
            </div>
          </Dialog>
        </Transition>
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
                        className="grid justify-start w-full h-full grid-flow-col gap-2 p-10 overflow-auto grid-rows-min "
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
