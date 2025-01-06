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

const FormRequest = ({
  handleSubmit,
  handleOnChange,
  toggleForm,
  formData = {},
  userDataList = [],
}) => {
  return (
    <div className="fixed p-5 inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-md h-[72vh] p-6 rounded-lg shadow-md relative flex flex-col">
        <button
          className="absolute p-2 top-3 right-3 text-gray-500 hover:text-white hover:bg-gray-600 rounded-md"
          onClick={toggleForm}
        >
          <MdClose size={18} />
        </button>

        <h2 className="text-xl font-semibold text-gray-700 text-center mb-4">
          Request Details
        </h2>

        <form
          onSubmit={handleSubmit}
          className="flex-grow space-y-4 overflow-y-auto"
        >
          <div>
            <label
              htmlFor="email"
              className="block text-sm md:text-base font-medium text-gray-600"
            >
              Users
            </label>
            <select
              id="email"
              name="email"
              onChange={handleOnChange}
              value={formData.email ? formData.email : ""}
              className="w-full mt-1 p-2 text-sm md:text-base border border-gray-300 rounded-md focus:ring focus:ring-gray-300 focus:outline-none"
              required
            >
              <option value="">Select a user</option>
              {userDataList.map((e) => (
                <option value={e.email} key={e._id}>
                  {e.name && e.name.charAt(0).toUpperCase() + e.name.slice(1)} :{" "}
                  {e.email}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label
              htmlFor="type"
              className="block text-sm md:text-base font-medium text-gray-600"
            >
              Type
            </label>
            <input
              type="text"
              id="type"
              name="type"
              onChange={handleOnChange}
              value={formData.type ? formData.type : ""}
              className="w-full mt-1 p-2 text-sm md:text-base border border-gray-300 rounded-md focus:ring focus:ring-gray-300 focus:outline-none"
              placeholder="Enter request heading"
              required
            />
          </div>
          <div>
            <label
              htmlFor="request"
              className="block text-sm md:text-base font-medium text-gray-600"
            >
              Request
            </label>
            <textarea
              rows={2}
              id="request"
              name="request"
              onChange={handleOnChange}
              value={formData.request ? formData.request : ""}
              className="w-full mt-1 p-2 text-sm md:text-base border border-gray-300 rounded-md focus:ring focus:ring-gray-300 focus:outline-none"
              placeholder="Enter request"
              required
            ></textarea>
          </div>
          <div>
            <label
              htmlFor="state"
              className="block text-sm md:text-base font-medium text-gray-600"
            >
              State
            </label>
            <select
              id="state"
              name="state"
              onChange={handleOnChange}
              value={formData.state ? formData.state : ""}
              className="w-full mt-1 p-2 text-sm md:text-base border border-gray-300 rounded-md focus:ring focus:ring-gray-300 focus:outline-none"
              required
            >
              <option value="">Select a state</option>
              <option value="pending">Pending</option>
              <option value="reviewing">Reviewing</option>
              <option value="rejected">Rejected</option>
              <option value="accepted">Accepted</option>
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

export default FormRequest;
