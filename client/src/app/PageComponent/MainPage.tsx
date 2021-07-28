import Head from "next/head";
import React, { useEffect, useState } from "react";
import { Route, Switch, useRouteMatch } from "react-router-dom";

import Sidebar from "../components/Sidebar/Sidebar";
import { useUserStore } from "../stores/useUserStore";
import Calendar from "./Calendar/Calendar";
import CalendarAction from "./Calendar/components/CalendarAction";
import HomepageAction from "./Homepage/components/HomepageAction";
import HomePage from "./Homepage/Index";
import KanbanAction from "./Kanban/components/KanbanAction";
import KanbanLayout from "./Kanban/KanbanLayout";
import NotFound from "./NotFound/NotFound";

const MainPage = () => {
  let { path, url } = useRouteMatch();
  const [scrollPosition, setScrollPosition] = useState(0);
  const handleScroll = () => {
    const position = window.pageYOffset;
    setScrollPosition(position);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      <Head>
        <title>Kanban App</title>
      </Head>

      <div className="flex justify-center h-screen">
        <div className="fixed top-0 left-0 flex-col hidden w-1/5 h-full pt-16 lg:flex">
          <Sidebar url={url} />
        </div>
        <div className="relative w-full px-2 pt-32 lg:w-2/3 xl:w-1/2 lg:pt-16">
          <Switch>
            <Route exact path={`${path}kanban`} component={KanbanLayout} />
            <Route exact path={`${path}calendar`} component={Calendar} />
            <Route exact path={`${path}`} component={HomePage} />
            <Route path="*" component={NotFound} />
          </Switch>
          {scrollPosition > 200 && (
            <div
              className="fixed p-3 cursor-pointer bottom-2 bg-dark-third text-dark-txt rounded-3xl left-3/4"
              onClick={() => window.scrollTo(0, 0)}
            >
              Back to top
            </div>
          )}
        </div>
        <div className="fixed top-0 right-0 hidden w-1/5 h-full px-4 pt-16 lg:block">
          <Switch>
            <Route exact path={`${path}kanban`} component={KanbanAction} />
            <Route exact path={`${path}calendar`} component={CalendarAction} />
            <Route exact path={`${path}`} component={HomepageAction} />
            <Route path="*">
              <span></span>
            </Route>
          </Switch>
        </div>
      </div>
    </>
  );
};

export default MainPage;