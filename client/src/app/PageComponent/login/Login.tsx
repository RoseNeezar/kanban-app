import { observer } from "mobx-react-lite";
import Head from "next/head";
import React, { ChangeEvent, FC, FormEvent, useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import InputGroup from "../../components/InputGroup";
import { useStore } from "../../stores/store";

const Login: FC = () => {
  const history = useHistory();
  const {
    userStore: { login },
  } = useStore();

  const [formState, setFormState] = useState({
    username: "",
    password: "",
  });
  const { username, password } = formState;

  const onChangeText =
    (name: string) =>
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFormState({ ...formState, [name]: e.target.value });
    };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (username && password) {
      login({ username, password }, history).catch((err) => console.log(err));
    }
  };

  return (
    <>
      <Head>
        <title>Login</title>
      </Head>
      <div className="flex flex-col items-center justify-center h-screen bg-dark-main">
        <h1 className="mb-10 text-6xl text-white">Login</h1>
        <div className="flex flex-col items-center justify-center h-auto p-10 shadow-lg w-96 mb-44 bg-dark-second rounded-2xl">
          <form onSubmit={handleSubmit} className="flex flex-col w-full ">
            <InputGroup
              className="mb-10"
              type="username"
              value={username}
              setValue={onChangeText}
              placeholder="Username"
            />
            <InputGroup
              className="mb-4"
              type="password"
              value={password}
              setValue={onChangeText}
              placeholder="Password"
            />

            <button className="self-center w-1/2 py-6 mt-10 mb-4 text-lg font-bold text-white uppercase rounded-2xl bg-dark-main">
              Login
            </button>
          </form>
          <small className="flex flex-row">
            <p className="text-gray-400"> Dont have an account?</p>
            <Link to="/register">
              <p className="ml-1 text-white uppercase hover:text-gray-400">
                Sign Up
              </p>
            </Link>
          </small>
        </div>
      </div>
    </>
  );
};

export default observer(Login);
