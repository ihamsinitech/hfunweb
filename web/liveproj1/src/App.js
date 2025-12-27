import React, { useEffect, useState } from "react";

import IntroVideo from "./components/IntroVideo";
import CyberLogin from "./components/cyber/CyberLogin";
import ForgotPassword from "./components/cyber/ForgotPassword";
import Register from "./components/auth/Register";
import Home from "./home/Home";

import "./App.css";

function App() {
  const [showIntro, setShowIntro] = useState(true);
  const [page, setPage] = useState("login");

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowIntro(false);
    }, 4200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {showIntro && <IntroVideo />}

      {!showIntro && page === "login" && (
        <CyberLogin
          goToRegister={() => setPage("register")}
          goToHome={() => setPage("home")}
          goToForgot={() => setPage("forgot")}
        />
      )}

      {!showIntro && page === "forgot" && (
        <ForgotPassword goToLogin={() => setPage("login")} />
      )}

      {!showIntro && page === "register" && (
        <Register
          goToLogin={() => setPage("login")}
          goToHome={() => setPage("home")}
        />
      )}

      {!showIntro && page === "home" && <Home />}
    </>
  );
}

export default App;
