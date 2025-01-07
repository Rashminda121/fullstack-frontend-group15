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

import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const NavbarAdmin = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const toggleMenu = () => setMenuOpen(!menuOpen);

  const menuItems = [
    { name: "Home", path: "/admin" },
    { name: "Items", path: "/src/admin/pages/Items.jsx" },
    { name: "Categories", path: "/admin/categoriesPage" },
    { name: "Orders", path: "/admin/ordersPage" },
    { name: "Offers", path: "/admin/offersPage" },
    { name: "Users", path: "/admin/usersPage" },
    { name: "Requests", path: "/admin/requestsPage" },
  ];

  return (
    <nav className="bg-white border-gray-200">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <a href="/" className="flex items-center space-x-3 rtl:space-x-reverse">
          <img src={"/storelogo.png"} className="h-14 md:h-16" alt="Logo" />
          <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-black hidden">
            Ecommerce
          </span>
        </a>
        <div className="flex md:order-2">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="hidden md:block text-white bg-gray-700 hover:bg-gray-800 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-4 py-2 text-center dark:bg-gray-700 dark:hover:bg-gray-800 dark:focus:ring-gray-800"
          >
            User View
          </button>
          <button
            type="button"
            className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
            aria-controls="navbar-cta"
            aria-expanded={menuOpen}
            onClick={toggleMenu}
          >
            <span className="sr-only">Toggle menu</span>
            <svg
              className="w-5 h-5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 17 14"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M1 1h15M1 7h15M1 13h15"
              />
            </svg>
          </button>
        </div>
        <div
          className={`w-full md:flex md:w-auto md:order-1 ${
            menuOpen ? "block" : "hidden"
          }`}
          id="navbar-cta"
        >
          <ul className="flex flex-col font-medium p-4 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 md:flex-row md:mt-0 md:border-0 md:bg-white dark:border-gray-700">
            {menuItems.map((item) => (
              <li key={item.path}>
                <a
                  href={item.path}
                  className={`block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 hover:text-white md:hover:bg-transparent md:hover:text-white dark:text-black dark:hover:bg-gray-700 md:dark:hover:text-white ${
                    location.pathname === item.path
                      ? "border-b-2 border-gray-800"
                      : ""
                  }`}
                >
                  {item.name}
                </a>
              </li>
            ))}
            <li className="mt-3 md:hidden">
              <button
                type="button"
                onClick={() => navigate("/")}
                className="w-full text-white bg-gray-900 hover:bg-gray-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center dark:bg-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-800"
              >
                User View
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default NavbarAdmin;
