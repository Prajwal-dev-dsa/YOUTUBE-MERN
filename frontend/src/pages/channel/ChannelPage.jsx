import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useChannelStore } from "../../store/useChannelStore";
import { useUserStore } from "../../store/useUserStore";
import axios from "axios";
import { serverURL } from "../../App";
import ShortCard from "../../components/ShortCard";
import VideoCard from "../../components/VideoCard";
import { useContentStore } from "../../store/useContentStore";
import PlaylistCard from "../../components/PlaylistCard";
import CommunityPostCard from "../../components/CommunityPostCard";
import { useSubscribedContentStore } from "../../store/useSubscribedContentStore";

const getVideoDuration = (videoUrl, callback) => {
  const video = document.createElement("video");
  video.preload = "metadata";
  video.src = videoUrl;
  video.onloadedmetadata = () => {
    const duration = video.duration;
    const minutes = Math.floor((duration % 3600) / 60);
    const seconds = Math.floor(duration % 60);
    const formattedTime = `${minutes}:${seconds.toString().padStart(2, "0")}`;
    callback(formattedTime);
  };
  video.onerror = () => {
    callback("0:00");
  };
};

const ChannelPage = () => {
  const { channelId } = useParams();
  const { allChannelsData } = useChannelStore();
  const { getSubscribedContentData, subscribedChannels } =
    useSubscribedContentStore();
  const { loggedInUserData } = useUserStore();
  const channelData = allChannelsData.find(
    (channel) => channel?._id === channelId
  );
  const [channel, setChannel] = useState(channelData);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedTab, setSelectedTab] = useState("Videos");
  const { videos, getAllVideos } = useContentStore();
  const [duration, setDuration] = useState({});

  useEffect(() => {
    if (allChannelsData && channelId) {
      const currentChannelData = allChannelsData.find(
        (ch) => ch?._id === channelId
      );
      setChannel(currentChannelData);
      window.scrollTo(0, 0);
    }
  }, [channelId, allChannelsData]);

  useEffect(() => {
    getAllVideos();
    getSubscribedContentData();
  }, [getAllVideos, getSubscribedContentData]);

  useEffect(() => {
    if (!channel || !loggedInUserData) return;
    const isActuallySubscribed = subscribedChannels.some(
      (subbedChannel) => subbedChannel._id === channel._id
    );
    setIsSubscribed(isActuallySubscribed);
  }, [channel, loggedInUserData, subscribedChannels]);

  useEffect(() => {
    if (Array.isArray(videos) && videos.length > 0) {
      videos.forEach((video) => {
        if (video?.videoUrl) {
          getVideoDuration(video.videoUrl, (formattedTime) => {
            setDuration((prev) => ({ ...prev, [video._id]: formattedTime }));
          });
        }
      });
    }
  }, [videos]);

  const handleSubscribe = async () => {
    if (!channel) return;
    setLoading(true);
    try {
      const response = await axios.post(
        `${serverURL}/api/user/toggle-subscribers`,
        { channelId: channel._id },
        { withCredentials: true }
      );
      setChannel((prev) => ({
        ...prev,
        subscribers: response.data?.subscribers || prev.subscribers,
      }));
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  if (!channel) {
    return (
      <div className="w-full min-h-[80vh] bg-[#0f0f0f] text-white flex justify-center items-center">
        Loading Channel...
      </div>
    );
  }

  const handlePostUpdate = (updatedPost) => {
    setChannel((prevChannel) => {
      const updatedPosts = prevChannel.communityPosts.map((post) =>
        post._id === updatedPost._id ? updatedPost : post
      );
      return { ...prevChannel, communityPosts: updatedPosts };
    });
  };

  const renderContent = () => {
    switch (selectedTab) {
      case "Videos":
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 cup">
            {channel.videos?.map((video) => (
              <VideoCard
                key={video._id}
                id={video._id}
                thumbnail={video.thumbnail}
                title={video.title}
                channelName={channel.name}
                channelLogo={channel.avatar}
                views={video.views}
                duration={duration[video?._id] || "..."}
              />
            ))}
          </div>
        );
      case "Shorts":
        return (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {channel.shorts?.map((short) => (
              <ShortCard
                key={short._id}
                id={short._id}
                shortUrl={short.shortUrl}
                title={short.title}
                channelName={channel.name}
                avatar={channel.avatar}
                views={short.views}
              />
            ))}
          </div>
        );
      case "Playlists":
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {channel.playlists?.map((playlist) => (
              <PlaylistCard
                key={playlist._id}
                id={playlist?._id}
                title={playlist?.title}
                videos={playlist?.videos}
                savedBy={playlist?.savedBy}
              />
            ))}
          </div>
        );
      case "Community Posts":
        return (
          <div className="max-w-2xl mx-auto space-y-4">
            {channel.communityPosts?.map((post) => (
              <CommunityPostCard
                key={post._id}
                post={post}
                onUpdatePost={handlePostUpdate}
              />
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full bg-[#0f0f0f] text-white min-h-screen">
      <div className="w-full h-32 md:h-48">
        <img
          src={channel.banner}
          alt="Channel Banner"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="p-4 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <img
            src={channel.avatar}
            alt="Channel Avatar"
            className="size-24 sm:size-32 rounded-full border-4 border-[#0f0f0f] -mt-12 sm:-mt-16 flex-shrink-0"
          />
          <div className="flex-grow text-center sm:text-left mt-2 sm:mt-0">
            <h1 className="text-2xl font-bold">{channel.name}</h1>
            <div className="flex items-center justify-center sm:justify-start gap-x-3 text-sm text-gray-400 mt-1 flex-wrap">
              <span>{channel.subscribers?.length || 0} subscribers</span>
              <span>•</span>
              <span>{channel.videos?.length || 0} videos</span>
              <span>•</span>
              <span>{channel.category || "No Category"}</span>
            </div>
          </div>
          <div className="w-full sm:w-auto mt-4 sm:mt-0 flex-shrink-0">
            <button
              onClick={handleSubscribe}
              disabled={loading}
              className={`w-full sm:w-auto font-semibold px-5 py-2 rounded-full transition ${
                isSubscribed
                  ? "bg-neutral-800 text-white hover:bg-neutral-700"
                  : "bg-white text-black hover:bg-neutral-200"
              }`}
            >
              {isSubscribed ? "Subscribed" : "Subscribe"}
            </button>
          </div>
        </div>

        <div className="mt-6 border-b border-neutral-800">
          <div className="overflow-x-auto scrollbar-hide">
            <nav className="flex space-x-2 sm:space-x-4 whitespace-nowrap -mb-px">
              {["Videos", "Shorts", "Playlists", "Community Posts"].map(
                (tab) => (
                  <button
                    key={tab}
                    onClick={() => setSelectedTab(tab)}
                    className={`py-3 px-3 sm:px-4 text-sm cursor-pointer font-semibold transition ${
                      selectedTab === tab
                        ? "text-white border-b-2 border-white"
                        : "text-gray-400 hover:text-white"
                    }`}
                  >
                    {tab}
                  </button>
                )
              )}
            </nav>
          </div>
        </div>

        <div className="mt-6">{renderContent()}</div>
      </div>
    </div>
  );
};

export default ChannelPage;
