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
import ProtectAuthRoute from "../app/utils/ProtectAuthRoute";
import ProtectedRoute from "../app/utils/ProtectedRoute";

const App = () => {
  const { userStore } = useStore();
  const { isLoggedIn } = userStore;
  useEffect(() => {
    userStore.getUser().finally(() => console.log(""));
  }, [userStore, isLoggedIn]);
  return (
    <Router basename="/">
      <Switch>
        <ProtectedRoute exact path="/">
          <Navbar />
          <MainPage />
        </ProtectedRoute>
        <ProtectedRoute exact path="/kanban">
          <Navbar />
          <KanbanLayout />
        </ProtectedRoute>
        <ProtectAuthRoute exact path="/login">
          <Navbar />
          <Login />
        </ProtectAuthRoute>
        <ProtectAuthRoute exact path="/register">
          <Navbar />
          <Register />
        </ProtectAuthRoute>
        <Route path="*">
          <NotFound />
        </Route>
      </Switch>
    </Router>
  );
};

export default observer(App);
