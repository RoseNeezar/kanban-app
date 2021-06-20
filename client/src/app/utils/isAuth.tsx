import { useEffect } from "react";

const isAuth = () => {
  // const currentUser = useSelector((state: IState) => state.authReducer.user);
  // useEffect(() => {
  //   // dispatch(ACurrentUser());
  // }, []);

  // return { currentUser };
  return { currentUser: true };
};

export default isAuth;
