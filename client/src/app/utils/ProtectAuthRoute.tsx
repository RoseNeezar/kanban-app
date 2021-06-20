import React, { FC } from "react";
import { RouteProps } from "react-router";
import { Redirect, Route } from "react-router-dom";
import { useStore } from "../stores/store";

const ProtectAuthRoute: FC<RouteProps> = ({ children, ...rest }) => {
  const {
    userStore: { isLoggedIn },
  } = useStore();

  return (
    <Route
      {...rest}
      render={({ location }) =>
        isLoggedIn ? (
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
