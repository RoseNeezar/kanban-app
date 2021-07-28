import { useRouter } from "next/dist/client/router";
import React, { useCallback } from "react";
import { useUserStore } from "../../../stores/useUserStore";
import { auth } from "../../../utils/firebase";

const NavActions = () => {
  const router = useRouter();

  const { logout, user } = useUserStore(
    useCallback(
      (state) => ({
        logout: state.logout,
        user: state.user,
      }),
      []
    )
  );
  const handleLogout = async () => {
    await auth.signOut();
    await logout(router);
  };
  return (
    <>
      <ul className="flex items-center justify-center mx-4">
        <li>
          <p className="text-dark-txt">{user?.email}</p>
        </li>
        <li>
          <div
            className="relative grid p-2 mx-1 ml-5 text-xl rounded-full cursor-pointer bg-dark-third text-dark-txt hover:bg-gray-300"
            id="dark-mode-toggle"
            onClick={() => handleLogout()}
          >
            <i className="bx bx-power-off"></i>
          </div>
        </li>
      </ul>
    </>
  );
};

export default NavActions;
