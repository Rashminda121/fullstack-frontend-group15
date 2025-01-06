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

import React, { useState } from "react";
import Slider from "react-slick";

const StoreOffers = ({ offerDataList = [] }) => {
  const [selectedOffer, setSelectedOffer] = useState(null);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 15000,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  const handleImageClick = (offer) => {
    setSelectedOffer(offer);
  };

  const closeModal = () => {
    setSelectedOffer(null);
  };

  return (
    <div id="storeOffers" className="py-8 px-4">
      <h2 className="text-xl font-medium mb-6 text-gray-800 relative inline-block after:content-[''] after:block after:mt-1 after:h-1 after:w-full after:bg-gradient-to-r after:from-gray-700 after:to-gray-200">
        Store Offers
      </h2>

      <Slider {...settings}>
        {offerDataList.map((offer, index) => (
          <div
            key={index}
            className="p-2 cursor-pointer"
            onClick={() => handleImageClick(offer)}
          >
            <img
              src={offer.image}
              alt={offer.description}
              className="rounded-lg w-full h-[15vw] md:h-[20vw] object-contain"
            />
          </div>
        ))}
      </Slider>

      {selectedOffer && (
        <div className="fixed inset-0 p-5 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-4 w-10/12 md:w-2/4 lg:w-1/4 relative shadow-lg">
            <button
              className="absolute top-4 right-4 p-2 font-bold text-gray-700 hover:text-white hover:bg-gray-700 rounded-md focus:outline-none"
              onClick={closeModal}
            >
              ✕
            </button>
            <img
              src={selectedOffer.image}
              alt={selectedOffer.storeName}
              className="mt-2 rounded-lg w-full max-h-60 object-contain mb-4"
            />
            <h3 className="p-2 border-l-2 border-gray-400 text-sm md:text-base font-bold text-gray-800 mb-2">
              Store:{" "}
              <span className="text-gray-500 font-medium">
                {selectedOffer.storeName}
              </span>
            </h3>
            <p className="p-2 border-l-2 border-gray-400 text-xs md:text-sm font-bold text-gray-800 mb-2 ">
              Store email:{" "}
              <span className="text-gray-500 font-medium">
                {selectedOffer.store}
              </span>
            </p>

            <p className="p-2 border-l-2 border-gray-400 text-xs md:text-sm font-bold text-gray-800 mb-2">
              Offer description:
            </p>
            <textarea
              rows={2}
              className="w-full h-24 p-2 border rounded-lg text-xs md:text-sm text-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-300"
              defaultValue={selectedOffer.description}
              readOnly
            ></textarea>
            <div className="mb-2 mt-3 h-1 w-full bg-gray-200"></div>
            <div className="mb-2 bg-gray-100 border-l-4 border-gray-500 text-gray-800 p-3 mt-4 rounded-md">
              <p className="text-xs font-medium">
                <strong>Note:</strong> This offer is valid for a limited time
                only. Terms and conditions apply.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StoreOffers;
