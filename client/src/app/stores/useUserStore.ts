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
      login: async (login: Pick<ILogin, "email">) => {
        try {
          const result = await agent.AuthService.login(login);
          set((s) => {
            s.user = result;
            Navigate?.push("/");
          });
        } catch (error) {}
      },
      loginGoogle: async (login: Pick<ILogin, "email">) => {
        try {
          const result = await agent.AuthService.loginGoogle(login);
          set((s) => {
            s.user = result;
            Navigate?.push("/");
          });
        } catch (error) {}
      },
      register: async (register: IRegister) => {
        try {
          await agent.AuthService.register(register);

          Navigate?.push("/login");
        } catch (error) {
          console.log(error);
        }
      },
      getUser: async () => {
        set(async (s) => {
          try {
            s.isLoading = true;
            const result = await agent.AuthService.currentUser();
            s.user = result;
            s.isLoading = false;
          } catch (error) {
            s.isLoading = false;
          }
        });
      },
      logout: async () => {
        try {
          await agent.AuthService.logout();
          set((s) => {
            s.user = undefined;
            window.localStorage.removeItem("token");
            Navigate?.push("/login");
          });
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
