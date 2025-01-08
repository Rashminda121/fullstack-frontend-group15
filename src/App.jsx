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

import { gapi } from "gapi-script";
import React, { useEffect, useState } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import AdminPage from "./admin/Admin";
import CategoriesPage from "./admin/pages/Categories";
import ItemsPage from "./admin/pages/Items";
import OffersPage from "./admin/pages/OffersAdmin";
import OrdersPage from "./admin/pages/OrdersAdmin";
import UsersPage from "./admin/pages/UsersAdmin";
import FoodItemForSearch from "./components/foodItem/FoodItemForSearch";
import Footer from "./components/footer/Footer";
import LoginPopup from "./components/loginPopup/LoginPopup";
import Navbar from "./components/navabr/Navbar";
import FoodSearch from "./components/searchItem/SearchItem";
import AboutUs from "./pages/aboutUs/AboutUs";
import Cart from "./pages/cart/Cart";
import Home from "./pages/home/Home";
import MyOrders from "./pages/myorders/MyOrders";
import Order from "./pages/placeOrder/Order";
import PrivacyPolicy from "./pages/privacyPolicy/PrivacyPolicy";
import UserProfile from "./pages/profile/UserProfile";
import UserReview from "./pages/reviews/UserReview";
import Verify from "./pages/verify/Verify";
import StorePage from "./store/Store";
import Chats from "./store/pages/Chats";
import Orders from "./store/pages/Orders";
import RequestsPage from "./admin/pages/Requests";
import Items from "./store/pages/Items";
import Offers from "./store/pages/Offers";

const App = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [currentUser, setCurrentUser] = useState({
    email: "",
    image: "",
    role: "",
  });

  const location = useLocation();
  const isAdminPage = location.pathname.includes("admin");
  const isStorePage = location.pathname.includes("store");

  useEffect(() => {
    // Initialize Google API client
    function start() {
      gapi.client.init({
        clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID,
        scope: "",
      });
    }
    gapi.load("client:auth2", start);

    // Load user data from localStorage
    const storedEmail = localStorage.getItem("email");
    const storedImage = localStorage.getItem("userImage");
    const storedRole = localStorage.getItem("userRole");

    if (storedEmail) {
      setCurrentUser({
        email: storedEmail,
        image: storedImage,
        role: storedRole,
      });
    }
  }, []);

  return (
    <>
      {showLogin && (
        <LoginPopup
          setShowLogin={setShowLogin}
          setCurrentUser={setCurrentUser}
        />
      )}
      <div className="app">
        {!isAdminPage && !isStorePage && (
          <Navbar
            setShowLogin={setShowLogin}
            setCurrentUser={setCurrentUser}
            currentUser={currentUser}
          />
        )}

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/order" element={<Order />} />
          <Route path="/verify" element={<Verify />} />
          <Route path="/myorders" element={<MyOrders />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/reviews" element={<UserReview />} />
          <Route path="/store" element={<StorePage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/admin/itemsPage" element={<ItemsPage />} />
          <Route path="/admin/categoriesPage" element={<CategoriesPage />} />
          <Route path="/admin/ordersPage" element={<OrdersPage />} />
          <Route path="/admin/usersPage" element={<UsersPage />} />
          <Route path="/admin/offersPage" element={<OffersPage />} />
          <Route path="/admin/requestsPage" element={<RequestsPage />} />
          <Route path="/store/chats" element={<Chats />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/store/orders" element={<Orders />} />
          <Route path="/food-search" element={<FoodSearch />} />
          <Route path="/food-item/:id" element={<FoodItemForSearch />} />
          <Route path="/store/items" element={<Items />} />
          <Route path="/store/offers" element={<Offers />} />
        </Routes>
      </div>
      <Footer />
    </>
  );
};

export default App;
