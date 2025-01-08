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
import StoreLayout from "./Layout";
import StoreDashboardCard from "./components/DashboardCard";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

axios.defaults.baseURL =
  import.meta.env.VITE_BACKEND_URL || "http://13.229.205.154:4000/";

const StorePage = () => {
  const [dataList, setDataList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("/api/store/dashboardCount", {
          headers: {
            Authorization: `Bearer ${token}`,
            token: token,
          },
        });

        if (response.data.success) {
          setDataList(response.data.data);
        }
      } catch (error) {
        setError(error.response?.data?.message || "Error fetching data");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <StoreLayout>
      <div className="flex justify-center py-5">
        <h1 className="text-2xl font-bold text-slate-800 mt-4">
          Store Dashboard
        </h1>
      </div>
      <StoreDashboardCard dataList={dataList} />
    </StoreLayout>
  );
};

export default StorePage;
