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
import CreateChannel from "./pages/Channel/CreateChannel";
import ViewChannel from "./pages/Channel/ViewChannel";
import { useChannelStore } from "./store/useChannelStore";
import CustomizeChannel from "./pages/Channel/CustomizeChannel";
import { Navigate } from "react-router-dom";
import CreateContent from "./pages/Channel/CreateContent";
import CreateVideo from "./pages/Videos/CreateVideo";
import CreateShort from "./pages/Shorts/CreateShort";
import CreatePost from "./pages/Posts/CreatePost";
import CreatePlaylist from "./pages/Playlists/CreatePlaylist";

export const serverURL = "http://localhost:8000";

const ProtectedRoute = ({ loggedInUserData, children }) => {
  if (!loggedInUserData) {
    return <Navigate to="/" replace />;
  }
  return children;
};

const App = () => {
  const { getCurrentLoggedInUser, loggedInUserData } = useUserStore();
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
          <Route
            path="/shorts"
            element={
              <ProtectedRoute
                loggedInUserData={loggedInUserData}
                children={<Shorts />}
              />
            }
          />
          <Route path="/mobileProfileView" element={<ProfileForMobileView />} />
          <Route
            path="/view-channel"
            element={
              <ProtectedRoute
                loggedInUserData={loggedInUserData}
                children={<ViewChannel />}
              />
            }
          />
          <Route
            path="/customize-channel"
            element={
              <ProtectedRoute
                loggedInUserData={loggedInUserData}
                children={<CustomizeChannel />}
              />
            }
          />
          <Route
            path="/create-content"
            element={
              <ProtectedRoute
                loggedInUserData={loggedInUserData}
                children={<CreateContent />}
              />
            }
          />
          <Route
            path="/create-video"
            element={
              <ProtectedRoute
                loggedInUserData={loggedInUserData}
                children={<CreateVideo />}
              />
            }
          />
          <Route
            path="/create-short"
            element={
              <ProtectedRoute
                loggedInUserData={loggedInUserData}
                children={<CreateShort />}
              />
            }
          />
          <Route
            path="/create-post"
            element={
              <ProtectedRoute
                loggedInUserData={loggedInUserData}
                children={<CreatePost />}
              />
            }
          />
          <Route
            path="/create-playlist"
            element={
              <ProtectedRoute
                loggedInUserData={loggedInUserData}
                children={<CreatePlaylist />}
              />
            }
          />
        </Route>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route
          path="/create-channel"
          element={
            <ProtectedRoute
              loggedInUserData={loggedInUserData}
              children={<CreateChannel />}
            />
          }
        />
      </Routes>
    </>
  );
};

export default App;
