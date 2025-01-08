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
import FormItems from "../components/FormItem";
import StoreLayout from "../Layout";
import convertToBase64 from "../../admin/functions/imageConvert";
import { StoreContext } from "../../context/StoreContext";

//--------------------Other Imports-------------------------
import axios from "axios";
import { jwtDecode } from "jwt-decode";

axios.defaults.baseURL =
  import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";

const Items = () => {
  const [dataList, setDataList] = useState([]);
  const [storeDataList, setStoreDataList] = useState([]);
  const [categoryDataList, setCategoryDataList] = useState([]);
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

  // Fetch items
  const getData = async () => {
    try {
      setLoading(true);
      const data = await axios.get("/api/admin/listItems");
      if (data.data.success) {
        const filteredData = data.data.data.filter(
          (item) => item.store === userStore
        );
        setDataList(filteredData);
      }
    } catch (error) {
      console.error("Error fetching items:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch additional selection data
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

  useEffect(() => {
    getSelectionData();
  }, []);

  const [isOpen, setIsOpen] = useState(false);

  const toggleForm = () => {
    setIsOpen((prev) => !prev);
  };

  const [formData, setFormData] = useState({
    name: "",
    store: "",
    description: "",
    price: 0,
    category: "",
    image: "",
  });

  // Auto-fill store for store owners
  useEffect(() => {
    if (userRole === "store") {
      setFormData((prev) => ({ ...prev, store: userStore }));
    }
  }, [userRole, userStore]);

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
          setFormData({
            name: "",
            store: userRole === "storeOwner" ? userStore : "",
            description: "",
            price: 0,
            category: "",
            image: "",
          });
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

  return (
    <StoreLayout>
      {isOpen && (
        <FormItems
          handleSubmit={handleSubmit}
          handleOnChange={handleOnChange}
          toggleForm={toggleForm}
          storeDataList={storeDataList}
          categoryDataList={categoryDataList}
          formData={formData}
          userRole={userRole}
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
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan={6}
                    className="py-3 px-4 text-center text-gray-700"
                  >
                    Loading items...
                  </td>
                </tr>
              ) : dataList.length > 0 ? (
                dataList.map((item) => (
                  <tr
                    key={item._id}
                    className="border-t border-gray-200 hover:bg-gray-50 transition"
                  >
                    <td className="py-3 px-4 text-sm text-gray-700">
                      {item.name}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-700">
                      {item.store}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-700">
                      <textarea
                        rows={2}
                        value={item.description}
                        readOnly
                        className="w-full p-1 border border-gray-300 rounded-md"
                      ></textarea>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-700">
                      Rs.{item.price}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-700">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-700">
                      {item.category}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    className="py-3 px-4 text-center text-gray-700"
                  >
                    No items available for your store.
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

export default Items;
