import { Menu, Transition } from "@headlessui/react";
import { toJS } from "mobx";
import React, { FC, Fragment, useEffect, useState } from "react";
import {
  Draggable,
  DraggableProvided,
  Droppable,
  DroppableProvided,
} from "react-beautiful-dnd";
import TextInputAreaAuto from "react-textarea-autosize";
import { ICard } from "../../stores/types/kanban.types";
import { useKanbanStore } from "../../stores/useKanbanStore";
import KanbanAddAction from "./KanbanAddAction";
import KanbanCard from "./KanbanCard";

interface IKanbanList {
  title: string;
  cards: string[];
  id: string;
  index: number;
}
const KanbanList: FC<IKanbanList> = ({ title, cards, id, index }) => {
  const { getKanbanBoardCards, DeleteList, UpdateList } = useKanbanStore();

  const [editList, setEditList] = useState(false);
  const [listText, setListText] = useState(title);

  const CardList = () => {
    if (getKanbanBoardCards !== null) {
      let temp: ICard[] = [];
      toJS(cards)?.forEach((res) => {
        return toJS(getKanbanBoardCards)!.map((re) => {
          if (re._id === res) {
            return temp.push(re);
          }
        });
      });
      return temp;
    }
  };
  const HandleDeleteList = () => {
    DeleteList(id);
  };
  const HandleUpdateListTitle = (
    e: React.KeyboardEvent<HTMLTextAreaElement>
  ) => {
    if (e.keyCode === 13 && listText !== undefined && listText.length !== 0) {
      e.preventDefault();
      UpdateList(listText, id);
      setEditList(false);
    }
  };
  useEffect(() => {
    CardList();
  }, [getKanbanBoardCards]);

  return (
    <Draggable draggableId={id} index={index}>
      {(provided: DraggableProvided) => (
        <div
          className="h-auto min-h-full w-72 "
          {...provided.draggableProps}
          ref={provided.innerRef}
          {...provided.dragHandleProps}
        >
          <Droppable droppableId={id} type="card">
            {(provided: DroppableProvided) => (
              <div
                className="p-2 m-1 rounded-md bg-dark-third"
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                {cards && (
                  <>
                    <div className="relative flex flex-row justify-between ">
                      {!editList ? (
                        <p className="w-5/6 mb-1 overflow-hidden text-lg overflow-ellipsis text-dark-txt whitespace-nowrap">
                          {title}
                        </p>
                      ) : (
                        <div className="z-50 mb-1 overflow-scroll bg-white border-2 border-blue-400 border-solid rounded-md">
                          <TextInputAreaAuto
                            autoFocus={true}
                            value={listText}
                            onChange={(e) => setListText(e.target.value)}
                            onKeyDown={(e) => HandleUpdateListTitle(e)}
                            className="border-none outline-none resize-none"
                          />
                        </div>
                      )}
                      <div className="absolute top-0 z-50 text-right right-2 w-7 ">
                        <Menu
                          as="div"
                          className="relative inline-block text-left"
                        >
                          <div>
                            <Menu.Button
                              className="flex items-center justify-center p-1 mx-1 text-xl rounded-full cursor-pointer text-dark-txt hover:bg-gray-300"
                              id="dark-mode-toggle"
                            >
                              <i className="bx bx-dots-vertical-rounded"></i>
                            </Menu.Button>
                          </div>
                          <Transition
                            as={Fragment}
                            enter="transition ease-out duration-100"
                            enterFrom="transform opacity-0 scale-95"
                            enterTo="transform opacity-100 scale-100"
                            leave="transition ease-in duration-75"
                            leaveFrom="transform opacity-100 scale-100"
                            leaveTo="transform opacity-0 scale-95"
                          >
                            <Menu.Items className="absolute right-0 w-32 mt-2 origin-top-right bg-gray-200 divide-y divide-black rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                              <Menu.Item>
                                {({ active }) => (
                                  <button
                                    className="flex items-center w-full h-auto px-2 py-2 text-sm rounded-t-sm outline-none hover:bg-dark-second hover:text-dark-txt"
                                    onClick={() => setEditList(true)}
                                  >
                                    Edit
                                  </button>
                                )}
                              </Menu.Item>
                              <Menu.Item>
                                {({ active }) => (
                                  <button
                                    className="flex items-center w-full h-auto px-2 py-2 text-sm rounded-b-sm outline-none hover:bg-dark-second hover:text-dark-txt"
                                    onClick={() => HandleDeleteList()}
                                  >
                                    Delete
                                  </button>
                                )}
                              </Menu.Item>
                            </Menu.Items>
                          </Transition>
                        </Menu>
                      </div>
                    </div>

                    {CardList()?.map((res, index) => {
                      return (
                        <KanbanCard
                          key={res._id}
                          text={res.title}
                          id={res._id}
                          index={index}
                          listID={id}
                        />
                      );
                    })}
                  </>
                )}
                {provided.placeholder}
                <KanbanAddAction list={false} id={id} />
              </div>
            )}
          </Droppable>
        </div>
      )}
    </Draggable>
  );
};

export default KanbanList;
