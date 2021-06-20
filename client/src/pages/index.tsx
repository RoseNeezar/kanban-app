import React from "react";
import { Router, Route, Switch } from "react-router-dom";
import Login from "../app/PageComponent/login/Login";
import MainPage from "../app/PageComponent/Main";
import NotFound from "../app/PageComponent/NotFound/NotFound";
import Register from "../app/PageComponent/register/Register";
import ProtectAuthRoute from "../app/utils/ProtectAuthRoute";
import ProtectedRoute from "../app/utils/ProtectedRoute";
import { createBrowserHistory } from "history";

export const history = createBrowserHistory();

const App = () => {
  return (
    <Router history={history}>
      <Switch>
        <ProtectedRoute exact path="/">
          <MainPage />
        </ProtectedRoute>
        <Route exact path="/login">
          <Login />
        </Route>
        <ProtectAuthRoute exact path="/register">
          <Register />
        </ProtectAuthRoute>
        <Route path="*">
          <NotFound />
        </Route>
      </Switch>
    </Router>
  );
};

export default App;
