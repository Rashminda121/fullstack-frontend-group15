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
import FormOrder from "../components/FormOrder";
import AdminLayout from "../layout";

axios.defaults.baseURL =
  import.meta.env.VITE_BACKEND_URL || "http://13.229.205.154:4000/";

const OrdersPage = () => {
  const [dataList, setDataList] = useState([]);
  const [storeDataList, setStoreDataList] = useState([]);
  const [userDataList, setUserDataList] = useState([]);
  const [itemDataList, setItemDataList] = useState([]);

  useEffect(() => {
    getData();
    getSelectionData();
  }, []);

  const getData = async () => {
    const data = await axios.get("/api/admin/listOrders");
    if (data.data.success) {
      setDataList(data.data.data);
    }
  };

  const getSelectionData = async () => {
    try {
      const storeData = await axios.get("/api/admin/listStoreUsers");
      if (storeData.data.success) {
        setStoreDataList(storeData.data.data);
      }
      const userData = await axios.get("/api/admin/listUserUsers");
      if (userData.data.success) {
        setUserDataList(userData.data.data);
      }
      const itemData = await axios.get("/api/admin/listItems");
      if (itemData.data.success) {
        setItemDataList(itemData.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // form's visibility
  const [isOpen, setIsOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [itemsSelected, setItemsSelected] = useState([]);
  const [editItemsSelected, setEditItemsSelected] = useState([]);

  const toggleForm = () => {
    setIsOpen((prev) => !prev);
    clearFormData();
  };
  const toggleEditForm = () => {
    setIsEditOpen((prev) => !prev);
  };

  //form data
  const [formData, setFormData] = useState({
    userId: "",
    userName: "",
    stores: [
      {
        store: {
          id: "",
          name: "",
        },
      },
    ],
    items: [
      {
        name: "",
        quantity: "",
        price: "",
        store: {
          id: "",
          name: "",
        },
        status: "",
      },
    ],
    amount: "",
    address: {
      delivery: {},
      billing: {},
    },
    payment: "",
  });

  const [editFormData, setEditFormData] = useState({
    _id: "",
    userId: "",
    userName: "",
    stores: [
      {
        store: {
          id: "",
          name: "",
        },
      },
    ],
    items: [
      {
        name: "",
        quantity: "",
        price: "",
        store: {
          id: "",
          name: "",
        },
        status: "",
      },
    ],
    amount: "",
    address: {
      delivery: {},
      billing: {},
    },
    payment: "",
  });

  const clearFormData = () => {
    setFormData({
      userId: "",
      userName: "",
      stores: [
        {
          store: {
            id: "",
            name: "",
          },
        },
      ],
      items: [
        {
          name: "",
          quantity: "",
          price: "",
          store: {
            id: "",
            name: "",
          },
          status: "",
        },
      ],
      amount: "",
      address: {
        delivery: {},
        billing: {},
      },
      payment: "",
    });
    setItemsSelected([]);
  };

  const clearEditFormData = () => {
    setEditFormData({
      userId: "",
      userName: "",
      stores: [
        {
          store: {
            id: "",
            name: "",
          },
        },
      ],
      items: [
        {
          name: "",
          quantity: "",
          price: "",
          store: {
            id: "",
            name: "",
          },
          status: "",
        },
      ],
      amount: "",
      address: {
        delivery: {},
        billing: {},
      },
      payment: "",
    });
    setEditItemsSelected([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      formData.amount === "" ||
      Object.keys(formData.address).length === 0 ||
      formData.items.length === 0 ||
      (formData.payment !== true && formData.payment !== false)
    ) {
      alert("Data is missing...!");
    } else {
      try {
        if (itemsSelected.length > 0) {
          const uniqueStores = new Set();

          formData.items = itemsSelected.map((item) => {
            const matchingItem = itemDataList.find(
              (dataItem) => dataItem._id === item.itemId
            );

            let store = { id: "Unknown ID", name: "Unknown Store" };

            if (matchingItem) {
              const storeData = storeDataList.find(
                (store) => store.email === matchingItem.store
              );

              if (storeData) {
                store = {
                  id: storeData._id,
                  name: storeData.email,
                };
              }
            }

            return {
              ...item,
              store,
            };
          });

          formData.stores = itemsSelected
            .map((item) => {
              const matchingItem = itemDataList.find(
                (dataItem) => dataItem._id === item.itemId
              );

              if (matchingItem) {
                const storeData = storeDataList.find(
                  (store) => store.email === matchingItem.store
                );

                if (storeData) {
                  return {
                    store: {
                      id: storeData._id,
                      name: storeData.email,
                    },
                  };
                }
              }

              return null;
            })
            .filter((storeObj) => {
              if (storeObj?.store?.id && !uniqueStores.has(storeObj.store.id)) {
                uniqueStores.add(storeObj.store.id);
                return true;
              }
              return false;
            });
        }

        // Make the API call to add the order
        const data = await axios.post("/api/admin/addOrder", formData);

        // Handle the API response
        if (data.data.success) {
          toggleForm(); // Close the form
          getData(); // Refresh the data
          alert(data.data.message); // Notify the user
          clearFormData(); // Clear the form data
        } else {
          alert(data.data.message); // Show error message
        }
      } catch (error) {
        console.error("Error adding order:", error);
        alert("Something went wrong!");
      }
    }
  };

  const handleOnChange = (e) => {
    const { name, value } = e.target;

    if (name === "userId") {
      const selectedUser = userDataList.find((user) => user._id === value);
      setFormData((prev) => ({
        ...prev,
        userId: selectedUser._id,
        userName: selectedUser.name,
      }));
    }

    setFormData((prev) => {
      if (name.startsWith("delivery.")) {
        const fieldName = name.split(".")[1];
        return {
          ...prev,
          address: {
            ...prev.address,
            delivery: {
              ...prev.address.delivery,
              [fieldName]: value,
            },
          },
        };
      } else if (name.startsWith("billing.")) {
        const fieldName = name.split(".")[1];
        return {
          ...prev,
          address: {
            ...prev.address,
            billing: {
              ...prev.address.billing,
              [fieldName]: value,
            },
          },
        };
      }
      return {
        ...prev,
        [name]:
          name === "payment"
            ? value === "true"
              ? true
              : value === "false"
              ? false
              : value
            : name === "amount"
            ? Number(value)
            : value,
      };
    });
  };

  const handleDelete = async (id) => {
    try {
      const isConfirmed = window.confirm(
        "Are you sure you want to delete this item...!"
      );

      if (!isConfirmed) {
        return;
      }

      const data = await axios.delete("/api/admin/removeOrder", {
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
      editFormData.amount === "" ||
      Object.keys(editFormData.address).length === 0 ||
      editFormData.items.length === 0 ||
      (editFormData.payment !== true && editFormData.payment !== false)
    ) {
      alert("Data is missing...!");
    } else {
      try {
        if (editItemsSelected.length > 0) {
          const uniqueStores = new Set();

          editFormData.items = editItemsSelected.map((item) => {
            const matchingItem = itemDataList.find(
              (dataItem) => dataItem._id === item.itemId
            );

            let store = { id: "Unknown ID", name: "Unknown Store" };

            if (matchingItem) {
              const storeData = storeDataList.find(
                (store) => store.email === matchingItem.store
              );

              if (storeData) {
                store = {
                  id: storeData._id,
                  name: storeData.email,
                };
              }
            }

            return {
              ...item,
              store,
            };
          });

          editFormData.stores = editItemsSelected
            .map((item) => {
              const matchingItem = itemDataList.find(
                (dataItem) => dataItem._id === item.itemId
              );

              if (matchingItem) {
                const storeData = storeDataList.find(
                  (store) => store.email === matchingItem.store
                );

                if (storeData) {
                  return {
                    store: {
                      id: storeData._id,
                      name: storeData.email,
                    },
                  };
                }
              }

              return null;
            })
            .filter((storeObj) => {
              if (storeObj?.store?.id && !uniqueStores.has(storeObj.store.id)) {
                uniqueStores.add(storeObj.store.id);
                return true;
              }
              return false;
            });
        }

        const data = await axios.put("/api/admin/updateOrder", editFormData);

        if (data.data.success) {
          toggleEditForm();
          getData();
          alert(data.data.message);
          clearEditFormData();
        } else {
          alert(data.data.message);
        }
      } catch (error) {
        console.log(error);
        alert("Something went wrong!");
      }
    }
  };

  const handleEditOnChange = (e) => {
    const { name, value } = e.target;

    if (name === "userId") {
      const selectedUser = userDataList.find((user) => user._id === value);
      setEditFormData((prev) => ({
        ...prev,
        userId: selectedUser._id,
        userName: selectedUser.name,
      }));
    }

    setEditFormData((prev) => {
      if (name.startsWith("delivery.")) {
        const fieldName = name.split(".")[1];
        return {
          ...prev,
          address: {
            ...prev.address,
            delivery: {
              ...prev.address.delivery,
              [fieldName]: value,
            },
          },
        };
      } else if (name.startsWith("billing.")) {
        const fieldName = name.split(".")[1];
        return {
          ...prev,
          address: {
            ...prev.address,
            billing: {
              ...prev.address.billing,
              [fieldName]: value,
            },
          },
        };
      }
      return {
        ...prev,
        [name]:
          name === "payment"
            ? value === "true"
              ? true
              : value === "false"
              ? false
              : value
            : name === "amount"
            ? Number(value)
            : value,
      };
    });
  };

  const handleEdit = (e) => {
    setEditFormData(e);
    toggleEditForm();
  };

  const getUserName = (id) => {
    const user = userDataList.find((user) => user._id === id);
    return user ? user.name : "";
  };

  return (
    <AdminLayout>
      {isOpen && (
        <FormOrder
          handleSubmit={handleSubmit}
          handleOnChange={handleOnChange}
          toggleForm={toggleForm}
          userDataList={userDataList}
          itemDataList={itemDataList}
          storeDataList={storeDataList}
          formData={formData}
          setFormData={setFormData}
          itemsSelected={itemsSelected}
          setItemsSelected={setItemsSelected}
        />
      )}
      {isEditOpen && (
        <FormOrder
          handleSubmit={handleUpdate}
          handleOnChange={handleEditOnChange}
          toggleForm={toggleEditForm}
          userDataList={userDataList}
          itemDataList={itemDataList}
          storeDataList={storeDataList}
          formData={editFormData}
          setFormData={setEditFormData}
          itemsSelected={editItemsSelected}
          setItemsSelected={setEditItemsSelected}
        />
      )}
      <div className="flex flex-col gap-5 p-4">
        <div className="flex justify-start">
          <button
            type="button"
            onClick={toggleForm}
            className="py-2 px-4 text-xs md:text-sm text-white bg-gray-800 hover:bg-gray-600 transition rounded-lg shadow-lg"
          >
            Add Order
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
                  Store
                </th>
                <th className="py-2 px-4 text-sm font-semibold text-gray-600 text-left">
                  Delivery Address
                </th>
                <th className="py-2 px-4 text-sm font-semibold text-gray-600 text-left">
                  Billing Address
                </th>
                <th className="py-2 px-4 text-sm font-semibold text-gray-600 text-left">
                  Amount
                </th>
                <th className="py-2 px-4 text-sm font-semibold text-gray-600 text-left">
                  Payment
                </th>
                <th className="py-2 px-4 text-sm font-semibold text-gray-600 text-left">
                  Status
                </th>
                <th className="py-2 px-4 text-sm font-semibold text-gray-600 text-left">
                  Items
                </th>
                <th className="py-2 px-4 text-sm font-semibold text-gray-600 text-left">
                  Order Date
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
                      {e.userName && e.userName.trim() !== ""
                        ? e.userName
                        : getUserName(e.userId) &&
                          getUserName(e.userId).trim() !== ""
                        ? getUserName(e.userId)
                        : "No data"}
                    </td>

                    <td className="py-3 px-2 text-sm text-gray-700 max-h-[80px] overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
                      <div className="max-h-[80px] overflow-y-auto overflow-x-hidden">
                        {e.stores.length > 0 ? (
                          e.stores.map((store, index) => (
                            <div key={index} className="py-1">
                              <p className="text-xs md:text-sm py-[2px] px-[2px]">
                                {store.store.name
                                  ? `${index + 1}. ${store.store.name}`
                                  : "No data"}
                              </p>
                            </div>
                          ))
                        ) : (
                          <p>No Stores Available</p>
                        )}
                      </div>
                    </td>

                    <td className="py-3 px-4 text-sm text-gray-700">
                      <textarea
                        readOnly
                        value={
                          [
                            `first name: ${
                              e.address?.delivery?.firstName ?? "No data"
                            }`,
                            `last name: ${
                              e.address?.delivery?.lastName ?? "No data"
                            }`,
                            `street: ${
                              e.address?.delivery?.street ?? "No data"
                            }`,
                            `city: ${e.address?.delivery?.city ?? "No data"}`,
                            `state: ${e.address?.delivery?.state ?? "No data"}`,
                            `country: ${
                              e.address?.delivery?.country ?? "No data"
                            }`,
                            `zipcode: ${
                              e.address?.delivery?.zipcode ?? "No data"
                            }`,
                            `phone: ${e.address?.delivery?.phone ?? "No data"}`,
                            `email: ${e.address?.delivery?.email ?? "No data"}`,
                          ].join(",\n") // Join valid entries with newlines
                        }
                      ></textarea>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-700">
                      <textarea
                        readOnly
                        value={
                          [
                            `first name: ${
                              e.address?.billing?.firstName ?? "No data"
                            }`,
                            `last name: ${
                              e.address?.billing?.lastName ?? "No data"
                            }`,
                            `street: ${
                              e.address?.billing?.street ?? "No data"
                            }`,
                            `city: ${e.address?.billing?.city ?? "No data"}`,
                            `state: ${e.address?.billing?.state ?? "No data"}`,
                            `country: ${
                              e.address?.billing?.country ?? "No data"
                            }`,
                            `zipcode: ${
                              e.address?.billing?.zipcode ?? "No data"
                            }`,
                            `phone: ${e.address?.billing?.phone ?? "No data"}`,
                            `email: ${e.address?.billing?.email ?? "No data"}`,
                          ].join(",\n") // Join valid entries with newlines
                        }
                      ></textarea>
                    </td>

                    <td className="py-3 px-4 text-sm text-gray-700">
                      Rs.{e.amount}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-700">
                      {Boolean(e.payment).toString()}
                    </td>
                    <td className="py-3 px-2 text-sm text-gray-700 max-h-[80px] overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
                      <div className="max-h-[80px] overflow-y-auto overflow-x-hidden">
                        {e.items.map((item, index) => (
                          <div key={index} className="py-1">
                            <p className="text-xs md:text-sm font-medium">{`${
                              index + 1
                            }. ${item.name || "Unnamed Item"}`}</p>
                            <p className="text-xs md:text-sm text-gray-500">
                              {item.status || "No Status"}
                            </p>
                          </div>
                        ))}
                      </div>
                    </td>

                    <td className="py-3 px-4 text-sm text-gray-700">
                      {e.items.length}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-700">
                      {e.createdAt
                        ? new Date(e.createdAt).toLocaleDateString()
                        : new Date(e.date).toLocaleDateString()}
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

export default OrdersPage;
