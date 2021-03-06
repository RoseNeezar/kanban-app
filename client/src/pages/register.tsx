import Head from "next/head";
import React, { ChangeEvent, FC, FormEvent, useState } from "react";
import Link from "next/link";
import { toast } from "react-toastify";
import InputGroup from "../app/components/InputGroup";
import { auth } from "../app/utils/firebase";

const Register: FC = () => {
  const [formState, setFormState] = useState({
    email: "",
    username: "",
    password: "",
  });
  const { email, username, password } = formState;
  const [sentEmail, setSentEmail] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const onChangeText =
    (name: string) =>
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFormState({ ...formState, [name]: e.target.value });
    };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (email) {
      try {
        setIsLoading(true);
        const config: firebase.default.auth.ActionCodeSettings = {
          url: process.env.NEXT_PUBLIC_SERVER_REGISTER_URL!,
          handleCodeInApp: true,
        };
        await auth.sendSignInLinkToEmail(email, config).catch((err) => {
          throw err;
        });
        window.localStorage.setItem("emailRegister", email);
        setIsLoading(false);
        setSentEmail(true);
      } catch (error) {
        setIsLoading(false);
        toast.error(error.message);
      }
    } else {
      toast.warn("Please fill up the available fields");
    }
  };

  return (
    <>
      <Head>
        <title>Register</title>
      </Head>
      <div className="flex flex-col items-center justify-center h-screen mt-20 bg-dark-main">
        {!sentEmail ? (
          <>
            <h1 className="mb-10 text-6xl text-white">Register</h1>
            <div className="flex flex-col items-center justify-center h-auto p-10 shadow-lg w-96 mb-44 bg-dark-second rounded-2xl">
              <form onSubmit={handleSubmit} className="flex flex-col w-full">
                <InputGroup
                  className="mb-10"
                  type="email"
                  value={email}
                  setValue={onChangeText}
                  placeholder="Email"
                />
                <button className="relative flex flex-row items-center self-center justify-center w-1/2 h-20 mb-4 text-lg font-bold text-white uppercase hover:bg-dark-third rounded-2xl bg-dark-main">
                  {isLoading ? (
                    <div className="absolute text-sm top-3 left-12">
                      <div className=" loading-spinner" />
                    </div>
                  ) : (
                    " Sign Up"
                  )}
                </button>
              </form>

              <small className="flex flex-row">
                <p className="text-gray-400"> Already have an account?</p>
                <Link href="/login">
                  <a>
                    <p className="ml-1 text-white uppercase hover:text-gray-400">
                      Login
                    </p>
                  </a>
                </Link>
              </small>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-auto p-10 shadow-lg w-96 mb-44 bg-dark-second rounded-2xl">
            <p className="text-2xl text-dark-txt">
              Check your email at {email}
            </p>
          </div>
        )}
      </div>
    </>
  );
};

export default Register;
