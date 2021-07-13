import { makeAutoObservable, runInAction } from "mobx";
import { enableStaticRendering } from "mobx-react-lite";
import { RouteComponentProps } from "react-router-dom";
import agent from "../api/agent";
import { auth } from "../utils/firebase";
import Navigate from "../utils/Navigate";
import { ILogin, IRegister, IUser } from "./types/user.types";

enableStaticRendering(typeof window === "undefined");

export default class UserStore {
  user: IUser | undefined = undefined;
  appLoaded = false;
  isLoading = false;

  constructor() {
    makeAutoObservable(this);
  }

  get isLoggedIn() {
    return !!this.user;
  }

  login = async (login: Pick<ILogin, "email">) => {
    try {
      const result = await agent.AuthService.login(login);
      runInAction(() => {
        this.user = result;
        Navigate?.push("/");
      });
    } catch (error) {
      console.log(error);
    }
  };

  loginGoogle = async (login: Pick<ILogin, "email">) => {
    try {
      const result = await agent.AuthService.loginGoogle(login);
      runInAction(() => {
        this.user = result;

        Navigate?.push("/");
      });
    } catch (error) {
      console.log(error);
    }
  };

  register = async (register: IRegister) => {
    try {
      await agent.AuthService.register(register);
      runInAction(() => {
        Navigate?.push("/login");
      });
    } catch (error) {
      console.log(error);
    }
  };

  getUser = async () => {
    try {
      this.isLoading = true;
      const result = await agent.AuthService.currentUser();
      runInAction(() => {
        this.user = result;
        this.isLoading = false;
      });
    } catch (error) {
      this.isLoading = false;
      console.log(error);
    }
  };

  logout = async () => {
    try {
      await agent.AuthService.logout();

      runInAction(() => {
        this.user = undefined;
        window.localStorage.removeItem("token");

        return Navigate?.push("/login");
      });
    } catch (error) {
      console.log(error);
    }
  };

  setAppLoaded = () => {
    this.appLoaded = true;
  };
}
