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
import React, { useEffect, useState } from "react";

//--------------------App Imports-------------------------
import StoreLayout from "../Layout";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

//--------------------Component-------------------------
const Orders = () => {
  const [token, setToken] = useState("");
  const [storeEmail, setStoreEmail] = useState("");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch token from localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  // Fetch store email based on token
  useEffect(() => {
    if (token) {
      const decoded = jwtDecode(token);
      axios
        .get(`/api/user/email/${decoded.id}`, { headers: { token } })
        .then((response) => {
          setStoreEmail(response.data.email);
        })
        .catch((error) => {
          console.error("Error fetching store email:", error);
          setError("Unable to fetch store email.");
        });
    }
  }, [token]);

  // Fetch orders for the store
  useEffect(() => {
    if (storeEmail) {
      axios
        .get(`/api/order/store/${storeEmail}`, { headers: { token } })
        .then((response) => {
          setOrders(response.data.data);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching store orders:", error);
          setError("Unable to fetch store orders.");
          setLoading(false);
        });
    }
  }, [storeEmail]);

  const handleStatusChange = (orderId, itemId, newStatus) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order._id === orderId
          ? {
              ...order,
              items: order.items.map((item) =>
                item._id === itemId ? { ...item, status: newStatus } : item
              ),
            }
          : order
      )
    );

    axios
      .put(
        `/api/order/updateStatus`,
        { orderId, itemId, status: newStatus },
        { headers: { token } }
      )
      .then(() => {
        console.log("Status updated successfully");
      })
      .catch((error) => {
        console.error("Error updating status:", error);
      });
  };

  return (
    <StoreLayout>
      {/* <div className="flex justify-center py-6">
        <h1 className="text-3xl font-semibold text-slate-800">Store Orders</h1>
      </div> */}

      {loading ? (
        <div className="flex justify-center py-6">
          <p className="text-gray-500">Loading orders...</p>
        </div>
      ) : error ? (
        <div className="flex justify-center py-6">
          <p className="text-red-500">{error}</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="flex justify-center py-6">
          <p className="text-gray-500">No orders found for your store.</p>
        </div>
      ) : (
        <div className="px-6 mt-16">
          <table className="table-auto w-full border-collapse border border-gray-300 shadow-lg">
            <thead>
              <tr className="bg-gray-200 text-left">
                <th className="border border-gray-300 px-4 py-2">Order ID</th>
                <th className="border border-gray-300 px-4 py-2">
                  Customer Name
                </th>
                <th className="border border-gray-300 px-4 py-2">Items</th>
                <th className="border border-gray-300 px-4 py-2">Total</th>
                <th className="border border-gray-300 px-4 py-2">Status</th>
                <th className="border border-gray-300 px-4 py-2">Date</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id} className="hover:bg-gray-100">
                  <td className="border border-gray-300 px-4 py-2">
                    {order._id}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {order.address.delivery
                      ? `${order.address.delivery.firstName} ${order.address.delivery.lastName}`
                      : "N/A"}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {order.items.map((item) => (
                      <div key={item._id} className="text-sm">
                        {item.name} (x{item.quantity})
                      </div>
                    ))}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    LKR {order.amount}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {order.items.map((item) => (
                      <div key={item._id} className="mb-2">
                        <select
                          value={item.status}
                          className="border rounded p-1 text-sm bg-white"
                          onChange={(e) =>
                            handleStatusChange(
                              order._id,
                              item._id,
                              e.target.value
                            )
                          }
                        >
                          <option value="Processing">Processing</option>
                          <option value="Out for Delivery">
                            Out for Delivery
                          </option>
                          <option value="Delivered">Delivered</option>
                        </select>
                      </div>
                    ))}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </StoreLayout>
  );
};

export default Orders;
