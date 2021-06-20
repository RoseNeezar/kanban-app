import Head from "next/head";
import React from "react";

const MainPage = () => {
  return (
    <>
      <Head>
        <title>Kanban App</title>
      </Head>
      <div className="flex flex-row justify-center h-screen pt-10 bg-dark-main">
        <div className="flex-col hidden w-1/5 h-full max-w-xs pt-16 lg:flex">
          <h1>hello</h1>
        </div>

        <div className="w-full h-full max-w-5xl px-2 pt-32 lg:w-4/5 lg:pt-16">
          <h1>wordk</h1>
        </div>
      </div>
    </>
  );
};

export default MainPage;
