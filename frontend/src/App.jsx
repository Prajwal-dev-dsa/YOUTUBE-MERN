import React, { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import CustomAlert from "./components/CustomAlert";
import Shorts from "./pages/Shorts";
import { useUserStore } from "./store/useUserStore";
import ProfileForMobileView from "./components/ProfileForMobileView";
import ForgotPassword from "./pages/ForgotPassword";
import CreateChannel from "./pages/channel/CreateChannel";
import ViewChannel from "./pages/channel/ViewChannel";
import { useChannelStore } from "./store/useChannelStore";
import CustomizeChannel from "./pages/channel/CustomizeChannel";

export const serverURL = "http://localhost:8000";

const App = () => {
  const { getCurrentLoggedInUser } = useUserStore();
  const { getUserChannel } = useChannelStore();
  useEffect(() => {
    getCurrentLoggedInUser();
    getUserChannel();
  }, [getCurrentLoggedInUser, getUserChannel]);
  return (
    <>
      <CustomAlert />
      <Routes>
        <Route path="/" element={<Home />}>
          <Route path="/shorts" element={<Shorts />} />
          <Route path="/mobileProfileView" element={<ProfileForMobileView />} />
          <Route path="/view-channel" element={<ViewChannel />} />
          <Route path="/customize-channel" element={<CustomizeChannel />} />
        </Route>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/create-channel" element={<CreateChannel />} />
      </Routes>
    </>
  );
};

export default App;
