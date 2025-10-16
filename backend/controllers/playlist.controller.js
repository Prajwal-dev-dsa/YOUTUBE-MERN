import channelModel from "../models/channel.model.js";
import playlistModel from "../models/playlist.model.js";
import videoModel from "../models/video.model.js";

export const createPlaylist = async (req, res) => {
  try {
    const { title, description, channelId, videoIds } = req.body;

    if (!title || !channelId || !videoIds) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const channel = await channelModel.findById(channelId);
    if (!channel) {
      return res.status(404).json({ message: "Channel not found" });
    }

    const getVideosById = await videoModel.find({
      _id: { $in: videoIds },
      channel: channelId,
    });

    const playlist = await playlistModel.create({
      title,
      description,
      channel: channelId,
      videos: getVideosById,
    });

    await channelModel.findByIdAndUpdate(channelId, {
      $push: { playlists: playlist._id },
    });

    return res.status(200).json(playlist);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

export const toggleSavedByPlaylist = async (req, res) => {
  try {
    const { playlistId } = req.body;
    const userId = req.user._id;
    const playlist = await playlistModel.findById(playlistId);
    if (!playlist) {
      return res.status(404).json({ message: "Playlist not found" });
    }
    const isSaved = playlist.savedBy.includes(userId);
    if (isSaved) {
      playlist.savedBy.pull(userId);
    } else {
      playlist.savedBy.push(userId);
    }
    await playlist.save();
    return res.status(200).json(playlist);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
