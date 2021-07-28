import { useRouter } from "next/dist/client/router";
import React, { useCallback, useEffect } from "react";
import { Route, Switch } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import LoadingPage from "./components/Loading/LoadingPage";
import Navbar from "./components/Navbar/Navbar";
import KanbanListLayout from "./PageComponent/Kanban/components/KanbanListLayout";

import MainPage from "./PageComponent/MainPage";
import NotFound from "./PageComponent/NotFound/NotFound";
import { useUserStore } from "./stores/useUserStore";
import ScrollToTop from "./utils/ScrollToTop";

const MainApp = () => {
  const { setAppLoaded, appLoaded, getUser } = useUserStore(
    useCallback(
      (state) => ({
        setAppLoaded: state.setAppLoaded,
        appLoaded: state.appLoaded,
        getUser: state.getUser,
      }),
      []
    )
  );

  useEffect(() => {
    getUser().finally(() => setAppLoaded());
  }, [setAppLoaded]);
  if (!appLoaded) return <LoadingPage />;
  return (
    <>
      <ScrollToTop />
      <ToastContainer position="top-right" hideProgressBar />
      <Route
        render={() => (
          <>
            <Navbar />
            <Switch>
              <Route exact path="/board/:id" component={KanbanListLayout} />
              <Route path="/" component={MainPage} />
            </Switch>
          </>
        )}
      />
    </>
  );
};

export default MainApp;
