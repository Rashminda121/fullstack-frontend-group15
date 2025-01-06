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

import React from "react";
import "./Header.css";

const Header = () => {
  return (
    <div className="header h-[50vw] md:h-[37vw]">
      <div className="header-contents">
        <h2>Order tasty food from Peppers & Plates</h2>
        <p>
          Savor the exquisite flavors of Peppers & Plates! Our menu features a
          delightful selection of dishes crafted with care and expertise. From
          appetizers to desserts, each bite promises culinary satisfaction.
          Order now and treat yourself to a delicious dining experience with
          Peppers & Plates!
        </p>
        <button className="mt-2 md:mt-0 text-xs md:text-base">View More</button>
      </div>
    </div>
  );
};

export default Header;
