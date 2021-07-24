import React, { FC, useCallback, useEffect } from "react";
import { Route, Router, Switch } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import NotFound from "../pages/404";
import LoadingPage from "./components/Loading/LoadingPage";
import Navbar from "./components/Navbar/Navbar";
import CompleteRegistration from "./PageComponent/confirmUser/CompleteRegistration";
import KanbanLayout from "./PageComponent/Kanban/KanbanListLayout";
import Login from "./PageComponent/login/Login";
import MainPage from "./PageComponent/Main";
import Register from "./PageComponent/register/Register";
import { store, StoreContext } from "./stores/store";
import { useUserStore } from "./stores/useUserStore";
import Navigate from "./utils/Navigate";
import ProtectedRoute from "./utils/ProtectedRoute";

const SafeHydrate: FC = ({ children }) => {
  return (
    <div suppressHydrationWarning>
      {typeof document === "undefined" ? null : children}
    </div>
  );
};

const App = () => {
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
    <SafeHydrate>
      <Router history={Navigate!}>
        <ToastContainer position="top-right" hideProgressBar />
        <Route
          render={() => (
            <>
              <Navbar />
              <Switch>
                <ProtectedRoute exact path="/" component={MainPage} />
                <ProtectedRoute
                  exact
                  path="/board/:id"
                  component={KanbanLayout}
                />
                <Route exact path="/login" component={Login} />
                <Route exact path="/register" component={Register} />
                <Route
                  exact
                  path="/complete-registration"
                  component={CompleteRegistration}
                />
                <Route component={NotFound} />
              </Switch>
            </>
          )}
        />
      </Router>
    </SafeHydrate>
  );
};

export default App;
