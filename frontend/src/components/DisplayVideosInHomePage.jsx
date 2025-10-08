import React, { useEffect, useState } from "react";
import { useContentStore } from "../store/useContentStore";
import VideoCard from "./VideoCard";

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

const DisplayVideosInHomePage = () => {
  const { videos, getAllVideos } = useContentStore();
  const [duration, setDuration] = useState({});

  useEffect(() => {
    getAllVideos();
  }, [getAllVideos]);

  useEffect(() => {
    if (Array.isArray(videos) && videos.length > 0) {
      videos.forEach((video) => {
        getVideoDuration(video.videoUrl, (formattedTime) => {
          setDuration((prev) => ({ ...prev, [video._id]: formattedTime }));
        });
      });
    }
  }, [videos]);
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-x-4 gap-y-8 p-4">
      {videos?.map((video) => (
        <VideoCard
          key={video?._id}
          thumbnail={video?.thumbnail}
          duration={duration[video?._id] || "0:00"}
          channelLogo={video?.channel?.avatar}
          title={video?.title}
          channelName={video?.channel?.name}
          views={video?.views}
          id={video?._id}
        />
      ))}
    </div>
  );
};

export default DisplayVideosInHomePage;
