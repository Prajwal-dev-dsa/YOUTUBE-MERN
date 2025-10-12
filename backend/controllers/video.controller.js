import videoModel from "../models/video.model.js";
import uploadOnCloudinary from "../config/cloudinary.js";
import Channel from "../models/channel.model.js";

export const createVideo = async (req, res) => {
  try {
    const { title, description, channelId, tags } = req.body;

    if (!title || !req.files.thumbnail || !req.files.video || !channelId) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const channelExists = await Channel.findById(channelId);
    if (!channelExists) {
      return res.status(400).json({ message: "Channel does not exist" });
    }

    const thumbnailPath = req.files.thumbnail[0].path;
    const videoPath = req.files.video[0].path;

    const uploadThumbnail = await uploadOnCloudinary(thumbnailPath);
    const thumbnailUrl = uploadThumbnail.secure_url;

    const uploadVideo = await uploadOnCloudinary(videoPath);
    const videoUrl = uploadVideo.secure_url;

    let parsedTagsInArray = [];
    if (tags) {
      parsedTagsInArray = JSON.parse(tags);
    }

    const createdVideo = await videoModel.create({
      title,
      description,
      thumbnail: thumbnailUrl,
      videoUrl: videoUrl,
      channel: channelId,
      tags: parsedTagsInArray,
    });

    await Channel.findByIdAndUpdate(
      channelId,
      {
        $push: { videos: createdVideo._id },
      },
      { new: true }
    );

    return res
      .status(201)
      .json({ message: "Video created successfully", video: createdVideo });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getAllVideos = async (req, res) => {
  try {
    const getVideos = await videoModel
      .find()
      .sort({ createdAt: -1 })
      .populate("channel comments.author comments.replies.author");
    if (!getVideos) {
      return res.status(404).json({ message: "No videos found" });
    }
    return res.status(200).json(getVideos);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const toggleLikes = async (req, res) => {
  try {
    const { videoId } = req.params;
    const userId = req.user._id;
    const video = await videoModel.findById(videoId);
    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }
    const isLiked = video.likes.includes(userId);
    if (isLiked) {
      video.likes.pull(userId);
    } else {
      video.likes.push(userId);
      video.dislikes.pull(userId);
    }
    await video.save();
    return res.status(200).json(video);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const toggleDislikes = async (req, res) => {
  try {
    const { videoId } = req.params;
    const userId = req.user._id;
    const video = await videoModel.findById(videoId);
    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }
    const isDisliked = video.dislikes.includes(userId);
    if (isDisliked) {
      video.dislikes.pull(userId);
    } else {
      video.dislikes.push(userId);
      video.likes.pull(userId);
    }
    await video.save();
    return res.status(200).json(video);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const toggleSavedBy = async (req, res) => {
  try {
    const { videoId } = req.params;
    const userId = req.user._id;
    const video = await videoModel.findById(videoId);
    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }
    const isSavedBy = video.savedBy.includes(userId);
    if (isSavedBy) {
      video.savedBy.pull(userId);
    } else {
      video.savedBy.push(userId);
    }
    await video.save();
    return res.status(200).json(video);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getViewsOfTheVideo = async (req, res) => {
  try {
    const { videoId } = req.params;
    const video = await videoModel.findById(videoId);
    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }
    video.views += 1;
    await video.save();
    return res.status(200).json(video);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const addCommentsInTheVideo = async (req, res) => {
  try {
    const { videoId } = req.params;
    const userId = req.user._id;
    const { message } = req.body;
    const video = await videoModel.findById(videoId);
    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }
    video.comments.push({ author: userId, message });
    await video.save();
    const populatedVideo = await videoModel
      .findById(videoId)
      .populate({
        path: "comments.author",
        select: "userName photoUrl email",
      })
      .populate({
        path: "comments.replies.author",
        select: "userName photoUrl email",
      })
      .sort({ createdAt: -1 });
    return res.status(200).json(populatedVideo);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

export const addReplyInTheComment = async (req, res) => {
  try {
    const { videoId, commentId } = req.params;
    const userId = req.user._id;
    const { message } = req.body;
    const video = await videoModel.findById(videoId);
    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }
    const findOriginalComment = video.comments.id(commentId);
    if (!findOriginalComment) {
      return res.status(404).json({ message: "Comment not found" });
    }
    findOriginalComment.replies.push({ author: userId, message });
    await video.save();
    const populatedVideo = await videoModel
      .findById(videoId)
      .populate({
        path: "comments.author",
        select: "userName photoUrl email",
      })
      .populate({
        path: "comments.replies.author",
        select: "userName photoUrl email",
      })
      .sort({ createdAt: -1 });
    return res.status(200).json(populatedVideo);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
