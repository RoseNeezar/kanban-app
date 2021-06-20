import React, { FC } from "react";
import { Redirect, Route, RouteProps } from "react-router";
import isAuth from "./isAuth";

const ProtectedRoute: FC<RouteProps> = ({ children, ...rest }) => {
  const auth = isAuth();

  return (
    <Route
      {...rest}
      render={({ location }) =>
        auth.currentUser ? (
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

export default ProtectedRoute;
