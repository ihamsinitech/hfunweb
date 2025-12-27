import React, { useState } from "react";
import "./CyberLogin.css";
import "../../styles/global.css";
import { FiEye, FiEyeOff, FiUser, FiKey } from "react-icons/fi";

const CyberLogin = ({ goToRegister, goToHome, goToForgot }) => {
  const [show, setShow] = useState(false);

  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async () => {
    setError("");

    if (!form.username || !form.password) {
      setError("Please fill in all fields");
      return;
    }

    try {
      // ✅ JWT LOGIN API
      const response = await fetch(
        "http://127.0.0.1:8000/api/jwt/login/",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Invalid credentials");
        return;
      }

      // ✅ STEP 5 — STORE TOKEN & USER
      localStorage.setItem("token", data.access);
      localStorage.setItem("user", JSON.stringify(data.user));

      // ✅ GO TO HOME
      goToHome();
    } catch {
      setError("Backend server not running");
    }
  };

  return (
    <div className="cyber-page">
      {/* 🎥 BACKGROUND VIDEO */}
      <video className="bg-video" autoPlay muted loop playsInline>
        <source src="/videos/bg.mp4" type="video/mp4" />
      </video>

      <div className="cyber-card">
        {/* LEFT */}
        <div className="cyber-left">
          <div className="logo-box">
            <img src="/images/logo.png" alt="HFUN" />
          </div>

          <h1>HFUN</h1>
          <p>Capture. Share. Connect.</p>

          <div className="chip">🌍 Global Vibes</div>
          <div className="chip">🔒 Safe & Secure</div>
          <div className="chip">📸 Reels & Posts</div>
        </div>

        {/* RIGHT */}
        <div className="cyber-right">
          <h2>Login</h2>
          <p className="sub">Access your account</p>

          {error && <p className="error">{error}</p>}

          <div className="input-box floating">
            <FiUser />
            <input
              type="text"
              name="username"
              value={form.username}
              onChange={handleChange}
              placeholder=" "
            />
            <label>Email or Username</label>
          </div>

          <div className="input-box floating">
            <FiKey />
            <input
              type={show ? "text" : "password"}
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder=" "
            />
            <label>Password</label>
            <span onClick={() => setShow(!show)}>
              {show ? <FiEyeOff /> : <FiEye />}
            </span>
          </div>

          <p className="forgot" onClick={goToForgot}>
            Forgot password?
          </p>

          <button className="cyber-btn" onClick={handleLogin}>
            LOGIN
          </button>

          <p className="link">
            New here? <span onClick={goToRegister}>Create Account</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default CyberLogin;
