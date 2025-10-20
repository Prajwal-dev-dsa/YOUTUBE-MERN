import React, { useRef, useState, useEffect } from "react";
import { useContentStore } from "../../store/useContentStore";
import {
  FaArrowDown,
  FaBookmark,
  FaComment,
  FaDownload,
  FaPlay,
  FaThumbsDown,
  FaThumbsUp,
} from "react-icons/fa";
import VideoDescription from "../../components/VideoDescription";
import { useUserStore } from "../../store/useUserStore";
import axios from "axios";
import { serverURL } from "../../App";
import { useNavigate } from "react-router-dom";

const IconButtons = ({ icon: Icon, active, label, count, onClick }) => {
  return (
    <button
      className="flex flex-col items-center gap-1 min-w-[80px]"
      onClick={onClick}
    >
      <div
        className={`p-3 rounded-full transition duration-200 cursor-pointer ${
          active
            ? "bg-white hover:bg-gray-300"
            : "bg-[#272727] hover:bg-gray-700"
        }`}
      >
        <Icon size={16} className={`${active ? "text-black" : "text-white"}`} />
      </div>
      <span className="text-xs text-center text-gray-400">
        {label || (count !== undefined ? count : "")}
      </span>
    </button>
  );
};

const Shorts = () => {
  const navigate = useNavigate();
  const { loggedInUserData } = useUserStore();
  const { shorts } = useContentStore();
  const [shortList, setShortList] = useState([]);
  const [pauseOrPlayIcon, setPauseOrPlayIcon] = useState(null);
  const [toggleCommentButton, setToggleCommentButton] = useState(false);
  const [loading, setLoading] = useState(false);
  const shortRefs = useRef([]);
  const [watchedShorts, setWatchedShorts] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    if (!shorts) return;
    const shuffleShorts = [...shorts].sort(() => Math.random() - 0.5);
    setShortList(shuffleShorts);
  }, [shorts]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const index = Number(entry.target.dataset.index);
          const video = shortRefs.current[index];
          setActiveIdx(index);
          if (video) {
            if (entry.isIntersecting) {
              video.muted = false;
              video.currentTime = 0;
              video.play();
              setPauseOrPlayIcon(null);
              const currentPlayingShortId = shortList[index]?._id;
              if (!watchedShorts.includes(currentPlayingShortId)) {
                addNewView(currentPlayingShortId);
                setWatchedShorts((prev) => [...prev, currentPlayingShortId]);
              }
            } else {
              video.muted = true;
              video.pause();
              setPauseOrPlayIcon(index);
            }
          }
        });
      },
      { threshold: 0.5 }
    );
    shortRefs.current.forEach((video) => {
      if (video) observer.observe(video);
    });
    return () => observer.disconnect();
  }, [shortList]);

  useEffect(() => {
    const addHistory = async () => {
      try {
        const shortId = shortList[activeIdx]?._id;
        if (!shortId) return;
        const res = await axios.post(
          `${serverURL}/api/user/add-history`,
          { contentId: shortId, contentType: "Short" },
          { withCredentials: true }
        );
        console.log(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    if (shortList.length > 0) addHistory();
  }, [shortList, activeIdx]);

  const togglePauseOrPlay = (index) => {
    const video = shortRefs.current[index];
    if (video) {
      if (video.paused) {
        video.play();
        setPauseOrPlayIcon(null);
      } else {
        video.pause();
        setPauseOrPlayIcon(index);
      }
    }
  };

  const handleSubscribe = async (channelId) => {
    if (!channelId) return;
    setLoading(true);
    try {
      const response = await axios.post(
        `${serverURL}/api/user/toggle-subscribers`,
        { channelId },
        { withCredentials: true }
      );
      setShortList((prevList) =>
        prevList.map((short) => {
          if (short.channel?._id === channelId) {
            const updatedChannel = {
              ...short.channel,
              subscribers: response.data.subscribers,
            };
            return { ...short, channel: updatedChannel };
          }
          return short;
        })
      );
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const toggleLikes = async (shortId) => {
    if (!shortId || !loggedInUserData) return;
    try {
      const response = await axios.put(
        `${serverURL}/api/content/short/${shortId}/toggleLikes`,
        {},
        { withCredentials: true }
      );
      setShortList((prevList) =>
        prevList.map((short) => {
          if (short._id === shortId) {
            return {
              ...short,
              likes: response.data.likes,
              dislikes: response.data.dislikes,
            };
          }
          return short;
        })
      );
    } catch (error) {
      console.log(error);
    }
  };

  const toggleDislikes = async (shortId) => {
    if (!shortId || !loggedInUserData) return;
    try {
      const response = await axios.put(
        `${serverURL}/api/content/short/${shortId}/toggleDislikes`,
        {},
        { withCredentials: true }
      );
      setShortList((prevList) =>
        prevList.map((short) => {
          if (short._id === shortId) {
            return {
              ...short,
              likes: response.data.likes,
              dislikes: response.data.dislikes,
            };
          }
          return short;
        })
      );
    } catch (error) {
      console.log(error);
    }
  };

  const toggleSavedBy = async (shortId) => {
    if (!shortId || !loggedInUserData) return;
    try {
      const response = await axios.put(
        `${serverURL}/api/content/short/${shortId}/toggleSavedBy`,
        {},
        { withCredentials: true }
      );
      setShortList((prevList) =>
        prevList.map((short) => {
          if (short._id === shortId) {
            return {
              ...short,
              savedBy: response.data.savedBy,
            };
          }
          return short;
        })
      );
    } catch (error) {
      console.log(error);
    }
  };

  const addNewView = async (shortId) => {
    try {
      await axios.put(
        `${serverURL}/api/content/short/${shortId}/getViewsOfTheShort`,
        {},
        { withCredentials: true }
      );
    } catch (error) {
      console.log(error);
    }
  };

  const addComment = async (shortId) => {
    if (!shortId || !loggedInUserData || !newComment.trim()) return;
    try {
      const res = await axios.post(
        `${serverURL}/api/content/short/${shortId}/addCommentsInTheShort`,
        { message: newComment },
        { withCredentials: true }
      );
      setShortList((prevList) =>
        prevList.map((short) => {
          if (short._id === shortId) {
            return {
              ...short,
              comments: res.data.comments,
            };
          }
          return short;
        })
      );
      setNewComment("");
    } catch (error) {
      console.log(error);
    }
  };

  const addReply = async (shortId, commentId, replyMessage) => {
    if (!replyMessage.trim() || !shortId || !commentId) return;
    try {
      const res = await axios.post(
        `${serverURL}/api/content/short/${shortId}/${commentId}/addReplyInTheComment`,
        { message: replyMessage },
        { withCredentials: true }
      );
      setShortList((prevList) =>
        prevList.map((short) => (short._id === shortId ? res.data : short))
      );
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="h-screen w-full overflow-y-auto snap-y snap-mandatory scrollbar-hide">
      {shortList.map((short, index) => (
        <div
          key={short?._id}
          className="min-h-screen w-full flex md:items-center items-start mt-[90px] md:mt[0px] justify-center snap-start pt-[40px] md:pt-[0px]"
        >
          <div className="relative w-full max-w-sm aspect-[9/16] bg-black rounded-2xl overflow-hidden shadow-xl border border-gray-700 cursor-pointer">
            <video
              src={short?.shortUrl}
              ref={(el) => (shortRefs.current[index] = el)}
              autoPlay
              loop
              playsInline
              data-index={index}
              className="w-full h-full object-cover"
              onClick={() => togglePauseOrPlay(index)}
            />
            {pauseOrPlayIcon === index && (
              <div
                onClick={() => togglePauseOrPlay(index)}
                className="absolute p-4 rounded-full top-1/2 left-1/2 transform bg-black/60 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center cursor-pointer"
              >
                <FaPlay size={32} color="white" />
              </div>
            )}
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 via-black/40 to-transparent text-white space-y-1">
              <div className="flex items-center gap-2">
                <img
                  onClick={() =>
                    navigate(`/channel-page/${short?.channel?._id}`)
                  }
                  src={short?.channel?.avatar}
                  alt=""
                  className="size-8 rounded-full border-1 border-gray-600 cursor-pointer"
                />
                <p
                  className="text-sm text-white px-1 cursor-pointer"
                  onClick={() =>
                    navigate(`/channel-page/${short?.channel?._id}`)
                  }
                >
                  {short?.channel?.name}
                </p>
                <button
                  onClick={() => handleSubscribe(short?.channel?._id)}
                  className={`px-3 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition duration-300 cursor-pointer ${
                    short?.channel?.subscribers.includes(loggedInUserData._id)
                      ? "bg-gray-800 text-white"
                      : "bg-white text-black"
                  }`}
                >
                  {short?.channel?.subscribers.includes(loggedInUserData._id)
                    ? "Subscribed"
                    : "Subscribe"}
                </button>
              </div>
              <h2 className="font-semibold text-sm pl-1">{short?.title}</h2>
              <VideoDescription text={short?.description} />
            </div>
            <div className="absolute right-2 bottom-28 flex flex-col items-center gap-5 text-white">
              <IconButtons
                icon={FaThumbsUp}
                active={short?.likes?.includes(loggedInUserData?._id)}
                label=""
                count={short?.likes?.length}
                onClick={() => toggleLikes(short?._id)}
              />
              <IconButtons
                icon={FaThumbsDown}
                active={short?.dislikes?.includes(loggedInUserData?._id)}
                label=""
                count={short?.dislikes?.length}
                onClick={() => toggleDislikes(short?._id)}
              />
              <IconButtons
                icon={FaComment}
                label="Comment"
                onClick={() => {
                  setToggleCommentButton(!toggleCommentButton);
                }}
              />
              <IconButtons icon={FaDownload} label="Download" />
              <IconButtons
                icon={FaBookmark}
                active={short?.savedBy?.includes(loggedInUserData?._id)}
                label="Watch Later"
                onClick={() => toggleSavedBy(short?._id)}
              />
            </div>
            {toggleCommentButton && (
              <div className="absolute bottom-0 left-0 right-0 h-[70%] bg-[#0f0f0f] text-white p-4 rounded-t-2xl overflow-y-auto scrollbar-hide">
                <div className="flex justify-between items-center gap-3 px-3 mb-3">
                  <h3 className="font-semibold text-lg">Comments</h3>
                  <button
                    className="cursor-pointer hover:scale-110 transition duration-200"
                    onClick={() => setToggleCommentButton(false)}
                  >
                    <FaArrowDown size={20} />
                  </button>
                </div>
                <div className="flex gap-2 px-3 items-center justify-around">
                  <input
                    type="text"
                    placeholder="Add a comment..."
                    className="w-full border-b border-gray-700 bg-transparent py-1 text-sm focus:outline-none focus:border-red-600"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                  />
                  <button
                    onClick={() => addComment(short?._id)}
                    className="bg-red-500 text-white px-4 font-medium cursor-pointer py-2 rounded-full hover:bg-red-600"
                  >
                    Post
                  </button>
                </div>

                <div className="mt-4 space-y-3 px-3">
                  {short.comments?.length > 0 ? (
                    short.comments
                      .slice()
                      .reverse()
                      .map((comment) => (
                        <div key={comment._id} className="p-2 rounded-lg">
                          <div className="flex items-start gap-3">
                            <img
                              src={comment.author?.photoUrl}
                              alt=""
                              className="size-8 rounded-full border border-gray-600"
                            />
                            <div className="gap-1 flex flex-col items-start">
                              <p className="text-xs font-medium text-gray-400">
                                {comment.author?.userName || "User"}
                              </p>
                              <p className="text-sm text-white">
                                {comment.message}
                              </p>
                            </div>
                          </div>
                          <div className="space-y-2 ml-12 mt-2">
                            {comment.replies
                              ?.slice()
                              .reverse()
                              .map((reply) => (
                                <div
                                  key={reply._id}
                                  className="flex items-center gap-3"
                                >
                                  <img
                                    src={reply.author?.photoUrl}
                                    alt=""
                                    className="size-6 rounded-full"
                                  />
                                  <div>
                                    <p className="text-xs font-semibold text-gray-400">
                                      {reply.author?.userName || "User"}
                                    </p>
                                    <p className="text-sm text-white">
                                      {reply.message}
                                    </p>
                                  </div>
                                </div>
                              ))}
                          </div>
                          <ReplyCard
                            short={short}
                            comment={comment}
                            handleReply={addReply}
                          />
                        </div>
                      ))
                  ) : (
                    <p className="text-center text-sm text-gray-400 pt-4">
                      No comments yet!
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

const ReplyCard = ({ short, comment, handleReply }) => {
  const [replyText, setReplyText] = useState("");
  const [showReplyInput, setShowReplyInput] = useState(false);

  const handleReplySubmit = () => {
    if (!replyText.trim()) return;
    handleReply(short._id, comment._id, replyText);
    setReplyText("");
    setShowReplyInput(false);
  };

  return (
    <div className="mt-3 ml-12">
      {showReplyInput ? (
        <div className="flex items-center gap-1">
          <input
            type="text"
            placeholder="Add a reply..."
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            className="flex-grow border-b border-gray-700 bg-transparent py-1 text-sm focus:outline-none focus:border-red-600"
            autoFocus
          />
          <button
            onClick={() => setShowReplyInput(false)}
            className="text-xs font-semibold text-gray-400 hover:text-white px-2 py-1 rounded-full flex-shrink-0"
          >
            Cancel
          </button>
          <button
            onClick={handleReplySubmit}
            className="bg-red-600 text-white px-2 py-1 text-xs font-semibold rounded-full hover:bg-red-700 transition flex-shrink-0"
          >
            Reply
          </button>
        </div>
      ) : (
        <button
          onClick={() => setShowReplyInput(true)}
          className="text-xs font-semibold text-gray-400 hover:text-white"
        >
          Reply
        </button>
      )}
    </div>
  );
};

export default Shorts;
