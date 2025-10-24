import React, { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import CustomAlert from "./components/CustomAlert";
import Shorts from "./pages/Shorts/Shorts";
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
import { useContentStore } from "./store/useContentStore";
import PlayVideo from "./pages/Videos/PlayVideo";
import PlayShort from "./pages/Shorts/PlayShort";
import ChannelPage from "./pages/Channel/ChannelPage";
import LikedContent from "./pages/LikedContent";
import SavedContent from "./pages/SavedContent";
import SavedPlaylist from "./pages/SavedPlaylist";
import { useSubscribedContentStore } from "./store/useSubscribedContentStore";
import Subscriptions from "./pages/Subscriptions";
import { useHistoryStore } from "./store/useHistoryStore";
import History from "./pages/History";
import { useRecommendedStore } from "./store/useRecommendedStore";
import YtStudio from "./pages/YtStudio";
import Dashboard from "./components/Dashboard";
import Analytics from "./components/Analytics";
import Content from "./components/Content";
import Revenue from "./components/Revenue";
import UpdateVideo from "./pages/Videos/UpdateVideo";
import UpdateShort from "./pages/Shorts/UpdateShort";
import UpdatePlaylist from "./pages/Playlists/UpdatePlaylist";
import UpdatePost from "./pages/Posts/UpdatePost";

export const serverURL = "http://localhost:8000";

const ProtectedRoute = ({ loggedInUserData, children }) => {
  if (!loggedInUserData) {
    return <Navigate to="/" replace />;
  }
  return children;
};

const App = () => {
  const { getCurrentLoggedInUser, loggedInUserData } = useUserStore();
  const { getUserChannel, getAllChannels } = useChannelStore();
  const { getAllVideos, getAllShorts } = useContentStore();
  const { getSubscribedContentData } = useSubscribedContentStore();
  const { getHistory } = useHistoryStore();
  const { getRecommendedContent } = useRecommendedStore();
  useEffect(() => {
    getCurrentLoggedInUser();
    getUserChannel();
    getAllVideos();
    getAllShorts();
    getAllChannels();
    getSubscribedContentData();
    getHistory();
    getRecommendedContent();
  }, [
    getCurrentLoggedInUser,
    getUserChannel,
    getAllVideos,
    getAllShorts,
    getAllChannels,
    getSubscribedContentData,
    getHistory,
    getRecommendedContent,
  ]);
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
          <Route
            path="/channel-page/:channelId"
            element={
              <ProtectedRoute
                loggedInUserData={loggedInUserData}
                children={<ChannelPage />}
              />
            }
          />
          <Route
            path="/liked-content"
            element={
              <ProtectedRoute
                loggedInUserData={loggedInUserData}
                children={<LikedContent />}
              />
            }
          />
          <Route
            path="/saved-content"
            element={
              <ProtectedRoute
                loggedInUserData={loggedInUserData}
                children={<SavedContent />}
              />
            }
          />
          <Route
            path="/saved-playlist"
            element={
              <ProtectedRoute
                loggedInUserData={loggedInUserData}
                children={<SavedPlaylist />}
              />
            }
          />
          <Route
            path="/subscriptions"
            element={
              <ProtectedRoute
                loggedInUserData={loggedInUserData}
                children={<Subscriptions />}
              />
            }
          />
          <Route
            path="/history"
            element={
              <ProtectedRoute
                loggedInUserData={loggedInUserData}
                children={<History />}
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
        <Route path="/play-video/:videoId" element={<PlayVideo />} />
        <Route path="/play-short/:shortId" element={<PlayShort />} />

        <Route
          path="/yt-studio"
          element={
            <ProtectedRoute
              loggedInUserData={loggedInUserData}
              children={<YtStudio />}
            />
          }
        >
          <Route
            path="dashboard"
            element={
              <ProtectedRoute
                loggedInUserData={loggedInUserData}
                children={<Dashboard />}
              />
            }
          />
          <Route
            path="analytics"
            element={
              <ProtectedRoute
                loggedInUserData={loggedInUserData}
                children={<Analytics />}
              />
            }
          />
          <Route
            path="content"
            element={
              <ProtectedRoute
                loggedInUserData={loggedInUserData}
                children={<Content />}
              />
            }
          />
          <Route
            path="revenue"
            element={
              <ProtectedRoute
                loggedInUserData={loggedInUserData}
                children={<Revenue />}
              />
            }
          />
          <Route
            path="content/update-video/:videoId"
            element={
              <ProtectedRoute
                loggedInUserData={loggedInUserData}
                children={<UpdateVideo />}
              />
            }
          />
          <Route
            path="content/update-short/:shortId"
            element={
              <ProtectedRoute
                loggedInUserData={loggedInUserData}
                children={<UpdateShort />}
              />
            }
          />
          <Route
            path="content/update-playlist/:playlistId"
            element={
              <ProtectedRoute
                loggedInUserData={loggedInUserData}
                children={<UpdatePlaylist />}
              />
            }
          />
          <Route
            path="content/update-post/:postId"
            element={
              <ProtectedRoute
                loggedInUserData={loggedInUserData}
                children={<UpdatePost />}
              />
            }
          />
        </Route>
      </Routes>
    </>
  );
};

export default App;
