import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useContentStore } from "../../store/useContentStore";
import {
  FaBackward,
  FaExpand,
  FaForward,
  FaPause,
  FaPlay,
  FaVolumeMute,
  FaVolumeUp,
} from "react-icons/fa";

const PlayVideo = () => {
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

  const { videos } = useContentStore();

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
      </div>
    </div>
  );
};

export default PlayVideo;
