// src/components/auth/Register.js
import React, { useEffect, useState } from "react";
import "./Auth.css";
import "../../styles/global.css";

const Register = ({ goToLogin, goToHome }) => {
  const [showForm, setShowForm] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    username: "",        // ✅ ADDED
    email: "",
    password: "",
    confirm: "",
    agree: false,
  });

  // Intro animation delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowForm(true);
    }, 2200);
    return () => clearTimeout(timer);
  }, []);

  // Handle input change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // 🔥 REGISTER → DJANGO BACKEND
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirm) {
      alert("Passwords do not match");
      return;
    }

    if (!form.agree) {
      alert("Please accept Terms & Conditions");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/accounts/register/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: form.name,
            username: form.username,   // ✅ SEND USERNAME
            email: form.email,
            password: form.password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || data.error) {
        alert(data.error || "Registration failed");
        return;
      }

      // OPTIONAL: store user
      localStorage.setItem("user", JSON.stringify(data));

      // SUCCESS
      setShowWelcome(true);

      setTimeout(() => {
        if (goToHome) {
          goToHome();
        }
      }, 3000);

    } catch (error) {
      console.error(error);
      alert("Backend server not running");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {showWelcome && (
        <div className="welcome-overlay">
          <video
            src="/videos/welcome.mp4"
            autoPlay
            muted
            playsInline
            className="welcome-video"
          />
          <h2 className="welcome-text">Welcome to HFUN 🚀</h2>
          <p className="welcome-subtext">Redirecting to home...</p>
        </div>
      )}

      {!showWelcome && (
        <div
          className="auth-page page-transition"
          style={{
            backgroundImage: `
              linear-gradient(rgba(15,32,39,0.75), rgba(15,32,39,0.85)),
              url(${process.env.PUBLIC_URL}/images/register-bg.jpg)
            `,
          }}
        >
          <div className="auth-card global">
            {!showForm && (
              <div className="intro">
                <img
                  src="/images/logo.png"
                  alt="HFUN"
                  className="intro-img"
                />
                <h2>Preparing your experience…</h2>
                <p>Just a moment ✨</p>
              </div>
            )}

            {showForm && (
              <div className="form-wrapper">
                <h2>Create Account</h2>
                <p className="subtitle">Join the next-gen platform</p>

                <form onSubmit={handleSubmit}>
                  <div className="input-group floating">
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder=" "
                      required
                    />
                    <label>Full Name</label>
                  </div>

                  {/* ✅ USERNAME FIELD */}
                  <div className="input-group floating">
                    <input
                      type="text"
                      name="username"
                      value={form.username}
                      onChange={handleChange}
                      placeholder=" "
                      required
                    />
                    <label>Username</label>
                  </div>

                  <div className="input-group floating">
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder=" "
                      required
                    />
                    <label>Email</label>
                  </div>

                  <div className="input-group floating">
                    <input
                      type="password"
                      name="password"
                      value={form.password}
                      onChange={handleChange}
                      placeholder=" "
                      required
                    />
                    <label>Password</label>
                  </div>

                  <div className="input-group floating">
                    <input
                      type="password"
                      name="confirm"
                      value={form.confirm}
                      onChange={handleChange}
                      placeholder=" "
                      required
                    />
                    <label>Confirm Password</label>
                  </div>

                  <label className="terms">
                    <input
                      type="checkbox"
                      name="agree"
                      checked={form.agree}
                      onChange={handleChange}
                    />
                    <span>I agree to Terms & Conditions</span>
                  </label>

                  <button
                    type="submit"
                    disabled={!form.agree || isLoading}
                    className={isLoading ? "loading" : ""}
                  >
                    {isLoading ? "Creating Account..." : "Create Account"}
                  </button>
                </form>

                <p className="link">
                  Already have an account?
                  <span onClick={goToLogin}> Login</span>
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Register;
