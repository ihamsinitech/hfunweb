import React, { useState } from "react";
import "./CyberLogin.css";
import { FiUser, FiKey, FiEye, FiEyeOff } from "react-icons/fi";

const ForgotPassword = ({ goToLogin }) => {
  const [show1, setShow1] = useState(false);
  const [show2, setShow2] = useState(false);

  const [form, setForm] = useState({
    username: "",
    password: "",
    confirm: "",
  });

  const [error, setError] = useState("");
  const [msg, setMsg] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const resetPassword = async () => {
    setError("");
    setMsg("");

    if (!form.username || !form.password || !form.confirm) {
      setError("All fields are required");
      return;
    }

    if (form.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    if (form.password !== form.confirm) {
      setError("Passwords do not match");
      return;
    }

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/accounts/reset-password/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: form.username,
            password: form.password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Reset failed");
      } else {
        setMsg("Password updated successfully");
        setTimeout(() => goToLogin(), 1500);
      }
    } catch {
      setError("Server not responding");
    }
  };

  return (
    <div className="cyber-page">
      <div className="cyber-card forgot-card">
        <div className="cyber-right forgot-right">
          <h2>Reset Password</h2>
          <p className="sub">Create a new password for your account</p>

          {error && <p className="error">{error}</p>}
          {msg && <p className="info">{msg}</p>}

          {/* USERNAME / EMAIL */}
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

          {/* NEW PASSWORD */}
          <div className="input-box floating">
            <FiKey />
            <input
              type={show1 ? "text" : "password"}
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder=" "
              autoComplete="new-password"
            />
            <label>New Password</label>
            <span onClick={() => setShow1(!show1)}>
              {show1 ? <FiEyeOff /> : <FiEye />}
            </span>
          </div>

          {/* CONFIRM PASSWORD */}
          <div className="input-box floating">
            <FiKey />
            <input
              type={show2 ? "text" : "password"}
              name="confirm"
              value={form.confirm}
              onChange={handleChange}
              placeholder=" "
              autoComplete="new-password"
            />
            <label>Confirm Password</label>
            <span onClick={() => setShow2(!show2)}>
              {show2 ? <FiEyeOff /> : <FiEye />}
            </span>
          </div>

          <button className="cyber-btn alt" onClick={resetPassword}>
            Update Password
          </button>

          <p className="link back" onClick={goToLogin}>
            Back to Login
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
