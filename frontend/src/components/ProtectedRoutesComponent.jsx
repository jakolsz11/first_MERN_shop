import { Outlet, Navigate } from "react-router-dom";

import axios from "axios";
import { useEffect, useState} from "react";
import LoginPage from "../pages/LoginPage";

const ProtectedRoutesComponent = ({ admin }) => {
  const [isAuth, setIsAuth] = useState();

  useEffect(() => {
    axios.get("/api/get-token").then(data => {
      if(data.data.token){
        setIsAuth(data.data.token);
      }
      return isAuth;
    });
  }, [isAuth]);

  if(isAuth === undefined) return <LoginPage />;

  return isAuth && admin && isAuth !== "admin" ? ( //to do upgrade this
    <Navigate to="/login" />
  ) : isAuth && admin ? (
    <Outlet />
  ) : isAuth && !admin ? (
    <Outlet />
  ) : (
    <Navigate to="/login" />
  )
};

export default ProtectedRoutesComponent;