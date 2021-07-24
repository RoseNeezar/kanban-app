import { Dialog, Transition } from "@headlessui/react";
import Head from "next/head";
import React, { Fragment, useEffect } from "react";
import {
  DragDropContext,
  DragUpdate,
  Droppable,
  DroppableProvided,
} from "react-beautiful-dnd";
import { useParams } from "react-router-dom";
import LoadingPage from "../../components/Loading/LoadingPage";
import { useKanbanStore } from "../../stores/useKanbanStore";
import { usePomodoroStore } from "../../stores/usePomodoroStore";
import KanbanAddAction from "./KanbanAddAction";
import KanbanList from "./KanbanList";
import KanbanModal from "./KanbanModal";

const KanbanLayout = () => {
  const { id } = useParams<{ id: string }>();

  const {
    sortKanban,
    openEditKanbanCardModal,
    setOpenEditTodoModal,
    GetBoardContent,
    kanbanListInCurrentBoard,
    LoadingLists,
  } = useKanbanStore();

  const { stopTimer, resetTimer } = usePomodoroStore();

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
    GetBoardContent(id);
  }, [id, GetBoardContent]);

  const HandleClosingModal = () => {
    stopTimer();
    resetTimer();
    setOpenEditTodoModal(false);
  };

  return (
    <>
      <Head>
        <title>Kanban App</title>
      </Head>
      <div className="flex flex-row justify-center h-screen pt-12 overflow-scroll bg-dark-main ">
        <Transition appear show={openEditKanbanCardModal} as={Fragment}>
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
        {!LoadingLists ? (
          !kanbanListInCurrentBoard ? (
            <LoadingPage />
          ) : (
            <div className="w-full p-3 overflow-hidden">
              <DragDropContext onDragEnd={HandleOnDragEnd}>
                <Droppable
                  droppableId="all-lists"
                  direction="horizontal"
                  type="list"
                >
                  {(provided: DroppableProvided) => (
                    <div
                      className="grid justify-start w-full h-full grid-flow-col gap-2 p-10 overflow-auto grid-rows-min "
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                    >
                      {kanbanListInCurrentBoard!.map((res, index) => {
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
                </Droppable>
              </DragDropContext>
            </div>
          )
        ) : (
          <LoadingPage />
        )}
      </div>
    </>
  );
};

export default KanbanLayout;
