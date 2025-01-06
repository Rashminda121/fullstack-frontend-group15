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

//--------------React Imports----------------
import React, { useEffect, useState } from "react";

//--------------Other Imports----------------
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { AiOutlineClockCircle } from "react-icons/ai";
import { FaBriefcase, FaEnvelope, FaUser } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import "./UserProfile.css";

const UserProfile = () => {
  const [token, setToken] = useState("");
  const [profile, setProfile] = useState({});
  const [role, setRole] = useState("");
  const [removeIsOpen, setRemoveIsOpen] = useState(false);
  const [roleIsOpen, setRoleIsOpen] = useState(false);
  const [dataList, setDataList] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [updateFormData, setUpdateFormData] = useState({
    name: "",
    email: "",
    image: "",
  });

  const history = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("token")) {
      setToken(localStorage.getItem("token"));
    }

    if (!token) return;

    const fetchUserData = async () => {
      try {
        const decoded = jwtDecode(token);

        // Fetch profile
        const profileResponse = await axios.get(
          `/api/user/profile/${decoded.id}`,
          {
            headers: { token },
          }
        );
        setProfile(profileResponse.data);
        setUpdateFormData({
          name: profileResponse.data.name,
          email: profileResponse.data.email,
          image: profileResponse.data.image,
        });

        // Fetch role
        const roleResponse = await axios.get(`/api/user/role/${decoded.id}`);
        setRole(roleResponse.data.role);

        initializeFormDataWithProfile(profileResponse.data);

        getData(profileResponse.data.id);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [token]);

  const getData = async (userId) => {
    try {
      const { data } = await axios.get(`/api/admin/listProfileRequest`, {
        params: { id: userId },
      });

      if (data.success) {
        setDataList(data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteUser = () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete your account?"
    );
    if (confirmDelete && token) {
      const decoded = jwtDecode(token);
      axios
        .delete(`/api/user/delete-account/${decoded.id}`, {
          headers: { token: token },
        })
        .then(() => {
          localStorage.removeItem("token");
          window.location.reload();
          history.push("/");
        })
        .catch((error) => {
          console.error("Error deleting user:", error);
        });
    }
  };

  const handleUpdate = () => {
    setIsEditing(true);
  };

  const handleUpdateSubmit = async () => {
    try {
      const decoded = jwtDecode(token);
      const response = await axios.put(
        `/api/user/update-account/${decoded.id}`,
        updateFormData,
        {
          headers: { token },
        }
      );

      if (response.data.success) {
        setProfile({
          ...profile,
          ...updateFormData,
        });
        setIsEditing(false);
        alert("Profile updated successfully!");
      } else {
        alert("Failed to update profile. Please try again.");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Error updating profile. Please try again.");
    }
  };

  const handleUpdateChange = (e) => {
    const { name, value } = e.target;
    setUpdateFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const toggleRemove = () => {
    setRemoveIsOpen((prev) => !prev);
  };

  const toggleRole = () => {
    setRoleIsOpen((prev) => !prev);
  };

  //form data
  const [formData, setFormData] = useState({
    userId: "",
    userName: "",
    email: "",
    role: "",
    type: "",
    request: "",
  });

  const clearFormData = () => {
    setFormData({
      userId: "",
      userName: "",
      email: "",
      role: "",
      type: "",
      request: "",
    });
  };

  // Function to update formData with profile data
  const initializeFormDataWithProfile = (profile) => {
    if (profile) {
      setFormData((prev) => ({
        ...prev,
        userId: profile.id || "",
        userName: profile.name || "",
        email: profile.email || "",
        role: profile.role || "",
        type: "role update request",
      }));
    }
  };

  const handleSubmitRequest = async (e) => {
    e.preventDefault();

    if (!formData.request) {
      alert("Data is missing...!");
      return;
    }
    try {
      const data = await axios.post("/api/admin/addRequest", formData);

      if (data.data.success) {
        toggleRole();
        alert(data.data.message);
        clearFormData();
      } else {
        alert(data.data.message);
      }
    } catch (error) {
      alert("Something went wrong!");
    }
  };

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCancelRequest = async (id) => {
    try {
      const isConfirmed = window.confirm(
        "Are you sure you want to cancel the request...!"
      );

      if (!isConfirmed) {
        return;
      }

      const data = await axios.delete("/api/admin/removeProfileRequest", {
        data: { _id: id },
      });

      if (data.data.success) {
        getData();
        toggleRole();
        alert(data.data.message);
      } else {
        alert(data.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="user-profile-container max-w-lg mx-auto p-8 bg-white rounded-lg shadow-lg border border-gray-200">
      <h1 className="text-xl md:text-2xl font-semibold mb-6 text-center text-gray-800 relative">
        User Profile
        <span className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-gray-800 to-transparent"></span>
      </h1>
      <div className="flex justify-end mb-2">
        <button
          className="flex items-center p-2 text-xs md:text-sm font-medium text-gray-700 bg-gray-100 rounded-lg shadow hover:bg-gray-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-gray-300"
          onClick={handleUpdate}
        >
          <MdEdit className="text-base md:text-lg" />
        </button>
      </div>
      {Object.keys(profile).length > 0 ? (
        <>
          <div className="space-y-8 text-center">
            <div className="relative w-32 h-32 mx-auto rounded-full overflow-hidden border-4 border-gray-300 shadow-lg">
              {isEditing ? (
                <input
                  type="text"
                  name="image"
                  value={updateFormData.image}
                  onChange={handleUpdateChange}
                  className="w-full p-2 border rounded"
                  placeholder="Image URL"
                />
              ) : (
                <img
                  src={profile.image}
                  alt={profile.name}
                  className="w-full h-full object-cover"
                />
              )}
            </div>

            <div className="text-center md:space-y-4">
              <div className="flex flex-col md:flex-row items-center justify-between text-base md:text-lg font-medium text-gray-700 md:border-2 border-gray-300 rounded-full px-6 py-3 md:px-8 md:py-4 hover:border-gray-400 transition-all duration-300">
                <div className="flex items-center space-x-3">
                  <FaUser className="text-gray-500" />
                  <strong className="text-gray-800">Name:</strong>
                </div>

                {isEditing ? (
                  <input
                    type="text"
                    name="name"
                    value={updateFormData.name}
                    onChange={handleUpdateChange}
                    className="ml-2 p-2 border rounded"
                  />
                ) : (
                  <span className="ml-2 text-gray-500 font-semibold capitalize hover:text-gray-600 transition-colors duration-300">
                    {profile.name}
                  </span>
                )}
              </div>

              <div className="flex flex-col md:flex-row items-center justify-between text-base md:text-lg font-medium text-gray-600 md:border-2 border-gray-300 rounded-full px-6 py-3 md:px-8 md:py-4 hover:border-gray-400 transition-all duration-300">
                <div className="flex items-center space-x-3">
                  <FaEnvelope className="text-gray-500" />
                  <strong className="text-gray-800">Email:</strong>
                </div>

                {isEditing ? (
                  <input
                    type="email"
                    name="email"
                    value={updateFormData.email}
                    onChange={handleUpdateChange}
                    className="ml-2 p-2 border rounded"
                  />
                ) : (
                  <span className="ml-2 text-gray-500 font-semibold hover:text-gray-600 transition-colors duration-300">
                    {profile.email}
                  </span>
                )}
              </div>

              <div
                onClick={profile.role === "user" ? toggleRole : undefined}
                className={`${
                  profile.role === "user" ? "cursor-pointer" : "cursor-default"
                }`}
              >
                <div className="flex flex-col md:flex-row items-center justify-between text-base md:text-lg text-gray-700 md:border-2 border-gray-300 rounded-full px-6 py-3 md:px-8 md:py-4 hover:border-gray-400 transition-all duration-300">
                  <div className="flex items-center space-x-3">
                    <FaBriefcase className="text-gray-500" />
                    <strong className="text-gray-800">Role:</strong>
                  </div>

                  <span className="flex items-center ml-2 text-gray-500 font-semibold capitalize hover:text-gray-600 transition-colors duration-300">
                    <span className={`${dataList[0] ? "mr-2" : ""}`}>
                      {profile.role}
                    </span>
                    {dataList[0] &&
                      dataList[0].state !== "rejected" &&
                      dataList[0].state !== "accepted" && (
                        <AiOutlineClockCircle className="text-gray-500 text-xl" />
                      )}
                  </span>
                </div>
                {profile.role === "user" && (
                  <div className="mb-4 bg-gray-50 border-l-4 border-gray-500 text-gray-800 p-4 mt-4 rounded-md">
                    {dataList[0] && dataList[0].state == "rejected" ? (
                      <p className="text-xs font-medium">
                        <strong className="text-gray-600">Note:</strong> Your
                        request to update your role to 'Store' has been
                        rejected. You can remove the request if needed. Thank
                        you for your understanding.
                      </p>
                    ) : dataList[0] ? (
                      <p className="text-xs font-medium">
                        <strong className="text-gray-600">Note:</strong> The
                        request to update your role to 'Store' may take some
                        time, and we appreciate your patience during this
                        process.
                      </p>
                    ) : (
                      <p className="text-xs font-medium">
                        <strong className="text-gray-600">Note:</strong> You can
                        update your role if needed by clicking on the current
                        role. This will allow you to request changes as
                        required.
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {isEditing && (
            <div className="flex justify-center space-x-4 mt-6">
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateSubmit}
                className="px-4 py-2 text-sm font-medium text-white bg-gray-600 rounded-md hover:bg-gray-700 focus:outline-none"
              >
                Save Changes
              </button>
            </div>
          )}

          <div className="relative mt-6">
            <div className="w-full border-t border-gray-300 mb-4 md:hidden"></div>
            <div className="flex items-center justify-center my-4">
              <div className="border-t border-gray-300 flex-grow md:block hidden"></div>
              <div
                onClick={toggleRemove}
                className="mx-4 text-center cursor-pointer text-xs md:text-sm text-red-500 font-semibold hover:underline transition-all duration-200"
              >
                Click here to remove your account
              </div>
              <div className="border-t border-gray-300 flex-grow md:block hidden"></div>
            </div>
          </div>

          {removeIsOpen && (
            <div className="mt-6 bg-red-50 border border-red-300 p-4 rounded-lg">
              <p className="text-red-600 text-xs md:text-sm font-medium mb-4">
                <span className="text-red-600 font-bold">Warning:</span>{" "}
                Deleting your account is irreversible. Please confirm your
                action.
              </p>
              <button
                onClick={handleDeleteUser}
                className="px-6 py-3 w-full text-sm md:text-base text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 rounded-full shadow-md transform hover:scale-105 transition-all duration-200"
              >
                Delete Account
              </button>
            </div>
          )}

          {roleIsOpen && (
            <div className="fixed p-4 md:p-0 inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
                <h2 className="text-lg font-bold text-gray-800 mb-4 text-center border-b border-gray-300 pb-2">
                  Request Store Role
                </h2>
                {dataList[0] ? (
                  dataList.map((e) => (
                    <div
                      key={e._id}
                      className="max-w-lg mx-auto p-8 bg-white rounded-2xl shadow-xl transition-all hover:shadow-2xl"
                    >
                      <div className="mb-8">
                        {e.state == "rejected" ? (
                          <p className="text-sm md:text-base text-gray-700 leading-relaxed">
                            Your request to update your role to{" "}
                            <strong>'Store'</strong> has been reviewed and
                            unfortunately, it has been rejected by the Admin. If
                            you have any questions or need further
                            clarification, please feel free to reach out. Thank
                            you for your understanding!
                          </p>
                        ) : (
                          <p className="text-sm md:text-base text-gray-700 leading-relaxed">
                            Your request to update your role to{" "}
                            <strong>'Store'</strong> has been successfully
                            submitted. It will be reviewed by the Admin. Once
                            approved, you will gain access to post items and add
                            more content. Thank you for your patience!
                          </p>
                        )}
                      </div>

                      <div className="mb-6">
                        <p className="text-sm md:text-base text-center capitalize text-gray-800 bg-gray-100 border-2 border-gray-300 rounded-lg py-4 px-6">
                          Request Status:{" "}
                          <span
                            className={`${
                              e.state == "rejected"
                                ? "font-semibold text-red-600"
                                : "font-semibold text-blue-600"
                            }`}
                          >
                            {e.state}
                          </span>
                        </p>
                      </div>

                      <div className="flex justify-center mt-2">
                        <button
                          onClick={() => handleCancelRequest(e._id)}
                          className="text-sm md:text-base bg-red-600 text-white rounded-lg py-3 px-8 hover:bg-red-700 transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-500 "
                        >
                          {e.state == "rejected"
                            ? "Delete Request"
                            : "Cancel Request"}
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div>
                    <p className="text-sm text-gray-600 mb-6">
                      You can update the role to "store," enabling you to post
                      items and add more content. Please provide a reason for
                      your request below.
                    </p>
                    <form onSubmit={handleSubmitRequest} className="space-y-4">
                      <div>
                        <label
                          htmlFor="request"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Reason for Requesting Store Role
                        </label>
                        <textarea
                          id="request"
                          name="request"
                          onChange={handleOnChange}
                          rows={3}
                          value={formData.request ? formData.request : ""}
                          className="w-full mt-2 text-sm border border-gray-300 rounded-md shadow-sm p-2 focus:ring-gray-500 focus:border-gray-500"
                          placeholder="Enter your reason here..."
                        />
                      </div>
                      <div className="flex justify-end space-x-2">
                        <button
                          type="button"
                          onClick={() => setRoleIsOpen(false)}
                          className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-4 py-2 text-sm font-medium text-white bg-gray-600 rounded-md hover:bg-gray-700 focus:outline-none"
                        >
                          Submit
                        </button>
                      </div>
                    </form>
                  </div>
                )}
                <button
                  onClick={() => setRoleIsOpen(false)}
                  className="absolute px-2 py-[2px] top-3 right-3 border-2 hover:border-none text-gray-600 hover:text-white hover:bg-gray-600 rounded-md"
                >
                  ✕
                </button>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="error-message text-center text-gray-800 bg-red-100 border border-red-300 rounded-lg p-6">
          <p className="text-red-600 text-lg font-semibold">
            Account not found.
          </p>
          <p>Please log in or sign up again to continue.</p>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
