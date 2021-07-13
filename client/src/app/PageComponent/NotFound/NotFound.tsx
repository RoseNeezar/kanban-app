import React from "react";
import Head from "next/head";

const NotFound = () => {
  return (
    <>
      <Head>
        <title>NOT FOUND</title>
      </Head>
      <div className="flex items-center justify-center h-screen bg-dark-main">
        <p className="text-white text-7xl">Page Not Found</p>
      </div>
    </>
  );
};

export default NotFound;
