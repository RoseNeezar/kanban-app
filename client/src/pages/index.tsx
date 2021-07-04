import { observer } from "mobx-react-lite";
import React, { useEffect } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import LoadingPage from "../app/components/Loading/LoadingPage";
import Navbar from "../app/components/Navbar/Navbar";
import CompleteRegistration from "../app/PageComponent/confirmUser/CompleteRegistration";
import KanbanLayout from "../app/PageComponent/Kanban/KanbanLayout";
import Login from "../app/PageComponent/login/Login";
import MainPage from "../app/PageComponent/Main";
import NotFound from "../app/PageComponent/NotFound/NotFound";
import Register from "../app/PageComponent/register/Register";
import { useStore } from "../app/stores/store";
import ProtectedRoute from "../app/utils/ProtectedRoute";

const App = () => {
  const { userStore } = useStore();
  const { setAppLoaded, appLoaded } = userStore;
  useEffect(() => {
    userStore.getUser().finally(() => setAppLoaded());
  }, [userStore, setAppLoaded]);
  if (!appLoaded) return <LoadingPage />;
  return (
    <>
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
    </>
  );
};

export default observer(App);
