import React, { useLayoutEffect } from "react";
import Navigate from "../../utils/Navigate";

const HomePage = () => {
  useLayoutEffect(() => {
    Navigate?.push("/kanban");
  }, []);
  return <div>Loading...</div>;
};

export default HomePage;
