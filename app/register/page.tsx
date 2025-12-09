"use client";

import { useState } from "react";
import Head from "next/head";
import { FcGoogle } from "react-icons/fc";

import "../../styles/form.css";

export default function AuthPage() {
  const [isSignup, setIsSignup] = useState(false);

  const toggleMode = () => setIsSignup((prev) => !prev);

  const handleGoogleLogin = () => {
    alert("Google login clicked");
  };

  return (
    <div className="min-h-screen body-gradient flex flex-col">
      <Head>
        <title>{isSignup ? "Sign Up - Wishzapp" : "Login - Wishzapp"}</title>
      </Head>

      {/* SIMPLE HEADER (matches your UI) */}
      <header className="w-full px-6 py-4 text-xl font-bold text-blue-600 bg-white shadow-md">
        Wishzapp
      </header>

      {/* MAIN WRAPPER */}
      <main className="authWrapper">
        <div className={`authContainer ${isSignup ? "signupMode" : ""}`}>
          {/* LEFT PANEL */}
          <div className="leftPanel">
            {!isSignup ? (
              <>
                <h1>Welcome Back to ODMART</h1>
              </>
            ) : (
              <>
                <h1>Welcome to ODMART</h1>
              </>
            )}
          </div>

          {/* RIGHT PANEL */}
          <div className="rightPanel">
            <div className="formBox">
              {!isSignup ? (
                <>
                  <h2>Login to Your Account</h2>

                  <form className="form">
                    <input type="email" placeholder="Email" required />
                    <input type="password" placeholder="Password" required />
                    <button type="submit">Login</button>
                  </form>

                  <div className="divider">
                    <span>or</span>
                  </div>

                  <button className="googleBtn" onClick={handleGoogleLogin}>
                    <FcGoogle size={22} className="googleIcon" />
                    Continue with Google
                  </button>

                  <p>
                    Don’t have an account?{" "}
                    <span onClick={toggleMode}>Sign Up</span>
                  </p>
                </>
              ) : (
                <>
                  <h2>Create Account</h2>

                  <form className="form">
                    <input type="text" placeholder="Full Name" required />
                    <input type="email" placeholder="Email" required />
                    <input type="tel" placeholder="Phone Number" required />
                    <input type="password" placeholder="Password" required />
                    <input
                      type="password"
                      placeholder="Confirm Password"
                      required
                    />
                    <button type="submit">Sign Up</button>
                  </form>

                  <div className="divider">
                    <span>or</span>
                  </div>

                  <button className="googleBtn" onClick={handleGoogleLogin}>
                    <FcGoogle size={22} className="googleIcon" />
                    Continue with Google
                  </button>

                  <p>
                    Already have an account?{" "}
                    <span onClick={toggleMode}>Login</span>
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="text-center py-5 text-sm text-gray-500">
        © {new Date().getFullYear()} ODMART. All rights reserved.
      </footer>
    </div>
  );
}
