import { observer } from "mobx-react-lite";
import Head from "next/head";
import React, { ChangeEvent, FC, FormEvent, useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import InputGroup from "../../components/InputGroup";
import { useStore } from "../../stores/store";
import { auth, googleAuthProvider } from "../../utils/firebase";

const Login: FC = () => {
  const history = useHistory();
  const {
    userStore: { login, loginGoogle },
  } = useStore();

  const [formState, setFormState] = useState({
    email: "",
    password: "",
  });
  const { email, password } = formState;

  const onChangeText =
    (name: string) =>
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFormState({ ...formState, [name]: e.target.value });
    };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (email && password) {
      try {
        const result = await auth.signInWithEmailAndPassword(email, password);
        const idToken = await result.user?.getIdTokenResult();

        const token = idToken?.token as string;
        window.localStorage.setItem("token", token);
        login({ email }, history).catch((err) => {
          throw err;
        });
      } catch (error) {
        toast.error(error.message);
      }
    } else {
      toast.warn("Please fill up the available fields");
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await auth
        .signInWithPopup(googleAuthProvider)
        .catch((err) => {
          throw err;
        });
      const idToken = await result.user?.getIdTokenResult();
      const token = idToken?.token as string;
      window.localStorage.setItem("token", token);
      loginGoogle({ email: result.user?.email as string }, history).catch(
        (err) => {
          throw err;
        }
      );
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <>
      <Head>
        <title>Login</title>
      </Head>
      <div className="flex flex-col items-center justify-center h-screen mt-12 bg-dark-main">
        <h1 className="mb-10 text-6xl text-white">Login</h1>
        <div className="flex flex-col items-center justify-center h-auto p-10 shadow-lg w-96 mb-44 bg-dark-second rounded-2xl">
          <form onSubmit={handleSubmit} className="flex flex-col w-full ">
            <InputGroup
              className="mb-10"
              type="email"
              value={email}
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

            <button className="self-center w-1/2 py-6 mt-4 mb-4 text-lg font-bold text-white uppercase hover:bg-dark-third rounded-2xl bg-dark-main">
              Login
            </button>
          </form>
          <button
            onClick={() => handleGoogleLogin()}
            className="flex items-center justify-between h-12 px-4 mb-10 text-white bg-blue-600 rounded-md hover:bg-blue-500 w-52"
          >
            <i className="text-2xl bx bxl-google"></i>
            <p>Sign in with google</p>
          </button>
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
