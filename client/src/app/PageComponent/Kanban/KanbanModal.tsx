import React, { useState } from "react";
import { useStore } from "../../stores/store";
import TextAreaAuto from "react-textarea-autosize";
import { observer } from "mobx-react-lite";
import Markdown from "react-markdown";
import gfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { materialOceanic } from "react-syntax-highlighter/dist/cjs/styles/prism";
import { toJS } from "mobx";
import { Dialog } from "@headlessui/react";

const components = {
  code({ node, inline, className, children, ...props }: any) {
    const match = /language-(\w+)/.exec(className || "");

    return !inline && match ? (
      <SyntaxHighlighter
        style={materialOceanic}
        language={match[1]}
        PreTag="div"
        children={String(children).replace(/\n$/, "")}
        {...props}
      />
    ) : (
      <code className={className} {...props}>
        {children}
      </code>
    );
  },
};

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
  const [textInput, setTextInput] = useState(GetCardText?.title);

  const [edit, setEdit] = useState(false);
  const [descp, setDescp] = useState(GetCardText?.descriptions);

  const HandleDelete = () => {
    DeleteCard(editCardID!.cardID);
    setOpenEditTodoModal(false);
  };
  const HandleEdit = () => {
    if (
      textInput !== undefined &&
      textInput.length !== 0 &&
      descp !== undefined &&
      descp.length !== 0
    ) {
      UpdateCard(textInput, descp, editCardID!.cardID);
    }
    setOpenEditTodoModal(false);
  };

  return (
    <div className="flex flex-col w-full p-5 pt-3 m-auto rounded-md bg-dark-main">
      <div className="flex justify-end mr-4 ">
        <button
          className="text-4xl -mr-7 text-dark-txt"
          onClick={() => setOpenEditTodoModal(false)}
        >
          <i className=" bx bxs-x-circle"></i>
        </button>
      </div>
      <div className="flex flex-row">
        <div className="flex flex-col w-5/6 pr-4 ">
          {typeof GetCardText?.title === "string" && (
            <Dialog.Title>
              <input
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                className="w-full p-2 overflow-scroll text-2xl rounded-md focus:outline-none focus:ring focus:border-gray-200 text-dark-txt bg-dark-main"
              />
            </Dialog.Title>
          )}
          <div className="mt-2 text-5xl text-dark-txt">
            <i className="bx bxl-markdown"></i>
          </div>

          {edit ? (
            <TextAreaAuto
              autoFocus
              onBlur={() => setEdit(false)}
              value={descp}
              onChange={(e) => setDescp(e.target.value)}
              className="w-full p-2 pb-10 mb-10 overflow-scroll rounded-md text-dark-txt bg-dark-third"
            />
          ) : descp ? (
            <div onClick={() => setEdit(true)}>
              <Markdown
                className="h-auto min-w-full mb-10 prose text-dark-txt"
                components={components}
                children={descp}
                remarkPlugins={[gfm]}
              />
            </div>
          ) : (
            <div
              onClick={() => setEdit(true)}
              className="mb-10 text-lg text-dark-txt"
            >
              Enter a description...
            </div>
          )}
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
        <div className="flex w-1/6 pl-4 ">
          <div className="flex items-center justify-center w-40 h-10 p-2 mt-2 text-xl font-bold text-dark-txt bg-dark-third rounded-2xl">
            <p>Pomodoro</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default observer(KanbanModal);
