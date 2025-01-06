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

//------------------React Imports-------------------------
import React, { useContext, useState } from "react";

//------------------App Imports-------------------------
import { StoreContext } from "../../context/StoreContext";
import FoodItem from "../foodItem/FoodItem";
import FoodItemModal from "../foodItem/FoodItemModal";
import "./FoodDisplay.css";

const FoodDisplay = ({ category }) => {
  const { food_list } = useContext(StoreContext);
  const [selectedItem, setSelectedItem] = useState(null);

  const openModal = (item) => setSelectedItem(item);
  const closeModal = () => setSelectedItem(null);

  return (
    <div className="food-display" id="food-display">
      <h2>Our Popular Dishes</h2>
      <div className="food-display-list">
        {food_list.map((item, index) => {
          if (category === "All" || category === item.category) {
            return (
              <FoodItem
                key={index}
                id={item._id}
                name={item.name}
                description={item.description}
                price={item.price}
                image={item.image}
                store={item.store}
                onCardClick={() => openModal(item)}
              />
            );
          }
          return null;
        })}
      </div>

      {selectedItem && (
        <FoodItemModal isOpen={true} onClose={closeModal} item={selectedItem}>
          <div>
            <div className="w-full h-64 overflow-hidden rounded">
              <img
                src={selectedItem.image}
                alt={selectedItem.name}
                className="w-full h-full object-contain"
              />
            </div>
            <h3 className="text-xl font-semibold mt-4">{selectedItem.name}</h3>
            <p className="text-gray-600 mt-2">{selectedItem.description}</p>
            <p className="text-lg font-bold mt-2">{selectedItem.price} LKR</p>
            <p style={{ display: "none" }} className="text-md mt-2">
              {selectedItem.store}
            </p>
          </div>
        </FoodItemModal>
      )}
    </div>
  );
};

export default FoodDisplay;
