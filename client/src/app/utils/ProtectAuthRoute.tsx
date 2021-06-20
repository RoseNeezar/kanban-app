import React, { FC } from "react";
import { RouteProps } from "react-router";
import { Redirect, Route } from "react-router-dom";
import isAuth from "./isAuth";

const ProtectAuthRoute: FC<RouteProps> = ({ children, ...rest }) => {
  const auth = isAuth();
  return (
    <Route
      {...rest}
      render={({ location }) =>
        auth.currentUser ? (
          <Redirect
            to={{
              pathname: "/",
              state: { from: location },
            }}
          />
        ) : (
          children
        )
      }
    />
  );
};

export default ProtectAuthRoute;
