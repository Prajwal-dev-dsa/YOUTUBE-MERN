import React from "react";
import { useNavigate } from "react-router-dom";

const VideoCard = ({
  thumbnail,
  duration,
  channelLogo,
  title,
  channelName,
  views,
  id,
}) => {
  const navigate = useNavigate();
  return (
    <div
      className="w-full cursor-pointer"
      onClick={() => navigate(`/play-video/${id}`)}
    >
      <div className="relative">
        <img
          src={thumbnail}
          alt={title}
          className="rounded-xl w-full sm:h-[160px] h-[200px] border-1 border-gray-800 object-cover"
        />
        <span className="absolute bottom-2 right-2 bg-black/50 text-white px-2 py-1 rounded-lg text-xs">
          {duration}
        </span>
      </div>
      <div className="flex mt-3">
        <img
          src={channelLogo}
          alt={channelName}
          className="w-11 h-11 mr-3 rounded-full"
        />
        <div>
          <h3 className="text-xs text-gray-400 font-semibold mt-1">{title}</h3>
          <div className="flex gap-2 mt-1">
            <p className="text-xs text-gray-400">{channelName}</p>
            <p className="text-xs text-gray-400">.</p>
            <p className="text-xs text-gray-400">{views} views</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoCard;
