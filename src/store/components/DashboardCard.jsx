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

const StoreDashboardCard = ({ dataList = [] }) => {
  return (
    <div className="flex flex-wrap justify-center gap-6">
      {dataList.map((item, index) => (
        <div
          key={index}
          className="flex flex-col items-center justify-center rounded-lg bg-white shadow-md p-6 border border-slate-200 transition-transform transform hover:scale-105 h-64 w-64"
        >
          <div className="text-center pb-6 w-full border-b border-slate-200">
            <p className="text-sm uppercase font-semibold text-slate-500">
              {item.title}
            </p>
            <h1 className="text-6xl font-bold text-slate-800 mt-4">
              {item.count}
            </h1>
          </div>
          <div className="mt-6 w-full py-2 rounded-md bg-slate-800 font-medium shadow-md hover:bg-slate-700 focus:ring-2 focus:ring-slate-600 focus:ring-offset-2"></div>
        </div>
      ))}
    </div>
  );
};

export default StoreDashboardCard;
