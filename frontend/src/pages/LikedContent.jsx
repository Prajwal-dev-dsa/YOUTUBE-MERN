import React, { useEffect, useState } from "react";
import axios from "axios";
import { serverURL } from "../App";
import DisplayVideosInHomePage from "../components/DisplayVideosInHomePage";
import DisplayShortsInHomePage from "../components/DisplayShortsInHomePage";
import { SiYoutubeshorts } from "react-icons/si";
import ShortCard from "../components/ShortCard";
import { GoVideo } from "react-icons/go";
import VideoCard from "../components/VideoCard";

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

const LikedContent = () => {
  const [likedVideos, setLikedVideos] = useState([]);
  const [likedShorts, setLikedShorts] = useState([]);

  const [duration, setDuration] = useState({});

  useEffect(() => {
    if (Array.isArray(likedVideos) && likedVideos.length > 0) {
      likedVideos.forEach((video) => {
        getVideoDuration(video.videoUrl, (formattedTime) => {
          setDuration((prev) => ({ ...prev, [video._id]: formattedTime }));
        });
      });
    }
  }, [likedVideos]);

  useEffect(() => {
    const fetchLikedVideos = async () => {
      try {
        const videosResponse = await axios.get(
          `${serverURL}/api/content/getUserLikedVideos`,
          {
            withCredentials: true,
          }
        );
        console.log(videosResponse);

        setLikedVideos(videosResponse.data);
      } catch (error) {
        console.log(error);
      }
    };
    const fetchLikedShorts = async () => {
      try {
        const shortsResponse = await axios.get(
          `${serverURL}/api/content/getUserLikedShorts`,
          {
            withCredentials: true,
          }
        );
        console.log(shortsResponse);

        setLikedShorts(shortsResponse.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchLikedVideos();
    fetchLikedShorts();
  }, []);

  if (likedVideos.length === 0 && likedShorts.length === 0) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <h2 className="text-2xl text-gray-400 font-semibold">
          No liked content found
        </h2>
      </div>
    );
  }
  return (
    <div className="px-6 py-4 min-h-screen">
      {likedVideos.length > 0 && (
        <>
          <h2 className="text-2xl font-semibold mb-6 border-b border-gray-300 pb-2 flex items-center gap-2">
            <SiYoutubeshorts className="size-7 text-red-600" />
            Shorts
          </h2>
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
            {likedShorts.map((short) => (
              <div className="flex-shrink-0" key={short._id}>
                <ShortCard
                  shortUrl={short?.shortUrl}
                  title={short?.title}
                  channelName={short?.channel?.name}
                  avatar={short?.channel?.avatar}
                  views={short?.views}
                  id={short?._id}
                />
              </div>
            ))}
          </div>
        </>
      )}
      {likedVideos.length > 0 && (
        <>
          <h2 className="text-2xl font-semibold mb-6 pt-[50px] border-b border-gray-300 pb-2 flex items-center gap-2">
            <GoVideo className="size-7 text-red-600" />
            Videos
          </h2>
          <div className="flex flex-wrap">
            {likedVideos.map((video) => (
              <div className="sm:size-60 size-87 flex-shrink-0" key={video._id}>
                <VideoCard
                  videoUrl={video?.videoUrl}
                  title={video?.title}
                  channelName={video?.channel?.name}
                  channelLogo={video?.channel?.avatar}
                  thumbnail={video?.thumbnail}
                  views={video?.views}
                  id={video?._id}
                  duration={duration[video?._id] || "0:00"}
                />
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default LikedContent;
