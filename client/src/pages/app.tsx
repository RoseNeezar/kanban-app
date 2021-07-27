import React from "react";
import { FC } from "react";
import { QueryClientProvider } from "react-query";
import { Router } from "react-router-dom";
import MainApp from "../app";
import { queryClient } from "../app/stores/react-query/queryClient";
import Navigate from "../app/utils/Navigate";

const SafeHydrate: FC = ({ children }) => {
  return (
    <div suppressHydrationWarning>
      {typeof document === "undefined" ? null : children}
    </div>
  );
};

const App: FC = () => {
  return (
    <SafeHydrate>
      <QueryClientProvider client={queryClient}>
        <Router history={Navigate!}>
          <MainApp />
        </Router>
      </QueryClientProvider>
    </SafeHydrate>
  );
};

export default App;
