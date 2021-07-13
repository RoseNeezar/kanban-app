import { observer } from "mobx-react-lite";
import React, { FC } from "react";
import { Redirect, Route, RouteProps } from "react-router";
import { RouteComponentProps } from "react-router-dom";
import { useStore } from "../stores/store";

interface Props extends RouteProps {
  component:
    | React.ComponentType<RouteComponentProps<any>>
    | React.ComponentType<any>;
}

const ProtectedRoute: FC<Props> = ({
  component: Component,
  ...rest
}: Props) => {
  const {
    userStore: { isLoggedIn, isLoading },
  } = useStore();

  return (
    <Route
      {...rest}
      render={(props) => {
        if (isLoading) return <h1>Loading...</h1>;
        return isLoggedIn ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{
              pathname: "/login",
            }}
          />
        );
      }}
    />
  );
};

export default observer(ProtectedRoute);
