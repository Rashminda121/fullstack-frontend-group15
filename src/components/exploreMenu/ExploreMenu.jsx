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
import "./ExploreMenu.css";

axios.defaults.baseURL =
  import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";

const ExploreMenu = ({ category, setCategory }) => {
  const [categoryDataList, setCategoryDataList] = useState([]);

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    try {
      const categoryData = await axios.get("/api/admin/listCategory");
      if (categoryData.data.success) {
        setCategoryDataList(categoryData.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="explore-menu" id="explore-menu">
      <h1>Embark on Flavorful Adventures</h1>
      <p className="explore-menu-text">
        Explore our exquisite menu, indulge in flavorful adventures. From
        appetizers to desserts, find satisfaction for every palate. Join us for
        culinary delight!
      </p>
      <div className="explore-menu-list max-w-full overflow-x-scroll scrollbar-hide">
        {categoryDataList.map((item, index) => {
          return (
            <div
              onClick={() =>
                setCategory((prev) => (prev === item.name ? "All" : item.name))
              }
              key={index}
              className="explore-menu-list-item"
            >
              <img
                src={item.image}
                className={
                  category === item.name
                    ? "active-image object-contain"
                    : "object-contain"
                }
                alt=""
              />
              <p className={category === item.name ? "active-name" : ""}>
                {item.name}
              </p>
            </div>
          );
        })}
      </div>
      <hr />
    </div>
  );
};

export default ExploreMenu;
