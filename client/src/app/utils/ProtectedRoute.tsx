import { observer } from "mobx-react-lite";
import React, { FC } from "react";
import { Redirect, Route, RouteProps } from "react-router";
import { useStore } from "../stores/store";

const ProtectedRoute: FC<RouteProps> = ({ children, ...rest }) => {
  const {
    userStore: { isLoggedIn },
  } = useStore();

  return (
    <Route
      {...rest}
      render={({ location }) =>
        isLoggedIn ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: "/login",
              state: { from: location },
            }}
          />
        )
      }
    />
  );
};

export default observer(ProtectedRoute);
