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
import { useEffect, useState, useContext } from "react";

//--------------------App Imports-------------------------
import StoreLayout from "../Layout";
import FormOffer from "../components/FormOffers";
import convertToBase64 from "../../admin/functions/imageConvert";
import { StoreContext } from "../../context/StoreContext";

//--------------------Other Imports-------------------------
import axios from "axios";
import { MdDelete, MdEdit } from "react-icons/md";
import { jwtDecode } from "jwt-decode";

axios.defaults.baseURL =
  import.meta.env.VITE_BACKEND_URL || "http://13.229.205.154:4000/";

const Offers = () => {
  const [dataList, setDataList] = useState([]);
  const [storeDataList, setStoreDataList] = useState([]);
  const [userRole, setUserRole] = useState("admin");
  const [userStore, setUserStore] = useState("");
  const [loading, setLoading] = useState(true);
  const { token } = useContext(StoreContext);

  // Fetch user-specific data
  useEffect(() => {
    if (token) {
      const decoded = jwtDecode(token);

      // Fetch store email
      axios
        .get(`/api/user/email/${decoded.id}`, { headers: { token } })
        .then((response) => {
          setUserStore(response.data.email);
        })
        .catch((error) => console.error("Error fetching store email:", error));

      // Fetch user role
      axios
        .get(`/api/user/role/${decoded.id}`, { headers: { token } })
        .then((response) => {
          setUserRole(response.data.role);
        })
        .catch((error) => console.error("Error fetching user role:", error));
    }
  }, [token]);

  // Fetch items when userStore is available
  useEffect(() => {
    if (userStore) {
      getData();
    }
  }, [userStore]);

  const getData = async () => {
    const data = await axios.get("/api/admin/listOffers");
    if (data.data.success) {
      const filteredData = data.data.data.filter(
        (item) => item.store === userStore
      );
      setDataList(filteredData);
    }
  };

  const getSelectionData = async () => {
    try {
      const storeData = await axios.get("/api/admin/listStoreUsers");
      if (storeData.data.success) {
        setStoreDataList(storeData.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getSelectionData();
  }, []);

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
    offer: "",
    storeName: "",
    store: "",
    description: "",
    image: "",
  });

  const [editFormData, setEditFormData] = useState({
    _id: "",
    offer: "",
    storeName: "",
    store: "",
    description: "",
    image: "",
  });

  const clearFormData = () => {
    setFormData({
      offer: "",
      storeName: "",
      store: "",
      description: "",
      image: "",
    });
  };

  const clearEditFormData = () => {
    setEditFormData({
      offer: "",
      storeName: "",
      store: "",
      description: "",
      image: "",
    });
  };
  // Auto-fill store for store owners
  useEffect(() => {
    if (userRole === "store") {
      setFormData((prev) => ({ ...prev, store: userStore }));
    }
  }, [userRole, userStore]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const store = storeDataList.find((item) => item.email === formData.store);

    if (store) {
      formData.storeName = store.name;
    }

    if (
      formData.offer == "" ||
      formData.store == "" ||
      formData.description == "" ||
      formData.image == ""
    ) {
      alert("Data is missing...!");
    } else {
      try {
        const data = await axios.post("/api/admin/addOffer", formData);

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
    const { name, value, files } = e.target;

    if (name === "image" && files && files[0]) {
      try {
        const file = files[0];

        const maxSize = 5 * 1024 * 1024;

        if (file.size > maxSize) {
          alert("File size exceeds 5MB. Please select a smaller image.");
          e.target.value = null;
          return;
        }

        const base64 = await convertToBase64(file);

        setFormData((prev) => ({
          ...prev,
          [name]: base64,
        }));
      } catch (error) {
        console.error("Error converting image to base64:", error);
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleDelete = async (id) => {
    try {
      const isConfirmed = window.confirm(
        "Are you sure you want to delete this item...!"
      );

      if (!isConfirmed) {
        return;
      }

      const data = await axios.delete("/api/admin/removeOffer", {
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

    const store = storeDataList.find(
      (item) => item.email === editFormData.store
    );

    if (store) {
      editFormData.storeName = store.name;
    }

    if (
      editFormData.offer == "" ||
      editFormData.store == "" ||
      editFormData.description == "" ||
      editFormData.image == ""
    ) {
      alert("Data is missing...!");
    } else {
      try {
        const data = await axios.put("/api/admin/updateOffer", editFormData);

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

  const handleEditOnChange = async (e) => {
    const { name, value, files } = e.target;

    if (name === "image" && files && files[0]) {
      try {
        const file = files[0];

        const maxSize = 5 * 1024 * 1024;

        if (file.size > maxSize) {
          alert("File size exceeds 5MB. Please select a smaller image.");
          e.target.value = null;
          return;
        }

        const base64 = await convertToBase64(file);

        setEditFormData((prev) => ({
          ...prev,
          [name]: base64,
        }));
      } catch (error) {
        console.error("Error converting image to base64:", error);
      }
    } else {
      setEditFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleEdit = (e) => {
    setEditFormData(e);
    toggleEditForm();
  };
  return (
    <StoreLayout>
      {isOpen && (
        <FormOffer
          handleSubmit={handleSubmit}
          handleOnChange={handleOnChange}
          toggleForm={toggleForm}
          storeDataList={storeDataList}
          formData={formData}
        />
      )}
      {isEditOpen && (
        <FormOffer
          handleSubmit={handleUpdate}
          handleOnChange={handleEditOnChange}
          toggleForm={toggleEditForm}
          storeDataList={storeDataList}
          formData={editFormData}
        />
      )}
      <div className="flex flex-col gap-5 p-4">
        <div className="flex justify-start">
          <button
            type="button"
            onClick={toggleForm}
            className="py-2 px-4 text-xs md:text-sm text-white bg-gray-800 hover:bg-gray-600 transition rounded-lg shadow-lg"
          >
            Add Offer
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-2 px-4 text-sm font-semibold text-gray-600 text-left">
                  Offer
                </th>
                <th className="py-2 px-4 text-sm font-semibold text-gray-600 text-left">
                  Store
                </th>
                <th className="py-2 px-4 text-sm font-semibold text-gray-600 text-left">
                  Description
                </th>
                <th className="py-2 px-4 text-sm font-semibold text-gray-600 text-left">
                  Image
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
                    <td className="py-3 px-4 text-sm text-gray-700">
                      {e.offer}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-700">
                      {e.store}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-700">
                      <textarea
                        rows={2}
                        value={e.description}
                        readOnly
                        className="w-full p-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
                      ></textarea>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-700">
                      <img
                        src={e.image}
                        alt={e.name}
                        className="w-10 h-10 rounded-full object-cover border border-gray-300"
                      />
                    </td>
                    <td className="py-6 px-4 text-sm text-gray-700 flex space-x-3">
                      <button
                        onClick={() => handleEdit(e)}
                        className="p-2 text-gray-500 hover:text-white hover:bg-gray-600  transition rounded-md"
                      >
                        <MdEdit size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(e._id)}
                        className="p-2 text-red-500 hover:text-white hover:bg-red-600 transition rounded-md"
                      >
                        <MdDelete size={18} />
                      </button>
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
    </StoreLayout>
  );
};

export default Offers;
