import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
import Head from "next/head";
import { Link, useHistory } from "react-router-dom";
import InputGroup from "../../components/InputGroup";
import { useStore } from "../../stores/store";
import { auth } from "../../utils/firebase";

const CompleteRegistration = () => {
  const history = useHistory();

  const [formState, setFormState] = useState({
    email: "",

    password: "",
  });
  const { email, password } = formState;
  const [isLoading, setIsLoading] = useState(false);

  const onChangeText =
    (name: string) =>
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFormState({ ...formState, [name]: e.target.value });
    };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (password) {
      setIsLoading(true);

      const result = await auth.signInWithEmailLink(
        email,
        window.location.href
      );

      if (result.user?.emailVerified) {
        window.localStorage.removeItem("emailRegister");
        await auth.currentUser?.updatePassword(password);
        history.push("/login");
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    setFormState({
      ...formState,
      email: window.localStorage.getItem("emailRegister")!,
    });
  }, []);

  return (
    <>
      <Head>
        <title>Complete Register</title>
      </Head>
      <div className="flex flex-col items-center justify-center h-screen mt-20 bg-dark-main">
        <h1 className="mb-10 text-6xl text-white">Complete Registration</h1>
        <div className="flex flex-col items-center justify-center h-auto p-10 shadow-lg w-96 mb-44 bg-dark-second rounded-2xl">
          <form onSubmit={handleSubmit} className="flex flex-col w-full">
            <InputGroup
              className="mb-10 text-gray-500"
              type="email"
              value={email}
              setValue={onChangeText}
              placeholder="Email"
              disable={true}
            />
            <InputGroup
              className="mb-4"
              type="password"
              value={password}
              setValue={onChangeText}
              placeholder="Password"
            />

            <button className="relative flex flex-row items-center self-center justify-center h-20 mb-4 text-lg font-bold text-white uppercase w-60 hover:bg-dark-third rounded-2xl bg-dark-main">
              {isLoading ? (
                <div className="absolute text-sm top-3 left-12">
                  <div className=" loading-spinner" />
                </div>
              ) : (
                "Complete Sign Up"
              )}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default CompleteRegistration;
