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

import React, { useContext } from "react";
import { useLocation } from "react-router-dom"; // Import useLocation hook
import { assets } from "../../assets/assets";
import { StoreContext } from "../../context/StoreContext";
import "./FoodItem.css";

const FoodItemForSearch = () => {
  const { state } = useLocation(); // Access the passed data
  const { id, name, price, description, image } = state || {};
  const { cartItems, addToCart, removeFromCart } = useContext(StoreContext);

  return (
    <div
      className="food-item h-[65vh] md:h-[58vh] overflow-y-scroll scrollbar-hide cursor-pointer"
      onClick={() => onCardClick({ id, name, price, description, image })}
    >
      <div className="food-item-img-container py-2">
        <img
          className="food-item-image object-contain"
          src={image}
          alt={name}
        />
        {cartItems && cartItems[id] === undefined ? (
          <img
            className="add"
            onClick={(e) => {
              e.stopPropagation();
              addToCart(id);
            }}
            src={assets.add_icon_green}
            alt="Add"
          />
        ) : (
          <div className="food-item-counter">
            <img
              className="add-remove"
              onClick={(e) => {
                e.stopPropagation();
                removeFromCart(id);
              }}
              src={assets.remove_icon_red}
              alt="Remove"
            />
            <p>{cartItems?.[id] ?? ""}</p>
            <img
              className="add-remove"
              onClick={(e) => {
                e.stopPropagation();
                addToCart(id);
              }}
              src={assets.add_icon_green}
              alt="Add"
            />
          </div>
        )}
      </div>
      <div className="food-item-info">
        <div className="food-item-name-rating">
          <p>{name}</p>
          <img src={assets.rating_starts} alt="Rating" />
        </div>
        <p className="food-item-desc">{description}</p>
        <p className="food-item-price">{price} LKR</p>
      </div>
    </div>
  );
};

export default FoodItemForSearch;
