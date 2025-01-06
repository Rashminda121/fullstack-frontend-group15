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
import { gapi } from "gapi-script";
import { useEffect } from "react";
import GoogleLogin, { GoogleLogout } from "react-google-login";

const GoogleLoginComponent = () => {
  useEffect(() => {
    const initClient = () => {
      gapi.client.init({
        clientId: process.env.GOOGLE_CLIENT_ID,
        scope: "",
      });
    };
    gapi.load("client:auth2", initClient);
  }, []);

  const onSuccess = async (res) => {
    console.log("Login Success: currentUser:", res.profileObj);
    try {
      const response = await axios.post("/api/user/google-login", {
        token: res.tokenId,
      });
      console.log("Server response:", response.data);
    } catch (error) {
      console.error("Error sending token to server:", error);
    }
  };

  const onFailure = (res) => {
    console.log("Login failed: res:", res);
  };

  const onLogoutSuccess = () => {
    console.log("Logout successful");
  };

  return (
    <div>
      <GoogleLogin
        clientId={process.env.GOOGLE_CLIENT_ID}
        buttonText="Login with Google"
        onSuccess={onSuccess}
        onFailure={onFailure}
        cookiePolicy={"single_host_origin"}
        style={{ marginTop: "100px" }}
        isSignedIn={true}
      />
      <GoogleLogout
        clientId={process.env.GOOGLE_CLIENT_ID}
        buttonText="Logout"
        onLogoutSuccess={onLogoutSuccess}
      />
    </div>
  );
};

export default GoogleLoginComponent;
