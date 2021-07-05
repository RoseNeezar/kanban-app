import { makeAutoObservable, runInAction } from "mobx";
import { enableStaticRendering } from "mobx-react-lite";
import { RouteComponentProps } from "react-router-dom";
import agent from "../api/agent";
import { auth } from "../utils/firebase";
import { ILogin, IRegister, IUser } from "./types/user.types";

enableStaticRendering(typeof window === "undefined");

export default class UserStore {
  user: IUser | undefined = undefined;
  appLoaded = false;

  constructor() {
    makeAutoObservable(this);
  }

  get isLoggedIn() {
    return !!this.user;
  }

  login = async (
    login: Pick<ILogin, "email">,
    history: RouteComponentProps["history"]
  ) => {
    try {
      const result = await agent.AuthService.login(login);
      runInAction(() => {
        this.user = result;
        history.push("/");
      });
    } catch (error) {
      console.log(error);
    }
  };

  loginGoogle = async (
    login: Pick<ILogin, "email">,
    history: RouteComponentProps["history"]
  ) => {
    try {
      const result = await agent.AuthService.loginGoogle(login);
      runInAction(() => {
        console.log("login google");
        this.user = result;
        history.push("/");
      });
    } catch (error) {
      console.log(error);
    }
  };

  register = async (
    register: IRegister,
    history: RouteComponentProps["history"]
  ) => {
    try {
      await agent.AuthService.register(register);
      runInAction(() => {
        history.push("/login");
      });
    } catch (error) {
      console.log(error);
    }
  };

  getUser = async () => {
    try {
      const result = await agent.AuthService.currentUser();
      runInAction(() => {
        this.user = result;
      });
    } catch (error) {
      console.log(error);
    }
  };

  logout = async (history: RouteComponentProps["history"]) => {
    try {
      await agent.AuthService.logout();

      runInAction(() => {
        this.user = undefined;
        return history.push("/login");
      });
    } catch (error) {
      console.log(error);
    }
  };

  setAppLoaded = () => {
    this.appLoaded = true;
  };
}
