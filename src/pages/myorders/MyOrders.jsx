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
import React, { useContext, useEffect, useState } from "react";

//--------------------App Imports-------------------------
import { assets } from "../../assets/assets";
import { StoreContext } from "../../context/StoreContext";
import "./MyOrders.css";

//--------------------Other Imports-------------------------
import axios from "axios";
import { FiClock, FiEdit, FiMessageCircle } from "react-icons/fi";

const MyOrders = () => {
  const { url, token } = useContext(StoreContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);
  const [items, setItems] = useState([]);
  const [updatedAddress, setUpdatedAddress] = useState({
    street: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
  });

  // Fetch orders
  const fetchOrders = async () => {
    try {
      const response = await axios.post(
        `${url}/api/order/userorders`,
        {},
        { headers: { token } }
      );
      setItems(response.data.data);
      console.log(response.data.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  useEffect(() => {
    if (token) fetchOrders();
  }, [token]);

  const openModal = (order) => {
    setEditingOrder(order);
    if (order.address && order.address.delivery) {
      setUpdatedAddress(order.address.delivery);
    } else {
      setUpdatedAddress({
        street: "",
        city: "",
        state: "",
        zipcode: "",
        country: "",
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingOrder(null);
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setUpdatedAddress({ ...updatedAddress, [name]: value });
  };

  const handleUpdateAddress = async () => {
    try {
      console.log("editingOrder", editingOrder);
      const response = await axios.put(
        `${url}/api/order/update-address/${editingOrder.orderId}`,
        { address: updatedAddress },
        { headers: { token } }
      );

      if (response.data.success) {
        alert("Address updated successfully!");
        fetchOrders();
        closeModal();
      } else {
        alert("Failed to update the address. Please try again.");
      }
    } catch (error) {
      console.error("Error updating address:", error);
      alert("An error occurred while updating the address.");
    }
  };

  return (
    <div className="my-orders">
      <h2 className="text-base md:text-xl font-medium mb-2 text-gray-800 relative inline-block after:content-[''] after:block after:mt-1 after:h-1 after:w-full after:bg-gradient-to-r after:from-gray-700 after:to-gray-200">
        My Orders
      </h2>
      <div className="container">
        {items.length > 0 ? (
          items.map((item, index) => (
            <div key={index} className="my-orders-order">
              <img className="parcel-img" src={assets.parcel_icon} alt="" />
              <p>
                {item.name} x {item.quantity}
              </p>
              <p>{item.price}.00 LKR</p>
              <p></p>
              <p>
                <span>&#9679;</span> <b>{item.status}</b>
              </p>
              <a className="flex px-2 py-3 border-gray-700 border-2 justify-center rounded-full">
                {item.status !== "Delivered" ? (
                  <FiClock className="text-gray-500" size={20} />
                ) : (
                  <FiMessageCircle className="text-gray-500" size={20} />
                )}
              </a>
              <button
                onClick={() => openModal(item)}
                disabled={item.status !== "Processing"}
                className={`${
                  item.status === "Processing"
                    ? "bg-blue-500 text-white hover:bg-blue-600"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                } px-4 py-2 rounded`}
              >
                Change Address
              </button>
            </div>
          ))
        ) : (
          <p>No Orders</p>
        )}
      </div>
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h3 className="text-lg font-semibold mb-4">Edit Address</h3>
            <div className="space-y-2">
              <div className="space-y-2">
                <input
                  type="text"
                  name="street"
                  placeholder="Street"
                  value={updatedAddress.street || ""}
                  onChange={handleAddressChange}
                  className="w-full border rounded px-3 py-2"
                />
                <input
                  type="text"
                  name="city"
                  placeholder="City"
                  value={updatedAddress.city || ""}
                  onChange={handleAddressChange}
                  className="w-full border rounded px-3 py-2"
                />
                <input
                  type="text"
                  name="state"
                  placeholder="State"
                  value={updatedAddress.state || ""}
                  onChange={handleAddressChange}
                  className="w-full border rounded px-3 py-2"
                />
                <input
                  type="text"
                  name="zipcode"
                  placeholder="Zip Code"
                  value={updatedAddress.zipcode || ""}
                  onChange={handleAddressChange}
                  className="w-full border rounded px-3 py-2"
                />
                <input
                  type="text"
                  name="country"
                  placeholder="Country"
                  value={updatedAddress.country || ""}
                  onChange={handleAddressChange}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
            </div>
            <div className="flex justify-end mt-4">
              <button className="save-btn" onClick={handleUpdateAddress}>
                Save
              </button>
              <button className="cancel-btn" onClick={closeModal}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyOrders;
