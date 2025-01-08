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
import { MdDelete, MdEdit } from "react-icons/md";
import FormCategory from "../components/FormCategory";
import convertToBase64 from "./../functions/imageConvert";

axios.defaults.baseURL =
  import.meta.env.VITE_BACKEND_URL || "http://localhost:4000/";

const CategoriesPage = () => {
  const [dataList, setDataList] = useState([]);

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    const data = await axios.get("/api/admin/listCategory");
    if (data.data.success) {
      setDataList(data.data.data);
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
    image: "",
  });

  const [editFormData, setEditFormData] = useState({
    _id: "",
    name: "",
    image: "",
  });

  const clearFormData = () => {
    setFormData({
      name: "",
      image: "",
    });
  };

  const clearEditFormData = () => {
    setEditFormData({
      name: "",
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
        const data = await axios.post("/api/admin/addCategory", formData);

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

      const data = await axios.delete("/api/admin/removeCategory", {
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
        const data = await axios.put("/api/admin/updateCategory", editFormData);

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
    <AdminLayout>
      {isOpen && (
        <FormCategory
          handleSubmit={handleSubmit}
          handleOnChange={handleOnChange}
          toggleForm={toggleForm}
          formData={formData}
        />
      )}
      {isEditOpen && (
        <FormCategory
          handleSubmit={handleUpdate}
          handleOnChange={handleEditOnChange}
          toggleForm={toggleEditForm}
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
            Add Category
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
                      {e.name}
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
    </AdminLayout>
  );
};

export default CategoriesPage;
