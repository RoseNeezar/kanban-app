import React from "react";
import NavActions from "./component/NavActions";

const Navbar = () => {
  return (
    <nav className="fixed top-0 z-50 flex flex-col items-end justify-center w-full max-h-full border-b shadow bg-dark-second md:h-14 border-dark-third">
      <NavActions />
    </nav>
  );
};

export default Navbar;
