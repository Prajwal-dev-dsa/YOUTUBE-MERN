import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useContentStore } from "../../store/useContentStore";
import {
  FaBackward,
  FaBookmark,
  FaDownload,
  FaExpand,
  FaForward,
  FaPause,
  FaPlay,
  FaThumbsDown,
  FaThumbsUp,
  FaVolumeMute,
  FaVolumeUp,
} from "react-icons/fa";
import { SiYoutubeshorts } from "react-icons/si";
import ShortCard from "../../components/ShortCard";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "../../store/useUserStore";
import VideoDescription from "../../components/VideoDescription";

const IconButtons = ({ icon: Icon, active, label, count, onClick }) => {
  return (
    <button className="flex flex-col items-center" onClick={onClick}>
      <div
        className={`${active} "bg-white":"bg-black border border-gray-900" p-3 rounded-full hover:bg-gray-800 transition duration-200 cursor-pointer`}
      >
        <Icon
          size={14}
          className={`${active ? "text-red-600" : "text-white"}`}
        />
      </div>
      <div className="flex justify-center items-center mt-2">
        <span className="text-xs text-gray-400">{label}</span>
        <span className="text-xs text-gray-400">{count}</span>
      </div>
    </button>
  );
};

const PlayVideo = () => {
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const { videoId } = useParams();
  const [video, setVideo] = useState(null);
  const [channel, setChannel] = useState(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.5);

  const { videos, shorts } = useContentStore();
  const { loggedInUserData } = useUserStore();

  const suggestedVideos =
    videos?.filter((video) => video._id !== videoId).slice(0, 10) || [];
  const suggestedShorts = shorts?.slice(0, 10) || [];

  useEffect(() => {
    if (!videos) return;
    const currentVideo = videos.find((video) => video._id === videoId);
    if (currentVideo) {
      setVideo(currentVideo);
      setChannel(currentVideo.channel);
      setIsVideoPlaying(true);
    }
  }, [videoId, videos]);

  const togglePlay = () => {
    if (!videoRef.current) return;

    const isVideoEnded =
      videoRef.current.currentTime === videoRef.current.duration;
    if (isVideoEnded) {
      videoRef.current.currentTime = 0;
      videoRef.current.play();
      setIsVideoPlaying(true);
      return;
    }

    if (isVideoPlaying) {
      videoRef.current.pause();
      setIsVideoPlaying(false);
    } else {
      videoRef.current.play();
      setIsVideoPlaying(true);
    }
  };

  const handleBackward = () => {
    if (!videoRef.current) return;
    videoRef.current.currentTime -= 10;
  };

  const handleForward = () => {
    if (!videoRef.current) return;
    videoRef.current.currentTime += 10;
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const progress =
      (videoRef.current.currentTime / videoRef.current.duration) * 100;
    setProgress(progress);
    setDuration(videoRef.current.duration);
    setCurrentTime(videoRef.current.currentTime);
  };

  const handleVideoEnded = () => {
    setIsVideoPlaying(false);
  };

  const handleSeek = (e) => {
    if (!videoRef.current) return;
    const seekTime = (e.target.value / 100) * duration;
    videoRef.current.currentTime = seekTime;
    setProgress(e.target.value);
  };

  const formatTime = (time) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60)
      .toString()
      .padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  const handleVolume = (e) => {
    if (!videoRef.current) return;
    const volume = e.target.value;
    videoRef.current.volume = parseInt(volume);
    setVolume(volume);
    setIsMuted(volume === 0);
  };

  const handleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !videoRef.current.muted;
    setIsMuted(videoRef.current.muted);
  };

  const handleFullScreenRequest = () => {
    if (!videoRef.current) return;
    if (!document.fullscreenElement) {
      videoRef.current.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = video?.videoUrl;
    link.download = `${video?.title}.mp4`;
    link.click();
  };

  return (
    <div className="flex bg-[#0f0f0f] text-white flex-col lg:flex-row gap-6 p-4 lg:p-6">
      <div className="flex-1">
        {/* Video Player */}
        <div
          onMouseEnter={() => setShowControls(true)}
          onMouseLeave={() => setShowControls(false)}
          className="w-full aspect-video bg-black rounded-lg overflow-hidden relative"
        >
          <video
            ref={videoRef}
            src={video?.videoUrl}
            controls={false}
            autoPlay
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleTimeUpdate}
            onEnded={handleVideoEnded}
            className="w-full h-full object-contain"
          />
          {showControls && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center gap-6 sm:gap-10 transition-opacity duration-400 z-20">
              <button
                onClick={handleBackward}
                className="bg-black/70 p-3 rounded-full sm:p-4 hover:bg-red-600 cursor-pointer transition duration-200"
              >
                <FaBackward size={24} />
              </button>
              <button
                onClick={togglePlay}
                className="bg-black/70 p-3 rounded-full sm:p-4 hover:bg-red-600 cursor-pointer transition duration-200"
              >
                {isVideoPlaying ? <FaPause size={28} /> : <FaPlay size={28} />}
              </button>
              <button
                onClick={handleForward}
                className="bg-black/70 p-3 rounded-full sm:p-4 hover:bg-red-600 cursor-pointer transition duration-200"
              >
                <FaForward size={24} />
              </button>
            </div>
          )}
          <div
            className={`absolute bottom-0 left-0 right-0 p-4 z-20 transition-opacity duration-300 ${
              showControls ? "opacity-100" : "opacity-0"
            }`}
          >
            <input
              type="range"
              className="w-full cursor-pointer h-[5px] accent-red-600"
              min={0}
              max={100}
              value={isNaN(progress) ? 0 : progress}
              onChange={handleSeek}
            />
            <div className="flex items-center justify-between mt-1 sm:mt-2 text-xs sm:text-sm text-gray-200">
              <div className="flex items-center gap-3">
                <span className="mr-5">
                  {formatTime(currentTime)}/{formatTime(duration)}
                </span>
                <button
                  className="bg-black/70 px-2 py-1 rounded cursor-pointer hover:scale-120 transition duration-200"
                  onClick={handleBackward}
                >
                  <FaBackward size={12} />
                </button>
                <button
                  className="bg-black/70 px-2 py-1 rounded cursor-pointer hover:scale-120 transition duration-200"
                  onClick={togglePlay}
                >
                  {isVideoPlaying ? (
                    <FaPause size={16} />
                  ) : (
                    <FaPlay size={16} />
                  )}
                </button>
                <button
                  className="bg-black/70 px-2 py-1 rounded cursor-pointer hover:scale-120 transition duration-200"
                  onClick={handleForward}
                >
                  <FaForward size={12} />
                </button>
              </div>
              <div className="flex items-center gap-3">
                <button
                  className="bg-black/70 px-2 py-1 rounded cursor-pointer hover:scale-120 transition duration-200"
                  onClick={handleMute}
                >
                  {isMuted ? (
                    <FaVolumeMute size={18} />
                  ) : (
                    <FaVolumeUp size={18} />
                  )}
                </button>
                <input
                  type="range"
                  className="w-full cursor-pointer h-[5px] accent-red-600"
                  min={0}
                  max={1}
                  step={0.1}
                  value={isMuted ? 0 : volume}
                  onChange={handleVolume}
                />
                <button
                  onClick={handleFullScreenRequest}
                  className="bg-black/70 p-3 rounded-full sm:p-4 hover:scale-120 cursor-pointer transition duration-200"
                >
                  <FaExpand size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
        <h1 className="mt-4 text-lg sm:text-xl font-semibold flex ml-2 text-white">
          {video?.title}
        </h1>
        <p className="text-sm text-gray-400 ml-2 my-3">{video?.views} views</p>
        <div className="flex justify-between">
          <div className="flex items-center justify-start gap-4 mt-5">
            <img
              src={channel?.avatar}
              className="size-12 rounded-full border-2 border-gray-600"
              alt=""
            />
            <div>
              <h2 className="text-sm font-semibold text-white">
                {channel?.name}
              </h2>
              <p className="text-xs text-gray-400">
                {channel?.subscribers?.length} subscribers
              </p>
            </div>
            <button className="px-[20px] py-[8px] rounded-4xl border-gray-600 ml-[20px] text-md font-semibold bg-white text-black hover:bg-red-600 hover:text-white transition duration-300 cursor-pointer">
              Subscribe
            </button>
          </div>
          <div className="flex items-center gap-4">
            <IconButtons
              icon={FaThumbsUp}
              active={video?.likes?.includes(loggedInUserData?._id)}
              label=""
              count={video?.likes?.length}
            />
            <IconButtons
              icon={FaThumbsDown}
              active={video?.likes?.includes(loggedInUserData?._id)}
              label=""
              count={video?.likes?.length}
            />
            <IconButtons
              icon={FaDownload}
              label="Download"
              onClick={handleDownload}
            />
            <IconButtons
              icon={FaBookmark}
              active={video?.savedBy?.includes(loggedInUserData?._id)}
              label="Watch Later"
            />
          </div>
        </div>
        <div className="mt-4 bg-[#1a1a1a] p-4 rounded-lg">
          <h2 className="text-lg font-semibold mb-2">Description</h2>
          <VideoDescription text={video?.description} />
        </div>
        <div className="mt-4 bg-[#1a1a1a] p-4 rounded-lg">
          <h2 className="text-lg font-semibold mb-2">Comments</h2>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Add a comment..."
              className="flex-1 border border-gray-700 bg-[#1a1a1a] rounded-lg px-3 py-1 focus:outline-none focus:ring-1 focus:ring-red-600"
            />
            <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition duration-200 cursor-pointer">
              Post
            </button>
          </div>
        </div>
      </div>
      {/* Suggested Videos & Shorts */}
      <div className="w-full lg:w-[380px] p-4 border-t lg:border-t-0 lg:border-l border-gray-800 overflow-y-auto">
        <h2 className="flex items-center gap-2 font-semibold text-lg mb-4">
          <SiYoutubeshorts className="text-red-600 size-5" />
          Shorts
        </h2>
        <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-3">
          {suggestedShorts.map((short) => (
            <div key={short?._id}>
              <ShortCard
                shortUrl={short?.videoUrl}
                title={short?.title}
                channelName={short?.channel?.name}
                avatar={short?.channel?.avatar}
                views={short?.views}
                id={short?._id}
              />
            </div>
          ))}
        </div>
        <h3 className="font-semibold text-lg my-4">Up Next</h3>
        <div className="space-y-3">
          {suggestedVideos.map((video) => (
            <div
              onClick={() => navigate(`/play-video/${video?._id}`)}
              key={video?._id}
              className="flex gap-2 sm:gap-3 cursor-pointer hover:bg-[#1a1a1a] p-2 rounded-lg transition duration-200"
            >
              <img
                src={video?.thumbnail}
                alt={video?.title}
                className="w-32 sm:w-40 h-20 sm:h-24 object-cover rounded-lg"
              />
              <div>
                <h3 className="text-sm font-semibold text-white line-clamp-2 mb-3">
                  {video?.title}
                </h3>
                <div className="flex items-center gap-2 my-2">
                  <img
                    src={video?.channel?.avatar}
                    alt={video?.channel?.name}
                    className="w-6 h-6 object-cover rounded-full"
                  />
                  <span className="text-xs text-gray-400">
                    {video?.channel?.name}
                  </span>
                </div>
                <span className="text-xs text-gray-400">
                  {video?.views} views
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PlayVideo;
