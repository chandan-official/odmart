/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import Head from "next/head";
import { API } from "../../lib/api";
import "../../styles/form.css"; // Ensures the new premium CSS is loaded
import { useRouter } from "next/navigation";

export default function AuthPage() {
  const [isSignup, setIsSignup] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const router = useRouter();

  const toggleMode = () => setIsSignup((prev) => !prev);

  const handleChange = (e: { target: { name: any; value: any } }) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();

    // Check passwords only for signup
    if (isSignup && formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const endpoint = isSignup ? "/auth/register" : "/auth/login";

      // FIX — Send only required fields
      const payload = isSignup
        ? {
            name: formData.fullName,
            email: formData.email,
            phone: formData.phone,
            password: formData.password,
          }
        : {
            email: formData.email,
            password: formData.password,
          };

      const res = await API.post(endpoint, payload);
      if (res.data.token) {
        localStorage.setItem("authToken", res.data.token);
      } else {
        localStorage.setItem("isLoggedIn", "true");
      }

      console.log(res.data);
      alert(res.data.message || "Success");
      setIsLoggedIn(true);
      router.push("/");
    } catch (err: any) {
      let message = "An unexpected error occurred";

      if (err?.response?.data?.message) {
        message = err.response.data.message;
      } else if (err?.message) {
        message = err.message;
      }

      alert(message);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Head>
        <title>{isSignup ? "Sign Up - ODMART" : "Login - ODMART"}</title>
      </Head>

      {/* Main Auth Wrapper - Centers the Glass Card */}
      <main className="authWrapper">
        <div className={`authContainer ${isSignup ? "signupMode" : ""}`}>
          
          {/* Left Panel: The Blue Gradient Welcome Side */}
          <div className="leftPanel">
            <h1>{isSignup ? "Join the Future" : "Welcome Back"}</h1>
          </div>

          {/* Right Panel: The Dark Form Side */}
          <div className="rightPanel">
            <div className="formBox">
              <h2 style={{ marginBottom: "24px", fontSize: "1.5rem", fontWeight: "600" }}>
                {isSignup ? "Create Account" : "Sign In"}
              </h2>
              
              <form className="form" onSubmit={handleSubmit}>
                {isSignup && (
                  <>
                    <input
                      type="text"
                      name="fullName"
                      placeholder="Full Name"
                      value={formData.fullName}
                      onChange={handleChange}
                      required
                    />

                    <input
                      type="tel"
                      name="phone"
                      placeholder="Phone Number"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                    />
                  </>
                )}

                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />

                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />

                {isSignup && (
                  <input
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm Password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                )}

                <button type="submit">{isSignup ? "Sign Up" : "Login"}</button>
              </form>

              <p>
                {isSignup
                  ? "Already have an account? "
                  : "Don’t have an account? "}
                <span
                  onClick={toggleMode}
                  style={{ 
                    cursor: "pointer", 
                    color: "var(--primary)", /* Uses the global theme blue */
                    fontWeight: "bold" 
                  }}
                >
                  {isSignup ? "Login" : "Sign Up"}
                </span>
              </p>
            </div>
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="text-center py-5 text-sm" style={{ color: "var(--text-muted)" }}>
        © {new Date().getFullYear()} ODMART. All rights reserved.
      </footer>
    </div>
  );
}