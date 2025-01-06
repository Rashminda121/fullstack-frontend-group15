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
import { useEffect, useState } from "react";
import { MdDelete, MdEdit } from "react-icons/md";
import FormItems from "../components/FormItem";
import AdminLayout from "../layout";
import convertToBase64 from "./../functions/imageConvert";

axios.defaults.baseURL =
  import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";

const ItemsPage = () => {
  //list data
  const [dataList, setDataList] = useState([]);
  const [storeDataList, setStoreDataList] = useState([]);
  const [categoryDataList, setCategoryDataList] = useState([]);

  useEffect(() => {
    getData();
    getSelectionData();
  }, []);

  const getData = async () => {
    try {
      const data = await axios.get("/api/admin/listItems");
      if (data.data.success) {
        setDataList(data.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getSelectionData = async () => {
    try {
      const storeData = await axios.get("/api/admin/listStoreUsers");
      if (storeData.data.success) {
        setStoreDataList(storeData.data.data);
      }

      const categoryData = await axios.get("/api/admin/listCategory");
      if (categoryData.data.success) {
        setCategoryDataList(categoryData.data.data);
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
    name: "",
    store: "",
    description: "",
    price: 0,
    category: "",
    image: "",
  });

  const [editFormData, setEditFormData] = useState({
    _id: "",
    name: "",
    store: "",
    description: "",
    price: 0,
    category: "",
    image: "",
  });

  const clearFormData = () => {
    setFormData({
      name: "",
      store: "",
      description: "",
      price: 0,
      category: "",
      image: "",
    });
  };

  const clearEditFormData = () => {
    setEditFormData({
      name: "",
      store: "",
      description: "",
      price: 0,
      category: "",
      image: "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      Object.values(formData).some(
        (value) => value === "" || value === null || value === undefined
      )
    ) {
      alert("Data is missing...!");
    } else {
      try {
        const data = await axios.post("/api/admin/addItem", formData);

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
        [name]: name === "price" ? Number(value) : value,
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

      const data = await axios.delete("/api/admin/removeItem", {
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
      Object.values(editFormData).some(
        (value) => value === "" || value === null || value === undefined
      )
    ) {
      alert("Data is missing...!");
    } else {
      try {
        const data = await axios.put("/api/admin/updateItem", editFormData);

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
        [name]: name === "price" ? Number(value) : value,
      }));
    }
  };

  const handleEdit = (e) => {
    setEditFormData(e);
    toggleEditForm();
  };

  return (
    <AdminLayout>
      {isOpen && (
        <FormItems
          handleSubmit={handleSubmit}
          handleOnChange={handleOnChange}
          toggleForm={toggleForm}
          storeDataList={storeDataList}
          categoryDataList={categoryDataList}
          formData={formData}
        />
      )}
      {isEditOpen && (
        <FormItems
          handleSubmit={handleUpdate}
          handleOnChange={handleEditOnChange}
          toggleForm={toggleEditForm}
          storeDataList={storeDataList}
          categoryDataList={categoryDataList}
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
            Add Item
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-2 px-4 text-sm font-semibold text-gray-600 text-left">
                  Name
                </th>
                <th className="py-2 px-4 text-sm font-semibold text-gray-600 text-left">
                  Store
                </th>
                <th className="py-2 px-4 text-sm font-semibold text-gray-600 text-left">
                  Description
                </th>
                <th className="py-2 px-4 text-sm font-semibold text-gray-600 text-left">
                  Price
                </th>
                <th className="py-2 px-4 text-sm font-semibold text-gray-600 text-left">
                  Image
                </th>
                <th className="py-2 px-4 text-sm font-semibold text-gray-600 text-left">
                  Category
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
                      {e.name}
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
                      Rs.{e.price}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-700">
                      <img
                        src={e.image}
                        alt={e.name}
                        className="w-10 h-10 rounded-full object-cover border border-gray-300"
                      />
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-700">
                      {e.category}
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
    </AdminLayout>
  );
};

export default ItemsPage;
