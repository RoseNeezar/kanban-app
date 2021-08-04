import React, { useEffect, useRef } from "react";

export const tabs = [
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

const KanbanTimer = ({ setTimerEnd, remainingTime }: any) => {
  const minutes = Math.floor(remainingTime / 60);
  const seconds = remainingTime % 60;
  const isInitialMount = useRef(true);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
    } else {
      if (remainingTime === 0) {
        setTimerEnd(true);
      }
    }
  }, [remainingTime]);

  if (remainingTime === 0) {
    return <p className="table-caption text-2xl text-dark-txt">Timer Done!</p>;
  }

  if (seconds === 0) {
    return <p className="text-4xl text-dark-txt">{`${minutes}:${seconds}0`}</p>;
  }
  if (seconds / 10 < 1) {
    return <p className="text-4xl text-dark-txt">{`${minutes}:0${seconds}`}</p>;
  }
  return <p className="text-4xl text-dark-txt">{`${minutes}:${seconds}`}</p>;
};

export default KanbanTimer;
