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

//--------------------React Imports-------------------------
import { useNavigate } from "react-router-dom";
import React, { useContext, useEffect, useState } from "react";

//--------------------Other Imports-------------------------
import axios from "axios";

//--------------------App Imports-------------------------
import { StoreContext } from "../../context/StoreContext";
import "./Order.css";

const Order = () => {
  const { getTotalCartAmount, token, food_list, cartItems, url } =
    useContext(StoreContext);
  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
    phone: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    if (!token || getTotalCartAmount() === 0) {
      navigate("/cart");
    }
  }, [token]);

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setData((prevData) => ({ ...prevData, [name]: value }));
  };

  const placeOrder = async (event) => {
    event.preventDefault();
    const orderItems = food_list
      .filter((item) => cartItems[item._id] > 0)
      .map((item) => ({
        ...item,
        quantity: cartItems[item._id],
      }));

    const orderData = {
      items: orderItems,
      address: {
        delivery: {
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          street: data.street,
          city: data.city,
          state: data.state,
          zipcode: data.zipcode,
          country: data.country,
          phone: data.phone,
        },
      },
      amount: getTotalCartAmount() + 200,
    };

    try {
      const response = await axios.post(`${url}/api/order/place`, orderData, {
        headers: { token },
      });
      if (response.data.success) {
        window.location.href = response.data.session_url;
      }
    } catch (error) {
      console.error(error);
      alert("Error processing your order. Please try again.");
    }
  };

  return (
    <form onSubmit={placeOrder} className="place-order">
      <div className="place-order-left">
        <p className="title">Delivery Information</p>
        <div className="multi-fields">
          <input
            required
            name="firstName"
            onChange={onChangeHandler}
            value={data.firstName}
            type="text"
            placeholder="   First Name"
          />
          <input
            required
            name="lastName"
            onChange={onChangeHandler}
            value={data.lastName}
            type="text"
            placeholder="   Last Name"
          />
        </div>
        <input
          required
          name="email"
          onChange={onChangeHandler}
          value={data.email}
          type="email"
          placeholder="   Email"
        />
        <input
          required
          name="street"
          onChange={onChangeHandler}
          value={data.street}
          type="text"
          placeholder="   Street"
        />
        <div className="multi-fields">
          <input
            required
            name="city"
            onChange={onChangeHandler}
            value={data.city}
            type="text"
            placeholder="   City"
          />
          <input
            required
            name="state"
            onChange={onChangeHandler}
            value={data.state}
            type="text"
            placeholder="   State"
          />
        </div>
        <div className="multi-fields">
          <input
            required
            name="zipcode"
            onChange={onChangeHandler}
            value={data.zipcode}
            type="text"
            placeholder="   Zip Code"
          />
          <input
            required
            name="country"
            onChange={onChangeHandler}
            value={data.country}
            type="text"
            placeholder="   Country"
          />
        </div>
        <input
          required
          name="phone"
          onChange={onChangeHandler}
          value={data.phone}
          type="text"
          placeholder="   Phone"
        />
      </div>
      <div className="place-order-right">
        <div className="cart-total">
          <h2>Your Order</h2>
          <div>
            <div className="cart-total-details">
              <p>Subtotal</p>
              <p>{getTotalCartAmount()} LKR</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p>Delivery Fee</p>
              <p>{getTotalCartAmount() === 0 ? 0 : 200} LKR</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p>Total</p>
              <p>
                {getTotalCartAmount() === 0 ? 0 : getTotalCartAmount() + 200}{" "}
                LKR
              </p>
            </div>
          </div>
          <button type="submit">PROCEED TO PAYMENT</button>
        </div>
      </div>
    </form>
  );
};

export default Order;
