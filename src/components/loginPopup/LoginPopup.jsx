/*
 * Project Name: Salt & Pepper
 * Group: Group 15
 * University: University of Plymouth
 * Course: BSc (Hons) Software Engineering
 * Author(s): Amarathunga Ruwanthie, Jayamuni Rashminda, Onaliy Jayawardana, Gihan Wipulaguna, Hapuarachchige Hapuarachchi, Waniga Perera
 *
 * Copyright (c) 2024 [Amarathunga Ruwanthie, Jayamuni Rashminda, Onaliy Jayawardana, Gihan Wipulaguna, Hapuarachchige Hapuarachchi, Waniga Perera]. All rights reserved.
 *
 * This code is the property of the authors and may not be reproduced, distributed, or
 * used without permission from the copyright holder(s).
 */

import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { assets } from "../../assets/assets";
import { StoreContext } from "../../context/StoreContext";
import "./LoginPopup.css";

axios.defaults.baseURL =
  import.meta.env.VITE_BACKEND_URL || "http://13.229.205.154:4000";

const LoginPopup = ({ setShowLogin, setCurrentUser }) => {
  const { url, setToken } = useContext(StoreContext);
  const [dataList, setDataList] = useState([]);
  const [currState, setCurrState] = useState("Login");
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [isChecked, setIsChecked] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get("/api/admin/listUsers");
      if (response.data.success) {
        setDataList(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const getUserDetails = (email) => {
    const user = dataList.find((user) => user.email === email);
    if (user) {
      localStorage.setItem("userImage", user.image || "");
      localStorage.setItem("userRole", user.role || "user");

      setCurrentUser({
        email: user.email || "",
        image: user.image || "",
        role: user.role || "user",
      });
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    if (currState === "Sign Up" && data.password !== data.confirmPassword) {
      alert("Passwords do not match.");
      return;
    }
    const endpoint =
      currState === "Login" ? "/api/user/login" : "/api/user/signup";
    try {
      const response = await axios.post(`${url}${endpoint}`, data);
      if (response.data.success) {
        setToken(response.data.token);
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("email", data.email);
        getUserDetails(data.email);
        setShowLogin(false);
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.error("Error during login/signup:", error);
      alert("An error occurred. Please try again.");
    }
  };

  const handleGoogleLoginSuccess = async (credentialResponse) => {
    if (!isChecked) {
      alert("Please agree to the terms of use & privacy policy.");
      return;
    }

    const token = credentialResponse.credential;

    try {
      const response = await axios.post(`${url}/api/user/google-login`, {
        token,
      });

      if (response.data.success) {
        setToken(response.data.token);
        localStorage.setItem("token", response.data.token);
        setShowLogin(false);
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.error("Google Login Error:", error);
      alert("Google Login failed. Please try again.");
    }
  };

  const handleGoogleLoginError = () => {
    alert("Google Login failed. Please try again.");
  };

  return (
    <div className="login-popup" id="login-popup">
      <form onSubmit={handleLogin} className="login-popup-container">
        <div className="login-popup-title">
          <h2>{currState}</h2>
          <img
            className="crossimg"
            onClick={() => setShowLogin(false)}
            src={assets.cross_icon}
            alt="Close"
          />
        </div>
        <div className="login-popup-inputs">
          {currState === "Sign Up" && (
            <input
              name="name"
              onChange={handleInputChange}
              value={data.name}
              type="text"
              placeholder="Name"
              required
            />
          )}
          <input
            name="email"
            onChange={handleInputChange}
            value={data.email}
            type="email"
            placeholder="Email"
            required
          />
          <input
            name="password"
            onChange={handleInputChange}
            value={data.password}
            type="password"
            placeholder="Password"
            required
          />
          {currState === "Sign Up" && (
            <input
              name="confirmPassword"
              onChange={handleInputChange}
              value={data.confirmPassword}
              type="password"
              placeholder="Confirm Password"
              required
            />
          )}
        </div>
        <button type="submit">
          {currState === "Sign Up" ? "Create Account" : "Login"}
        </button>
        <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
          <GoogleLogin
            onSuccess={handleGoogleLoginSuccess}
            onError={handleGoogleLoginError}
          />
        </GoogleOAuthProvider>
        <div className="login-popup-condition">
          <input
            type="checkbox"
            checked={isChecked}
            onChange={() => setIsChecked(!isChecked)}
            required
          />
          <p>
            By continuing, I agree to the{" "}
            <u>
              <a href="/privacy-policy">terms of use & privacy policy</a>
            </u>
            .
          </p>
        </div>
        {currState === "Login" ? (
          <p>
            New to Peppers & Plates?{" "}
            <span onClick={() => setCurrState("Sign Up")}>Click Here</span>
          </p>
        ) : (
          <p>
            Already have an account?{" "}
            <span onClick={() => setCurrState("Login")}>Login Here</span>
          </p>
        )}
      </form>
    </div>
  );
};

export default LoginPopup;
