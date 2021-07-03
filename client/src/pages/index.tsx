import { observer } from "mobx-react-lite";
import React, { useEffect } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Navbar from "../app/components/Navbar/Navbar";
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
  if (!appLoaded) return <h1>Loading App</h1>;
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
              <Route component={NotFound} />
            </Switch>
          </>
        )}
      />
    </>
  );
};

export default observer(App);
