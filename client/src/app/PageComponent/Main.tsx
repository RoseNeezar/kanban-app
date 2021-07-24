import Head from "next/head";
import React from "react";
import KanbanLayout from "./Kanban/KanbanLayout";

const MainPage = () => {
  return (
    <>
      <Head>
        <title>Kanban App</title>
      </Head>
      <div className="flex flex-row justify-center h-screen pt-10 bg-dark-main">
        <KanbanLayout />
      </div>
    </>
  );
};

export default MainPage;
