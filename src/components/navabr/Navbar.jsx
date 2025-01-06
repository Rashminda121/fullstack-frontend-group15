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

import axios from "axios";
import { jwtDecode } from "jwt-decode";
import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { assets } from "../../assets/assets";
import { StoreContext } from "../../context/StoreContext";

import { FaRegCommentDots, FaUserCircle } from "react-icons/fa";
import "./Navbar.css";

const Navbar = ({ setShowLogin, setCurrentUser, currentUser }) => {
  const [menu, setMenu] = useState("Home");
  const [role, setRole] = useState("");
  const { getTotalCartAmount, token, setToken } = useContext(StoreContext);
  const navigate = useNavigate();

  const userDetails = currentUser || {};

  // Fetch and decode JWT token
  useEffect(() => {
    if (token) {
      const decoded = jwtDecode(token);
      axios
        .get(`/api/user/role/${decoded.id}`)
        .then((response) => {
          setRole(response.data.role);
        })
        .catch((error) => {
          console.error("Error fetching role:", error);
        });
    }
  }, [token]);

  const logout = () => {
    localStorage.clear();

    setToken("");
    setRole("");
    setCurrentUser({ email: "", image: "", role: "" });
    navigate("/");
  };

  return (
    <div className="navbar">
      <img src={assets.logo} alt="Logo" className="logo object-contain" />
      <ul className="navbar-menu">
        <Link
          to="/"
          onClick={() => setMenu("Home")}
          className={menu === "Home" ? "active" : ""}
        >
          Home
        </Link>
        <a
          href="/#explore-menu"
          onClick={() => setMenu("Menu")}
          className={menu === "Menu" ? "active" : ""}
        >
          Menu
        </a>
        <a
          href="/#storeOffers"
          onClick={() => setMenu("Offers")}
          className={menu === "Offers" ? "active" : ""}
        >
          Offers
        </a>
        <a
          href="footer"
          onClick={() => setMenu("Contact-Us")}
          className={menu === "Contact-Us" ? "active" : ""}
        >
          Contact Us
        </a>
        {role === "admin" && (
          <Link to="/admin" className="navbar-link">
            Admin Dashboard
          </Link>
        )}
        {role === "store" && (
          <Link to="/store" className="navbar-link">
            Store Dashboard
          </Link>
        )}
      </ul>
      <div className="navbar-right">
        <Link to="/food-search">
          <img
            src={assets.search_icon}
            alt="Search Icon"
            className="search_icon"
          />
        </Link>
        <div className="navbar-search-icon">
          <Link to="/cart">
            <img
              src={assets.basket_icon}
              alt="Cart Icon"
              className="basket_icon"
            />
          </Link>
          <div className={getTotalCartAmount() === 0 ? "" : "dot"}></div>
        </div>
        {!token ? (
          <button onClick={() => setShowLogin(true)}>Sign In</button>
        ) : (
          <div className="navbar-profile">
            <img
              className="profile_img p-0 md:p-[5px] w-5 md:w-10 border-2 border-gray-700 rounded-full object-contain hover:scale-105"
              src={userDetails.image || assets.profile_icon}
              alt="User Profile"
            />
            <ul className="nav-profile-dropdown w-[120px] md:w-[150px]">
              <li onClick={() => navigate("/profile")}>
                <FaUserCircle className="profile_bag" size={18} />
                <p>Profile</p>
              </li>
              <li onClick={() => navigate("/myorders")}>
                <img className="profile_bag" src={assets.bag_icon} alt="" />
                <p>Orders</p>
              </li>
              <li onClick={() => navigate("/reviews")}>
                <FaRegCommentDots className="profile_bag" size={18} />
                <p>Reviews</p>
              </li>
              <hr />
              <li onClick={logout}>
                <img className="profile_img" src={assets.logout_icon} alt="" />
                <p>Logout</p>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
