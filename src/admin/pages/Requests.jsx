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

import AdminLayout from "../layout";

import axios from "axios";
import { useEffect, useState } from "react";
import { AiOutlineHourglass } from "react-icons/ai";
import { BsCheckCircle, BsXCircle } from "react-icons/bs";
import { FaCheck, FaRegClock, FaTimes } from "react-icons/fa";
import { MdDelete, MdEdit } from "react-icons/md";
import FormRequest from "../components/FormRequests";

axios.defaults.baseURL =
  import.meta.env.VITE_BACKEND_URL || "http://localhost:4000/";

const RequestsPage = () => {
  const [dataList, setDataList] = useState([]);
  const [userDataList, setUserDataList] = useState([]);

  useEffect(() => {
    getData();
    getSelectionData();
  }, []);

  const getData = async () => {
    const data = await axios.get("/api/admin/listRequest");
    if (data.data.success) {
      setDataList(data.data.data);
    }
  };

  const getSelectionData = async () => {
    try {
      const storeData = await axios.get("/api/admin/listUsers");
      if (storeData.data.success) {
        setUserDataList(storeData.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // form's visibility
  const [isOpen, setIsOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const toggleForm = () => {
    setIsOpen((prev) => !prev);
    clearEditFormData();
  };
  const toggleEditForm = () => {
    setIsEditOpen((prev) => !prev);
  };

  //form data
  const [formData, setFormData] = useState({
    userId: "",
    userName: "",
    email: "",
    role: "",
    type: "",
    request: "",
    state: "",
  });

  const [editFormData, setEditFormData] = useState({
    _id: "",
    userId: "",
    userName: "",
    email: "",
    role: "",
    type: "",
    request: "",
    state: "",
  });

  const clearFormData = () => {
    setFormData({
      userId: "",
      userName: "",
      email: "",
      role: "",
      type: "",
      request: "",
      state: "",
    });
  };

  const clearEditFormData = () => {
    setEditFormData({
      userId: "",
      userName: "",
      email: "",
      role: "",
      type: "",
      request: "",
      state: "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      formData.email == "" ||
      formData.request == "" ||
      formData.state == "" ||
      formData.type == ""
    ) {
      alert("Data is missing...!");
    } else {
      try {
        if (userDataList.length > 0) {
          userDataList.forEach((user) => {
            if (formData.email === user.email) {
              formData.userId = user._id;
              formData.userName = user.name;
              formData.role = user.role;
            }
          });
        }

        const data = await axios.post("/api/admin/addRequest", formData);

        console.log(data);

        if (data.data.success) {
          toggleForm();
          getData();
          alert(data.data.message);
          clearFormData();
        } else {
          alert(data.data.message);
        }
      } catch (error) {
        alert("Something went wrong!");
      }
    }
  };

  const handleOnChange = async (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDelete = async (id) => {
    try {
      const isConfirmed = window.confirm(
        "Are you sure you want to delete this request...!"
      );

      if (!isConfirmed) {
        return;
      }

      const data = await axios.delete("/api/admin/removeRequest", {
        data: { _id: id },
      });

      if (data.data.success) {
        getData();
        alert(data.data.message);
      } else {
        alert(data.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (
      editFormData.email == "" ||
      editFormData.request == "" ||
      editFormData.state == "" ||
      editFormData.type == ""
    ) {
      alert("Data is missing...!");
    } else {
      try {
        if (userDataList.length > 0) {
          userDataList.forEach((user) => {
            if (editFormData.email === user.email) {
              editFormData.userId = user._id;
              editFormData.userName = user.name;
              editFormData.role = user.role;
            }
          });
        }

        const data = await axios.put("/api/admin/updateRequest", editFormData);

        if (data.data.success) {
          getData();
          toggleEditForm();
          alert(data.data.message);
          clearEditFormData();
        } else {
          alert(data.data.message);
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  console.log(editFormData);

  const handleEditOnChange = async (e) => {
    const { name, value } = e.target;

    setEditFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAccept = async (userId, requestId) => {
    try {
      const updateUser = { _id: userId, role: "store" };
      const updateRequest = {
        _id: requestId,
        role: "store",
        state: "accepted",
      };

      const userUpdate = await axios.put("/api/admin/updateUser", updateUser);
      const requestUpdate = await axios.put(
        "/api/admin/updateRequest",
        updateRequest
      );

      if (userUpdate.data.success && requestUpdate.data.success) {
        getData();
        alert("Request accepted...!");
      } else {
        const userMessage = userUpdate.data.message || "User update failed.";
        const requestMessage =
          requestUpdate.data.message || "Request update failed.";
        alert(`${userMessage}\n${requestMessage}`);
      }
    } catch (error) {
      console.error("Error during role acceptance process:", error);
    }
  };

  const handleReject = async (requestId) => {
    try {
      const updateRequest = {
        _id: requestId,
        state: "rejected",
      };

      const requestUpdate = await axios.put(
        "/api/admin/updateRequest",
        updateRequest
      );

      if (requestUpdate.data.success) {
        getData();
        alert("Request rejected...!");
      } else {
        const requestMessage =
          requestUpdate.data.message || "Request update failed.";
        alert(requestMessage);
      }
    } catch (error) {
      console.error("Error during role acceptance process:", error);
    }
  };

  const handleEdit = (e) => {
    setEditFormData(e);
    toggleEditForm();
  };

  return (
    <AdminLayout>
      {isOpen && (
        <FormRequest
          handleSubmit={handleSubmit}
          handleOnChange={handleOnChange}
          toggleForm={toggleForm}
          formData={formData}
          userDataList={userDataList}
        />
      )}
      {isEditOpen && (
        <FormRequest
          handleSubmit={handleUpdate}
          handleOnChange={handleEditOnChange}
          toggleForm={toggleEditForm}
          formData={editFormData}
          userDataList={userDataList}
        />
      )}
      <div className="flex flex-col gap-5 p-4">
        <div className="flex justify-start">
          <button
            type="button"
            onClick={toggleForm}
            className="py-2 px-4 text-xs md:text-sm text-white bg-gray-800 hover:bg-gray-600 transition rounded-lg shadow-lg"
          >
            Add Request
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-2 px-4 text-sm font-semibold text-gray-600 text-left">
                  User
                </th>
                <th className="py-2 px-4 text-sm font-semibold text-gray-600 text-left">
                  Email
                </th>
                <th className="py-2 px-4 text-sm font-semibold text-gray-600 text-left">
                  Role
                </th>
                <th className="py-2 px-4 text-sm font-semibold text-gray-600 text-left">
                  Type
                </th>
                <th className="py-2 px-4 text-sm font-semibold text-gray-600 text-left">
                  Request
                </th>
                <th className="py-2 px-4 text-sm font-semibold text-gray-600 text-left">
                  State
                </th>
                <th className="py-2 px-4 text-sm font-semibold text-gray-600 text-left">
                  Response
                </th>
                <th className="py-2 px-4 text-sm font-semibold text-gray-600 text-left">
                  Options
                </th>
              </tr>
            </thead>
            <tbody>
              {dataList[0] ? (
                dataList.map((e) => (
                  <tr
                    key={e._id}
                    className="border-t border-gray-200 hover:bg-gray-50 transition"
                  >
                    <td className="py-3 px-4 text-sm text-gray-700 capitalize">
                      {e.userName}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-700">
                      {e.email}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-700">
                      {e.role}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-700">
                      {e.type}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-700">
                      <textarea
                        rows={2}
                        value={e.request}
                        readOnly
                        className="w-full p-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
                      ></textarea>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-700">
                      {e.state}
                    </td>
                    <td className="py-6 px-4 text-sm text-gray-700">
                      {e.type == "role update request" &&
                      e.role == "user" &&
                      e.state != "rejected" &&
                      e.state != "accepted" ? (
                        <div className="flex space-x-4">
                          <div className="relative group">
                            <button
                              onClick={() => handleAccept(e.userId, e._id)}
                              className="p-2 text-gray-500 hover:text-white hover:bg-green-600 transition rounded-md"
                            >
                              <FaCheck size={16} />
                            </button>
                            <span className="absolute text-xs text-gray-500 group-hover:block hidden bottom-full mb-[5px] left-1/2 transform -translate-x-1/2">
                              Accept
                            </span>
                          </div>

                          <div className="relative group">
                            <button
                              onClick={() => handleReject(e._id)}
                              className="p-2 text-red-500 hover:text-white hover:bg-red-600 transition rounded-md"
                            >
                              <FaTimes size={18} />
                            </button>
                            <span className="absolute text-xs text-gray-500 group-hover:block hidden bottom-full mb-[5px] left-1/2 transform -translate-x-1/2">
                              Reject
                            </span>
                          </div>
                        </div>
                      ) : (
                        <div className="flex justify-center">
                          <button className="p-2 text-gray-500 hover:text-white hover:bg-gray-600 transition rounded-md">
                            {e.state === "pending" ? (
                              <AiOutlineHourglass size={18} />
                            ) : e.state === "reviewing" ? (
                              <FaRegClock size={18} />
                            ) : e.state === "rejected" ? (
                              <BsXCircle size={18} />
                            ) : e.state === "accepted" ? (
                              <BsCheckCircle size={18} />
                            ) : null}
                          </button>
                        </div>
                      )}
                    </td>
                    <td className="py-6 px-4 text-sm text-gray-700">
                      <div className="flex space-x-4">
                        <button
                          onClick={() => handleEdit(e)}
                          className="p-2 text-gray-500 hover:text-white hover:bg-gray-600 transition rounded-md"
                        >
                          <MdEdit size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(e._id)}
                          className="p-2 text-red-500 hover:text-white hover:bg-red-600 transition rounded-md"
                        >
                          <MdDelete size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr className="border-t border-gray-200 hover:bg-gray-50 transition">
                  <td className="py-3 px-4 text-sm text-gray-700">
                    No data available...!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
};

export default RequestsPage;
