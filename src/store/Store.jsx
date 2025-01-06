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
  import.meta.env.VITE_BACKEND_URL || "http://localhost:4000/";

const StorePage = () => {
  const [dataList, setDataList] = useState([]);
  const [token, setToken] = useState("");
  const [profile, setProfile] = useState({});

  useEffect(() => {
    if (localStorage.getItem("token")) {
      setToken(localStorage.getItem("token"));
    }

    if (!token) return;

    const fetchUserData = async () => {
      try {
        const decoded = jwtDecode(token);

        // Fetch profile
        const profileResponse = await axios.get(
          `/api/user/profile/${decoded.id}`,
          {
            headers: { token },
          }
        );
        setProfile(profileResponse.data);
        getData(profile.id);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [token, profile]);

  const getData = async (userId) => {
    const data = await axios.get("/api/store/dashboardCount", {
      params: { id: userId },
    });
    if (data.data.success) {
      setDataList(data.data.data);
    }
  };

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
