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
      .populate("channel");
    if (!getVideos) {
      return res.status(404).json({ message: "No videos found" });
    }
    return res.status(200).json(getVideos);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
