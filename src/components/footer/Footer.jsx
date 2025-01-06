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
import { assets } from "../../assets/assets";
import "./Footer.css";

const Footer = () => {
  const handleMenuClick = () => {
    window.location.href = "/#explore-menu";
  };

  const handleHomeClick = () => {
    window.location.href = "/";
  };

  const handleAboutUsClick = () => {
    window.location.href = "/about";
  };

  const handleOffersClick = () => {
    window.location.href = "/#storeOffers";
  };

  const handlePrivacyPolicyClick = () => {
    window.location.href = "/privacy-policy";
  };

  return (
    <div className="footer" id="footer">
      <div className="footer-content">
        <div className="footer-content-left">
          <img src={assets.logo_white} alt="" className="logo" />
          <p className="contentp">
            Enjoy the exquisite flavors at Peppers & Plates! Our menu offers a
            variety of delicious dishes, from appetizers to desserts. Order now
            for a delightful dining experience!
          </p>
          <div className="footer-social-icons">
            <img src={assets.facebook_icon} alt="" className="facebook" />
            <img src={assets.twitter_icon} alt="" className="twitter" />
            <img src={assets.linkedin_icon} alt="" className="likedin" />
          </div>
        </div>
        <div className="footer-content-center">
          <h2>Company</h2>
          <ul>
            <li>
              <a href="#" onClick={handleHomeClick}>
                Home
              </a>
            </li>
            <li>
              <a href="#" onClick={handleAboutUsClick}>
                About Us
              </a>
            </li>
            <li>
              <a href="#" onClick={handleMenuClick}>
                Menu
              </a>
            </li>
            <li>
              <a href="#" onClick={handleOffersClick}>
                Offers
              </a>
            </li>
            <li>
              <a href="#" onClick={handlePrivacyPolicyClick}>
                Privacy Policy
              </a>
            </li>
          </ul>
        </div>
        <div className="footer-content-right">
          <h2>Get In Touch</h2>
          <ul>
            <li>+94 70 124 4832</li>
            <li>contact@saltandpeppers.com</li>
          </ul>
        </div>
      </div>
      <hr />
      <p className="footer-copyright">
        Copyright 2024 © saltandpeppers.com - All Right Reserved.
      </p>
    </div>
  );
};

export default Footer;
