import React, { useEffect, useRef, useState } from "react";
import { useStore } from "../../stores/store";
import TextAreaAuto from "react-textarea-autosize";
import { observer } from "mobx-react-lite";
import Markdown from "react-markdown";
import gfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { materialOceanic } from "react-syntax-highlighter/dist/cjs/styles/prism";
import { CountdownCircleTimer } from "react-countdown-circle-timer";
import { Dialog, Transition } from "@headlessui/react";

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

const timerCount = ({ remainingTime }: any) => {
  const minutes = Math.floor(remainingTime / 60);
  const seconds = remainingTime % 60;

  if (seconds === 0) {
    return <p className="text-4xl text-dark-txt">{`${minutes}:${seconds}0`}</p>;
  }
  if (seconds / 10 < 1) {
    return <p className="text-4xl text-dark-txt">{`${minutes}:0${seconds}`}</p>;
  }
  return <p className="text-4xl text-dark-txt">{`${minutes}:${seconds}`}</p>;
};

const KanbanModal = () => {
  const {
    kanbanStore: {
      GetCardText,
      editCardID,
      setOpenEditTodoModal,
      DeleteCard,
      UpdateCard,
    },
    pomodoroStore: {
      executing,
      startAnimate,
      updateExecute,
      pomodoro,
      stopAnimate,
      setStartAnimte,
      setCurrentTimer,
    },
  } = useStore();
  const [textInput, setTextInput] = useState(GetCardText?.title);
  const [edit, setEdit] = useState(false);
  const [descp, setDescp] = useState(GetCardText?.descriptions);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const tabRef = useRef(0);
  const tabs = [
    {
      placeholder: "Pomodoro",
      state: "work",
    },
    {
      placeholder: "Short Break",
      state: "short",
    },
    {
      placeholder: "Long Break",
      state: "long",
    },
  ];

  const handleTimerState = () => {
    if (tabRef.current >= 2) {
      tabRef.current = 0;
      setCurrentTimer(tabs[tabRef.current].state);
      return;
    }
    tabRef.current++;
    setCurrentTimer(tabs[tabRef.current].state);
  };

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
    setEdit(false);
  };

  const HandleStartPomodoro = () => {
    setStartAnimte(!startAnimate);
  };

  useEffect(() => {
    updateExecute(executing);
  }, [executing, startAnimate]);

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
                onBlur={() => HandleEdit()}
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                className="w-full p-2 overflow-scroll text-2xl font-bold rounded-md focus:outline-none focus:ring focus:border-gray-200 text-dark-txt bg-dark-main"
              />
            </Dialog.Title>
          )}
          <div className="mt-2 text-5xl text-dark-txt">
            <i className="bx bxl-markdown"></i>
          </div>

          {edit ? (
            <TextAreaAuto
              autoFocus
              onBlur={() => HandleEdit()}
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
        </div>
        <div className="flex flex-col w-1/6 pl-4 ">
          <div
            onClick={() => handleTimerState()}
            className="flex items-center justify-center w-40 h-10 p-2 mt-2 mb-10 text-xl font-bold cursor-pointer text-dark-txt bg-dark-third rounded-2xl"
          >
            <p>{tabs[tabRef.current].placeholder}</p>
          </div>
          <div className="relative flex items-center justify-center w-full mb-10 cursor-pointer">
            <CountdownCircleTimer
              key={pomodoro}
              size={170}
              isPlaying={startAnimate}
              duration={pomodoro * 60}
              colors={[
                ["#47DC84", 0.33],
                ["#47DC84", 0.33],
                ["#991C1C", 0.33],
              ]}
              trailColor="#18191A"
              onComplete={() => {
                stopAnimate();
              }}
            >
              {timerCount}
            </CountdownCircleTimer>
          </div>
          {!startAnimate ? (
            <div
              onClick={() => HandleStartPomodoro()}
              className="absolute flex items-center justify-center w-48 h-48 text-white bg-green-700 rounded-full opacity-0 cursor-pointer right-2 a top-32 hover:opacity-100"
            >
              <p className="text-3xl">Start</p>
            </div>
          ) : (
            <div
              onClick={() => HandleStartPomodoro()}
              className="absolute flex items-center justify-center w-48 h-48 text-white bg-yellow-700 rounded-full opacity-0 cursor-pointer right-2 a top-32 hover:opacity-100"
            >
              <p className="text-3xl">Pause</p>
            </div>
          )}
          {!confirmDelete ? (
            <button
              className="p-2 mt-auto text-white bg-red-900 rounded-md w-44 hover:bg-red-800"
              onClick={() => setConfirmDelete(true)}
            >
              Delete
            </button>
          ) : (
            <button
              className="p-2 mt-auto text-white bg-red-900 rounded-md w-44 hover:bg-red-800"
              onClick={() => HandleDelete()}
              onMouseLeave={() => setConfirmDelete(false)}
            >
              Confirm ?
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default observer(KanbanModal);
