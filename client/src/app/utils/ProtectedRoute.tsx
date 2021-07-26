import React, { FC, useCallback } from "react";
import { Redirect, Route, RouteProps } from "react-router";
import { RouteComponentProps } from "react-router-dom";
import { useUserStore } from "../stores/useUserStore";

interface Props extends RouteProps {
  component:
    | React.ComponentType<RouteComponentProps<any>>
    | React.ComponentType<any>;
}

const ProtectedRoute: FC<Props> = ({
  component: Component,
  ...rest
}: Props) => {
  const { isLoggedIn } = useUserStore();
  return (
    <Route
      {...rest}
      render={(props) =>
        isLoggedIn() ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{
              pathname: "/login",
            }}
          />
        )
      }
    />
  );
};

export default ProtectedRoute;
