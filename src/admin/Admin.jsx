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
import DashboardCard from "./components/DashboardCard";
import AdminLayout from "./layout";

axios.defaults.baseURL =
  import.meta.env.VITE_BACKEND_URL || "http://localhost:4000/";

const AdminPage = () => {
  const [dataList, setDataList] = useState([]);

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    const data = await axios.get("/api/admin/dashboardCount");
    if (data.data.success) {
      setDataList(data.data.data);
    }
  };

  return (
    <AdminLayout>
      <div className="flex justify-center py-5">
        <h1 className="text-2xl font-bold text-slate-800 mt-4">
          Admin Dashboard
        </h1>
      </div>
      <DashboardCard dataList={dataList} />
    </AdminLayout>
  );
};

export default AdminPage;
