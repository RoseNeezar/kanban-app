import React from "react";
import { useIsFetching, useIsMutating } from "react-query";
import { useLocation } from "react-router-dom";
import { useKanbanStore } from "../../stores/useKanbanStore";
import Navigate from "../../utils/Navigate";
import NavActions from "./component/NavActions";

const Navbar = () => {
  const location = useLocation();
  const authRoute = ["/login", "/register"];
  const authChecker = authRoute.includes(location.pathname);
  const boardPath = location.pathname.includes("board");
  const isFetching = useIsFetching();
  const isMutating = useIsMutating();
  const display = isFetching || isMutating ? true : false;
  const { currentBoardTitle } = useKanbanStore();
  return (
    <nav className="fixed top-0 z-50 flex flex-col items-end justify-center w-full max-h-full border-b shadow bg-dark-second md:h-14 border-dark-third ">
      <div className="flex flex-row justify-between w-full">
        {boardPath ? (
          <div
            className="pt-1 ml-4 text-2xl cursor-pointer text-dark-txt"
            onClick={() => Navigate?.goBack()}
          >
            <i className="bx bx-arrow-back"></i>
          </div>
        ) : (
          <span></span>
        )}
        <div className="flex flex-row justify-between w-1/2">
          {display ? (
            <div className="pt-4 loading-spinner" />
          ) : (
            <div className="pt-1.5 text-lg text-dark-txt ">
              {boardPath ? (
                currentBoardTitle
              ) : (
                <div className="cursor-pointer">
                  <i className="text-3xl bx bx-ghost"></i>
                </div>
              )}
            </div>
          )}
          {!authChecker ? <NavActions /> : <></>}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
