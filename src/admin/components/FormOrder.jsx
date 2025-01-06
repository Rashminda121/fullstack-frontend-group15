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

import { useEffect, useState } from "react";
import {
  MdClose,
  MdKeyboardArrowDown,
  MdKeyboardArrowUp,
} from "react-icons/md";
import formatDate from "./../functions/dateConverter";

const FormOrder = ({
  handleSubmit,
  handleOnChange,
  toggleForm,
  userDataList = [],
  itemDataList = [],
  storeDataList = [],
  formData = {},
  setFormData = {},
  itemsSelected = [],
  setItemsSelected = [],
}) => {
  const [adddressIsOpen, setAddressIsOpen] = useState(false);
  const [billingAdddressIsOpen, setBillingAddressIsOpen] = useState(false);
  const [itemsIsOpen, setItemsIsOpen] = useState(false);

  const [selectedItem, setSelectedItem] = useState("");

  const toggleAddress = () => {
    setAddressIsOpen((prev) => !prev);
  };
  const toggleBillingAddress = () => {
    setBillingAddressIsOpen((prev) => !prev);
  };

  const toggleItem = () => {
    setItemsIsOpen((prev) => !prev);
    setSelectedItem("");
  };

  useEffect(() => {
    setData();
  }, [formData, setItemsSelected]);

  // Initialize itemsSelected from formData when the component loads
  const setData = () => {
    if (formData.items && formData.items.length > 0) {
      const initializedItems = formData.items
        .map((formItem) => {
          const itemData = itemDataList.find(
            (item) =>
              item.name === formItem.name ||
              item.description === formItem.description
          );
          if (!itemData && !formItem.name && !formItem.description) {
            return null;
          }
          return {
            itemId: itemData?._id || formItem.itemId,
            name: formItem.name || itemData?.name || "",
            description: formItem.description || itemData?.description || "",
            price: itemData?.price || formItem.price || 0,
            quantity: formItem.quantity || 1,
            category: itemData?.category || "",
            image: itemData?.image || "",
            status: formItem.status || "",
          };
        })
        .filter((item) => item !== null);
      setItemsSelected(initializedItems);
    }
  };

  // Update total amount and formData.items
  const updateFormDataItemsAndAmount = (updatedItems) => {
    const totalAmount = updatedItems.reduce(
      (sum, item) => sum + item.quantity * item.price,
      0
    );

    setFormData((prevFormData) => ({
      ...prevFormData,
      items: updatedItems,
      amount: totalAmount,
    }));
  };

  // Handle adding an item
  const handleAddItem = () => {
    const selectedItemData = itemDataList.find(
      (item) => item.name === selectedItem
    );

    if (selectedItemData) {
      const storeData = storeDataList.find(
        (store) => store.email === selectedItemData.store
      );

      setItemsSelected((prevItems) => {
        const existingItem = prevItems.find(
          (item) => item.itemId === selectedItemData._id
        );

        const updatedItems = existingItem
          ? prevItems.map((item) =>
              item.itemId === selectedItemData._id
                ? { ...item, quantity: item.quantity + 1 }
                : item
            )
          : [
              ...prevItems,
              {
                itemId: selectedItemData._id,
                name: selectedItemData.name,
                description: selectedItemData.description,
                price: selectedItemData.price,
                image: selectedItemData.image,
                category: selectedItemData.category,
                store: {
                  id: storeData?._id || "Unknown ID",
                  name: storeData?.email || "Unknown Store",
                },
                quantity: 1,
                status:
                  prevItems.find((item) => item.itemId === selectedItemData._id)
                    ?.status || "Processing",
              },
            ];

        updateFormDataItemsAndAmount(updatedItems);
        return updatedItems;
      });
    }
  };

  // Handle removing an item
  const handleRemoveItem = (itemId) => {
    setItemsSelected((prevItems) => {
      const updatedItems = prevItems
        .map((item) =>
          item.itemId === itemId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0);

      // Update formData.items and total amount
      updateFormDataItemsAndAmount(updatedItems);
      return updatedItems;
    });
  };

  const handleStatus = (itemId, newStatus) => {
    setItemsSelected((prev) => {
      const updatedItems = prev.map((item) =>
        item.itemId === itemId ? { ...item, status: newStatus } : item
      );

      setFormData((prevFormData) => ({
        ...prevFormData,
        items: updatedItems,
      }));

      return updatedItems;
    });

    setItemsSelected((prev) => {
      const updatedItems = prev.map((item) =>
        item.itemId === itemId ? { ...item, status: newStatus } : item
      );
      return updatedItems;
    });
  };

  return (
    <div className="fixed p-5 inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-md h-[80vh] p-6 rounded-lg shadow-md relative flex flex-col">
        <button
          className="absolute p-2 top-3 right-3 text-gray-500 hover:text-white hover:bg-gray-600 rounded-md"
          onClick={toggleForm}
        >
          <MdClose size={18} />
        </button>

        <h2 className="text-xl font-semibold text-gray-700 text-center mb-4">
          Order Details
        </h2>

        <form
          onSubmit={handleSubmit}
          className="flex-grow space-y-4 overflow-y-auto"
        >
          <div>
            <label
              htmlFor="userId"
              className="block text-sm md:text-base font-medium text-gray-600"
            >
              User
            </label>
            <select
              id="userId"
              name="userId"
              onChange={handleOnChange}
              value={formData.userId}
              className="w-full mt-1 p-2 text-sm md:text-base border border-gray-300 rounded-md focus:ring focus:ring-gray-300 focus:outline-none"
              required
            >
              <option value="">Select a user</option>
              {userDataList.map((e) => (
                <option value={e._id} key={e._id}>
                  User:{" "}
                  {e.name && e.name.charAt(0).toUpperCase() + e.name.slice(1)}
                </option>
              ))}
            </select>
          </div>
          {/* delivery address */}
          <div>
            <label
              onClick={toggleAddress}
              className="block text-sm md:text-base font-medium text-gray-600 hover:cursor-pointer"
            >
              <div className="flex flex-row">
                Delivery Address
                {adddressIsOpen ? (
                  <span className="pl-2 pt-[2px] ">
                    <MdKeyboardArrowUp className="w-4 h-4 md:w-6 md:h-6 " />
                  </span>
                ) : (
                  <span className="pl-2 pt-[2px] ">
                    <MdKeyboardArrowDown className="w-4 h-4 md:w-6 md:h-6 " />
                  </span>
                )}
              </div>
            </label>
            {adddressIsOpen ? (
              <div className="flex flex-col p-2">
                <div className="block md:flex md:flex-row gap-2">
                  <div>
                    <label
                      htmlFor="firstName"
                      className="block text-sm md:text-base font-medium text-gray-600"
                    >
                      First name
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="delivery.firstName"
                      onChange={handleOnChange}
                      value={
                        formData?.address?.delivery?.firstName
                          ? formData.address.delivery.firstName
                          : ""
                      }
                      className="w-full mt-1 p-2 text-sm md:text-base border border-gray-300 rounded-md focus:ring focus:ring-gray-300 focus:outline-none"
                      placeholder="Enter first name"
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="lastName"
                      className="block text-sm md:text-base font-medium text-gray-600"
                    >
                      Last name
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="delivery.lastName"
                      onChange={handleOnChange}
                      value={
                        formData?.address?.delivery?.lastName
                          ? formData.address.delivery.lastName
                          : ""
                      }
                      className="w-full mt-1 p-2 text-sm md:text-base border border-gray-300 rounded-md focus:ring focus:ring-gray-300 focus:outline-none"
                      placeholder="Enter last name"
                      required
                    />
                  </div>
                </div>
                <div className="block md:flex md:flex-row mt-2 gap-2">
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm md:text-base font-medium text-gray-600"
                    >
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="delivery.email"
                      onChange={handleOnChange}
                      value={
                        formData?.address?.delivery?.email
                          ? formData.address.delivery.email
                          : ""
                      }
                      className="w-full mt-1 p-2 text-sm md:text-base border border-gray-300 rounded-md focus:ring focus:ring-gray-300 focus:outline-none"
                      placeholder="Enter email"
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="street"
                      className="block text-sm md:text-base font-medium text-gray-600"
                    >
                      Street
                    </label>
                    <textarea
                      type="text"
                      id="street"
                      name="delivery.street"
                      rows={1}
                      onChange={handleOnChange}
                      value={
                        formData?.address?.delivery?.street
                          ? formData.address.delivery.street
                          : ""
                      }
                      className="w-full mt-1 p-2 text-sm md:text-base border border-gray-300 rounded-md focus:ring focus:ring-gray-300 focus:outline-none"
                      placeholder="Enter street"
                      required
                    />
                  </div>
                </div>
                <div className="block md:flex md:flex-row mt-2 gap-2">
                  <div>
                    <label
                      htmlFor="city"
                      className="block text-sm md:text-base font-medium text-gray-600"
                    >
                      City
                    </label>
                    <input
                      type="text"
                      id="city"
                      name="delivery.city"
                      onChange={handleOnChange}
                      value={
                        formData?.address?.delivery?.city
                          ? formData.address.delivery.city
                          : ""
                      }
                      className="w-full mt-1 p-2 text-sm md:text-base border border-gray-300 rounded-md focus:ring focus:ring-gray-300 focus:outline-none"
                      placeholder="Enter city"
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="state"
                      className="block text-sm md:text-base font-medium text-gray-600"
                    >
                      State
                    </label>
                    <input
                      type="text"
                      id="state"
                      name="delivery.state"
                      onChange={handleOnChange}
                      value={
                        formData?.address?.delivery?.state
                          ? formData.address.delivery.state
                          : ""
                      }
                      className="w-full mt-1 p-2 text-sm md:text-base border border-gray-300 rounded-md focus:ring focus:ring-gray-300 focus:outline-none"
                      placeholder="Enter state"
                      required
                    />
                  </div>
                </div>
                <div className="block md:flex md:flex-row mt-2 gap-2">
                  <div>
                    <label
                      htmlFor="country"
                      className="block text-sm md:text-base font-medium text-gray-600"
                    >
                      Country
                    </label>
                    <input
                      type="text"
                      id="country"
                      name="delivery.country"
                      onChange={handleOnChange}
                      value={
                        formData?.address?.delivery?.country
                          ? formData.address.delivery.country
                          : ""
                      }
                      className="w-full mt-1 p-2 text-sm md:text-base border border-gray-300 rounded-md focus:ring focus:ring-gray-300 focus:outline-none"
                      placeholder="Enter country"
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="zipcode"
                      className="block text-sm md:text-base font-medium text-gray-600"
                    >
                      Zip code
                    </label>
                    <input
                      type="text"
                      id="zipcode"
                      name="delivery.zipcode"
                      onChange={handleOnChange}
                      value={
                        formData?.address?.delivery?.zipcode
                          ? formData.address.delivery.zipcode
                          : ""
                      }
                      className="w-full mt-1 p-2 text-sm md:text-base border border-gray-300 rounded-md focus:ring focus:ring-gray-300 focus:outline-none"
                      placeholder="Enter zipcode"
                      required
                    />
                  </div>
                </div>
                <div className="block md:flex md:flex-row mt-2 gap-2">
                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-sm md:text-base font-medium text-gray-600"
                    >
                      Phone
                    </label>
                    <input
                      type="text"
                      id="phone"
                      name="delivery.phone"
                      onChange={handleOnChange}
                      value={
                        formData?.address?.delivery?.phone
                          ? formData.address.delivery.phone
                          : ""
                      }
                      className="w-full mt-1 p-2 text-sm md:text-base border border-gray-300 rounded-md focus:ring focus:ring-gray-300 focus:outline-none"
                      placeholder="Enter phone"
                      required
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <p className="p-2 text-xs text-gray-400">
                  Click delivery addres to view more
                </p>
              </div>
            )}
          </div>

          {/* billing address */}
          <div>
            <label
              onClick={toggleBillingAddress}
              className="block text-sm md:text-base font-medium text-gray-600 hover:cursor-pointer"
            >
              <div className="flex flex-row">
                Billing Address
                {adddressIsOpen ? (
                  <span className="pl-2 pt-[2px] ">
                    <MdKeyboardArrowUp className="w-4 h-4 md:w-6 md:h-6 " />
                  </span>
                ) : (
                  <span className="pl-2 pt-[2px] ">
                    <MdKeyboardArrowDown className="w-4 h-4 md:w-6 md:h-6 " />
                  </span>
                )}
              </div>
            </label>
            {billingAdddressIsOpen ? (
              <div className="flex flex-col p-2">
                <div className="block md:flex md:flex-row gap-2">
                  <div>
                    <label
                      htmlFor="firstName"
                      className="block text-sm md:text-base font-medium text-gray-600"
                    >
                      First name
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="billing.firstName"
                      onChange={handleOnChange}
                      value={
                        formData?.address?.billing?.firstName
                          ? formData.address.billing.firstName
                          : ""
                      }
                      className="w-full mt-1 p-2 text-sm md:text-base border border-gray-300 rounded-md focus:ring focus:ring-gray-300 focus:outline-none"
                      placeholder="Enter first name"
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="lastName"
                      className="block text-sm md:text-base font-medium text-gray-600"
                    >
                      Last name
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="billing.lastName"
                      onChange={handleOnChange}
                      value={
                        formData?.address?.billing?.lastName
                          ? formData.address.billing.lastName
                          : ""
                      }
                      className="w-full mt-1 p-2 text-sm md:text-base border border-gray-300 rounded-md focus:ring focus:ring-gray-300 focus:outline-none"
                      placeholder="Enter last name"
                      required
                    />
                  </div>
                </div>
                <div className="block md:flex md:flex-row mt-2 gap-2">
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm md:text-base font-medium text-gray-600"
                    >
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="billing.email"
                      onChange={handleOnChange}
                      value={
                        formData?.address?.billing?.email
                          ? formData.address.billing.email
                          : ""
                      }
                      className="w-full mt-1 p-2 text-sm md:text-base border border-gray-300 rounded-md focus:ring focus:ring-gray-300 focus:outline-none"
                      placeholder="Enter email"
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="street"
                      className="block text-sm md:text-base font-medium text-gray-600"
                    >
                      Street
                    </label>
                    <textarea
                      type="text"
                      id="street"
                      name="billing.street"
                      rows={1}
                      onChange={handleOnChange}
                      value={
                        formData?.address?.billing?.street
                          ? formData.address.billing.street
                          : ""
                      }
                      className="w-full mt-1 p-2 text-sm md:text-base border border-gray-300 rounded-md focus:ring focus:ring-gray-300 focus:outline-none"
                      placeholder="Enter street"
                      required
                    />
                  </div>
                </div>
                <div className="block md:flex md:flex-row mt-2 gap-2">
                  <div>
                    <label
                      htmlFor="city"
                      className="block text-sm md:text-base font-medium text-gray-600"
                    >
                      City
                    </label>
                    <input
                      type="text"
                      id="city"
                      name="billing.city"
                      onChange={handleOnChange}
                      value={
                        formData?.address?.billing?.city
                          ? formData.address.billing.city
                          : ""
                      }
                      className="w-full mt-1 p-2 text-sm md:text-base border border-gray-300 rounded-md focus:ring focus:ring-gray-300 focus:outline-none"
                      placeholder="Enter city"
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="state"
                      className="block text-sm md:text-base font-medium text-gray-600"
                    >
                      State
                    </label>
                    <input
                      type="text"
                      id="state"
                      name="billing.state"
                      onChange={handleOnChange}
                      value={
                        formData?.address?.billing?.state
                          ? formData.address.billing.state
                          : ""
                      }
                      className="w-full mt-1 p-2 text-sm md:text-base border border-gray-300 rounded-md focus:ring focus:ring-gray-300 focus:outline-none"
                      placeholder="Enter state"
                      required
                    />
                  </div>
                </div>
                <div className="block md:flex md:flex-row mt-2 gap-2">
                  <div>
                    <label
                      htmlFor="country"
                      className="block text-sm md:text-base font-medium text-gray-600"
                    >
                      Country
                    </label>
                    <input
                      type="text"
                      id="country"
                      name="billing.country"
                      onChange={handleOnChange}
                      value={
                        formData?.address?.billing?.country
                          ? formData.address.billing.country
                          : ""
                      }
                      className="w-full mt-1 p-2 text-sm md:text-base border border-gray-300 rounded-md focus:ring focus:ring-gray-300 focus:outline-none"
                      placeholder="Enter country"
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="zipcode"
                      className="block text-sm md:text-base font-medium text-gray-600"
                    >
                      Zip code
                    </label>
                    <input
                      type="text"
                      id="zipcode"
                      name="billing.zipcode"
                      onChange={handleOnChange}
                      value={
                        formData?.address?.billing?.zipcode
                          ? formData.address.billing.zipcode
                          : ""
                      }
                      className="w-full mt-1 p-2 text-sm md:text-base border border-gray-300 rounded-md focus:ring focus:ring-gray-300 focus:outline-none"
                      placeholder="Enter zipcode"
                      required
                    />
                  </div>
                </div>
                <div className="block md:flex md:flex-row mt-2 gap-2">
                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-sm md:text-base font-medium text-gray-600"
                    >
                      Phone
                    </label>
                    <input
                      type="text"
                      id="phone"
                      name="billing.phone"
                      onChange={handleOnChange}
                      value={
                        formData?.address?.billing?.phone
                          ? formData.address.billing.phone
                          : ""
                      }
                      className="w-full mt-1 p-2 text-sm md:text-base border border-gray-300 rounded-md focus:ring focus:ring-gray-300 focus:outline-none"
                      placeholder="Enter phone"
                      required
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <p className="p-2 text-xs text-gray-400">
                  Click billing addres to view more
                </p>
              </div>
            )}
          </div>
          <div>
            <label
              onClick={toggleItem}
              className="block text-sm md:text-base font-medium text-gray-600 hover:cursor-pointer"
            >
              <div className="flex flex-row">
                Items
                {itemsIsOpen ? (
                  <span className="pl-2 pt-[2px] ">
                    <MdKeyboardArrowUp className="w-4 h-4 md:w-6 md:h-6 " />
                  </span>
                ) : (
                  <span className="pl-2 pt-[2px] ">
                    <MdKeyboardArrowDown className="w-4 h-4 md:w-6 md:h-6 " />
                  </span>
                )}
              </div>
            </label>
            {itemsIsOpen ? (
              <div className="flex flex-col p-2 w-full">
                <div className="block md:flex md:flex-row gap-2 w-full">
                  <div className="flex-grow">
                    <select
                      id="items"
                      name="items"
                      value={selectedItem}
                      onChange={(e) => setSelectedItem(e.target.value)}
                      className="w-full mt-1 p-2 text-sm md:text-base border border-gray-300 rounded-md focus:ring focus:ring-gray-300 focus:outline-none"
                    >
                      <option value="">Select an item</option>
                      {itemDataList.map((e) => (
                        <option value={e.name} key={e._id}>
                          Item:{" "}
                          {e.name &&
                            e.name.charAt(0).toUpperCase() + e.name.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex-shrink">
                    <button
                      type="button"
                      onClick={handleAddItem}
                      className="mt-1 px-4 py-2 text-sm md:text-base bg-gray-500 text-white rounded-md hover:bg-gray-600"
                    >
                      Add
                    </button>
                  </div>
                </div>

                <div className="block md:flex md:flex-row gap-2 mt-4 w-full">
                  <div className="flex flex-col w-full">
                    <h3 className="mb-2 text-gray-600">Selected Items:</h3>
                    <div className="h-[15vh] w-full md:w-full overflow-y-scroll border-2 rounded-md p-2">
                      <ul className="list-disc ml-4">
                        {itemsSelected.map((item) => (
                          <li
                            key={item.itemId}
                            className="flex py-2 text-sm md:text-base text-gray-700 items-center gap-2"
                          >
                            <div className="flex-col">
                              <div className="flex-row">
                                {item.name} (Qty: {item.quantity})
                                <button
                                  type="button"
                                  onClick={() => handleRemoveItem(item.itemId)}
                                  className="ml-2 px-2 text-center text-lg text-red-500 border border-gray-300 hover:text-white hover:bg-red-700 rounded-md"
                                >
                                  X
                                </button>
                              </div>
                              <select
                                id="status"
                                name="status"
                                onChange={(e) =>
                                  handleStatus(item.itemId, e.target.value)
                                }
                                value={
                                  itemsSelected.find(
                                    (selectedItem) =>
                                      selectedItem.itemId === item.itemId
                                  )?.status || ""
                                }
                                className="w-full mt-2 p-2 text-sm md:text-base border border-gray-300 rounded-md focus:ring focus:ring-gray-300 focus:outline-none"
                                required
                              >
                                <option value="">Status</option>
                                <option value="Processing">Processing</option>
                                <option value="OutDelivery">
                                  Out for delivery
                                </option>
                                <option value="Delivered">Delivered</option>
                              </select>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <p className="p-2 text-xs text-gray-400">
                  Click items to view more
                </p>
              </div>
            )}
          </div>
          <div>
            <label
              htmlFor="amount"
              className="block text-sm md:text-base font-medium text-gray-600"
            >
              Amount
            </label>
            <input
              type="number"
              id="amount"
              name="amount"
              onChange={handleOnChange}
              value={formData.amount === 0 ? "" : formData.amount}
              className="w-full mt-1 p-2 text-sm md:text-base border border-gray-300 rounded-md focus:ring focus:ring-gray-300 focus:outline-none"
              placeholder="Enter amount"
              required
            />
          </div>

          <div>
            <label
              htmlFor="date"
              className="block text-sm md:text-base font-medium text-gray-600"
            >
              Date
            </label>
            <input
              type="date"
              id="date"
              name="date"
              onChange={handleOnChange}
              value={formatDate(formData.date) || formatDate(Date.now())}
              className="w-full mt-1 p-2 text-sm md:text-base border border-gray-300 rounded-md focus:ring focus:ring-gray-300 focus:outline-none"
              placeholder="Enter date"
              required
              disabled
            />
          </div>

          <div>
            <label
              htmlFor="payment"
              className="block text-sm md:text-base font-medium text-gray-600"
            >
              Payment
            </label>
            <select
              id="payment"
              name="payment"
              onChange={handleOnChange}
              value={
                formData.payment === true
                  ? "true"
                  : formData.payment === false
                  ? "false"
                  : ""
              }
              className="w-full mt-1 p-2 text-sm md:text-base border border-gray-300 rounded-md focus:ring focus:ring-gray-300 focus:outline-none"
              required
            >
              <option value="">Select a payment</option>
              <option value="true">Paid</option>
              <option value="false">Not paid</option>
            </select>
          </div>

          <div className="mt-4 mb-5">
            <button
              type="submit"
              className="w-full py-2 text-sm md:text-base bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:ring focus:ring-gray-300 focus:outline-none"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FormOrder;
