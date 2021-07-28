import { NextRouter } from "next/dist/client/router";
import create from "zustand";
import agent from "../api/agent";
import Navigate from "../utils/Navigate";
import { combineAndImmer } from "./types/combineAndImmer";
import { ILogin, IRegister, IUser } from "./types/user.types";

export const useUserStore = create(
  combineAndImmer(
    {
      user: undefined as IUser | undefined,
      appLoaded: false,
      isLoading: false,
    },
    (set, get) => ({
      isLoggedIn: () => !!get().user,
      login: async (login: Pick<ILogin, "email">, router: NextRouter) => {
        try {
          const result = await agent.AuthService.login(login);
          set((s) => {
            s.user = result;
          });
          router.push("/app/kanban");
        } catch (error) {}
      },
      loginGoogle: async (login: Pick<ILogin, "email">, router: NextRouter) => {
        try {
          const result = await agent.AuthService.loginGoogle(login);
          set((s) => {
            s.user = result;
          });
          router.push("/app/kanban");
        } catch (error) {}
      },
      register: async (register: IRegister, router: NextRouter) => {
        try {
          await agent.AuthService.register(register);
          router.push("/login");
        } catch (error) {
          console.log(error);
        }
      },
      getUser: async () => {
        try {
          const result = await agent.AuthService.currentUser();
          set((s) => {
            s.user = result;
          });
        } catch (error) {}
      },
      logout: async (router: NextRouter) => {
        try {
          await agent.AuthService.logout();
          set((s) => {
            s.user = undefined;
          });
          window.localStorage.removeItem("token");
          router.push("/");
        } catch (error) {}
      },
      setAppLoaded: () => {
        set((s) => {
          s.appLoaded = true;
        });
      },
    })
  )
);
