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
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate hook
import "./SearchItem.css";

const FoodSearch = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [foodItems, setFoodItems] = useState([]);
  const [error, setError] = useState("");

  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const navigate = useNavigate();

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Fetch search results from the backend
  const fetchFoodItems = async () => {
    try {
      const response = await axios.get(
        `${backendUrl}/api/food/list?search=${searchQuery}`
      );
      setFoodItems(response.data.data);
    } catch (err) {
      setError("Error fetching food items");
      console.error(err);
    }
  };

  // Trigger search when the search query changes
  useEffect(() => {
    if (searchQuery) {
      fetchFoodItems();
    } else {
      setFoodItems([]);
    }
  }, [searchQuery]);

  // Handle item click to navigate to FoodItem page
  const handleItemClick = (id, name, price, description, image) => {
    navigate(`/food-item/${id}`, {
      state: { id, name, price, description, image },
    });
  };

  return (
    <div className="food-search-container">
      <h2 className="search-title">Search Food Items</h2>
      <div className="search-input-container">
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearchChange}
          className="search-input"
          placeholder="Search food items"
        />
        <button onClick={fetchFoodItems} className="search-button">
          Search
        </button>
      </div>

      {error && <p className="error-message">{error}</p>}

      <div className="food-items-list">
        {foodItems.length > 0 ? (
          <ul>
            {foodItems.map((food) => (
              <li
                key={food._id}
                className="food-item"
                onClick={() =>
                  handleItemClick(
                    food._id,
                    food.name,
                    food.price,
                    food.description,
                    food.image
                  )
                } // Navigate on item click
              >
                <h3 className="food-name">{food.name}</h3>
              </li>
            ))}
          </ul>
        ) : (
          searchQuery && <p>No food items found</p>
        )}
      </div>
    </div>
  );
};

export default FoodSearch;
