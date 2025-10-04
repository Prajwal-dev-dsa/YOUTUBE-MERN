import React, { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import CustomAlert from "./components/CustomAlert";
import Shorts from "./pages/Shorts";
import { useUserStore } from "./store/useUserStore";
import ProfileForMobileView from "./components/ProfileForMobileView";

export const serverURL = "http://localhost:8000";

const App = () => {
  const { getCurrentLoggedInUser } = useUserStore();
  useEffect(() => {
    getCurrentLoggedInUser();
  }, [getCurrentLoggedInUser]);
  return (
    <>
      <CustomAlert />
      <Routes>
        <Route path="/" element={<Home />}>
          <Route path="/shorts" element={<Shorts />} />
          <Route path="/mobileProfileView" element={<ProfileForMobileView />} />
        </Route>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </>
  );
};

export default App;
