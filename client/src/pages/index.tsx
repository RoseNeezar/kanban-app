import React, { useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/dist/client/router";
import LottieFile from "../app/utils/LottieFile";
import { useUserStore } from "../app/stores/useUserStore";

const Index = () => {
  const router = useRouter();
  const { isLoggedIn, getUser } = useUserStore();

  useEffect(() => {
    getUser();
  }, [getUser]);
  return (
    <>
      <Head>
        <title>Kanban App</title>
      </Head>
      <div className="h-full px-3 mt-5 ">
        <div className="container w-full mx-auto">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center text-2xl font-bold no-underline text-dark-txt hover:no-underline lg:text-4xl">
              Kanban App
            </div>

            <div className="flex content-center justify-end w-1/2 mt-3">
              {isLoggedIn() ? (
                <div
                  className="flex items-center justify-center w-24 h-10 mr-5 font-bold text-center no-underline duration-300 ease-in-out transform cursor-pointer rounded-xl bg-dark-third text-dark-txt hover:bg-dark-second hover:text-underline"
                  onClick={() => router.push("/app")}
                >
                  Go to App!
                </div>
              ) : (
                <>
                  <div
                    className="flex items-center justify-center w-24 h-10 mr-5 font-bold text-center no-underline duration-300 ease-in-out transform cursor-pointer rounded-xl bg-dark-third text-dark-txt hover:bg-dark-second hover:text-underline"
                    onClick={() => router.push("/login")}
                  >
                    Login
                  </div>
                  <div
                    className="flex items-center justify-center w-24 h-10 font-bold text-center no-underline duration-300 ease-in-out transform cursor-pointer rounded-xl bg-dark-third text-dark-txt hover:bg-dark-second hover:text-underline"
                    onClick={() => router.push("/register")}
                  >
                    Sign Up
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="container flex flex-col flex-wrap items-center pt-24 mx-auto md:pt-36 md:flex-row">
          <div className="flex flex-col justify-center w-full overflow-y-hidden xl:w-2/5 lg:items-start">
            <h1 className="my-4 text-3xl font-bold leading-tight text-center text-white opacity-75 md:text-5xl md:text-left">
              Just another Task management app
            </h1>
            <p className="mb-8 text-base leading-normal text-center md:text-2xl md:text-left text-dark-txt">
              It aims to help you visualize your work, maximize efficiency, and
              improve continuously
            </p>
          </div>

          <div className="w-full p-12 overflow-hidden xl:w-3/5">
            <LottieFile />
          </div>
        </div>
      </div>
    </>
  );
};

export default Index;
