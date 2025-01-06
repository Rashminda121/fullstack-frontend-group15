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

import { MdClose } from "react-icons/md";

const FormItems = ({
  handleSubmit,
  handleOnChange,
  toggleForm,
  storeDataList = [],
  categoryDataList = [],
  formData = {},
}) => {
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
          Item Details
        </h2>

        <form
          onSubmit={handleSubmit}
          className="flex-grow space-y-4 overflow-y-auto"
        >
          <div>
            <label
              htmlFor="name"
              className="block text-sm md:text-base font-medium text-gray-600"
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              onChange={handleOnChange}
              value={formData.name}
              className="w-full mt-1 p-2 text-sm md:text-base border border-gray-300 rounded-md focus:ring focus:ring-gray-300 focus:outline-none"
              placeholder="Enter name"
              required
            />
          </div>

          <div>
            <label
              htmlFor="store"
              className="block text-sm md:text-base font-medium text-gray-600"
            >
              Store
            </label>
            <select
              id="store"
              name="store"
              onChange={handleOnChange}
              value={formData.store ? formData.store : ""}
              className="w-full mt-1 p-2 text-sm md:text-base border border-gray-300 rounded-md focus:ring focus:ring-gray-300 focus:outline-none"
              required
            >
              <option value="">Select a store</option>
              {storeDataList.map((e) => (
                <option value={e.email}>
                  {e.name && e.name.charAt(0).toUpperCase() + e.name.slice(1)}{" "}
                  Store: {e.email}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-sm md:text-base font-medium text-gray-600"
            >
              Description
            </label>
            <textarea
              rows={2}
              id="description"
              name="description"
              onChange={handleOnChange}
              value={formData.description}
              className="w-full mt-1 p-2 text-sm md:text-base border border-gray-300 rounded-md focus:ring focus:ring-gray-300 focus:outline-none"
              placeholder="Enter description"
              required
            ></textarea>
          </div>

          <div>
            <label
              htmlFor="price"
              className="block text-sm md:text-base font-medium text-gray-600"
            >
              Price
            </label>
            <input
              type="number"
              id="price"
              name="price"
              onChange={handleOnChange}
              value={formData.price === 0 ? "" : formData.price}
              className="w-full mt-1 p-2 text-sm md:text-base border border-gray-300 rounded-md focus:ring focus:ring-gray-300 focus:outline-none"
              placeholder="Enter price"
              required
            />
          </div>

          <div>
            <label
              htmlFor="category"
              className="block text-sm md:text-base font-medium text-gray-600"
            >
              Category
            </label>
            <select
              id="category"
              name="category"
              onChange={handleOnChange}
              value={formData.category ? formData.category : ""}
              className="w-full mt-1 p-2 text-sm md:text-base border border-gray-300 rounded-md focus:ring focus:ring-gray-300 focus:outline-none"
              required
            >
              <option value="">Select a category</option>
              {categoryDataList.map((e) => (
                <option value={e.name}>
                  {e.name && e.name.charAt(0).toUpperCase() + e.name.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="image"
              className="block text-sm md:text-base font-medium text-gray-600"
            >
              Image
              <span className="ml-2 text-xs text-gray-500">
                (Max size: 5MB)
              </span>
              <img
                src={formData.image ? formData.image : "/image-upload.png"}
                alt="Uploaded preview"
                className="mt-2"
                width={50}
              />
            </label>

            <input
              type="file"
              label="Image"
              id="image"
              name="image"
              accept=".jpeg,.jpg,.png"
              onChange={handleOnChange}
              hidden
              className="w-full mt-1 mb-3 p-2 text-sm md:text-base border border-gray-300 rounded-md focus:ring focus:ring-gray-300 focus:outline-none"
            />
            {formData.image ? (
              <p className="mt-2 text-xs text-gray-600">Selected Image.</p>
            ) : (
              <p className="mt-2 text-xs text-gray-600">No image selected.</p>
            )}
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

export default FormItems;
