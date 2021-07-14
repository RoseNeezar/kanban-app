import { observer } from "mobx-react-lite";
import React, { FC, useEffect } from "react";
import { Router, Route, Switch } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import NotFound from "../pages/404";
import LoadingPage from "./components/Loading/LoadingPage";
import Navbar from "./components/Navbar/Navbar";
import CompleteRegistration from "./PageComponent/confirmUser/CompleteRegistration";
import KanbanLayout from "./PageComponent/Kanban/KanbanListLayout";
import Login from "./PageComponent/login/Login";
import Register from "./PageComponent/register/Register";
import { store, StoreContext, useStore } from "./stores/store";
import ProtectedRoute from "./utils/ProtectedRoute";
import MainPage from "./PageComponent/Main";
import Navigate from "./utils/Navigate";

const SafeHydrate: FC = ({ children }) => {
  return (
    <div suppressHydrationWarning>
      {typeof document === "undefined" ? null : children}
    </div>
  );
};

const App = () => {
  const { userStore } = useStore();
  const { setAppLoaded, appLoaded } = userStore;
  useEffect(() => {
    userStore.getUser().finally(() => setAppLoaded());
  }, [userStore, setAppLoaded]);
  if (!appLoaded) return <LoadingPage />;
  return (
    <SafeHydrate>
      <StoreContext.Provider value={store}>
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
      </StoreContext.Provider>
    </SafeHydrate>
  );
};

export default observer(App);
