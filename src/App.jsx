import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Home from "./Components/Home";
import Login from "./Components/Login";
import Navbar from "./Components/Navbar";
import Register from "./Components/Register";
import NotFound from "./Components/NotFound";
import jwt_decode from "jwt-decode";
import { useEffect, useState, useCallback } from "react";
import Paticle from "./Components/Particles";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function App() {
  function notify(message, type) {
    if (type === "success") {
      toast.success(message, {
        position: "top-right",
      });
    } else if (type === "error") {
      toast.error(message, {
        position: "top-right",
      });
    } else if (type === "info") {
      toast.info(message, {
        position: "top-right",
      });
    }
  }

  let [userToken, setUserToken] = useState("");
  let navigate = useNavigate();

  function saveUserData() {
    const Token = localStorage.getItem("userToken");
    const decoded = jwt_decode(Token);
    setUserToken(decoded);
  }

  function ProtectionRoutes(props) {
    if (localStorage.getItem("userToken")) {
      return props.children;
    } else {
      return <Navigate to="/login" />;
    }
  }

  function ProtectionLogin(props) {
    if (localStorage.getItem("userToken")) {
      return <Navigate to="/" />;
    } else {
      return props.children;
    }
  }

  function logout() {
    setUserToken("");
    localStorage.removeItem("userToken");
    navigate("/login");
  }

  const noti = useCallback(() => {
    if (localStorage.getItem("userToken")) {
      notify("Login Successfully", "success");
    }
  }, [localStorage]);

  useEffect(() => {
    if (localStorage.getItem("userToken")) {
      saveUserData();
    }
  }, []);

  return (
    <>
      <Navbar userToken={userToken} logout={logout} />
      <Routes>
        <Route
          path="/"
          element={
            <ProtectionRoutes>
              <Home userToken={userToken} />
            </ProtectionRoutes>
          }
        />
        <Route
          path="/login"
          element={
            <ProtectionLogin>
              <Login saveUserData={saveUserData} noti={noti} />
            </ProtectionLogin>
          }
        />
        <Route
          path="/register"
          element={
            <ProtectionLogin>
              <Register />
            </ProtectionLogin>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Paticle />
      <ToastContainer />
    </>
  );
}
