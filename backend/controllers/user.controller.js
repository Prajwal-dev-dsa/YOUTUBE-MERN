import Channel from "../models/channel.model.js";
import User from "../models/user.model.js";
import uploadOnCloudinary from "../config/cloudinary.js";

export const getCurrentLoggedInUser = async (req, res) => {
  try {
    console.log(req.user);
    return res.status(200).json(req.user);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const createChannel = async (req, res) => {
  try {
    const { name, userName, description, category } = req.body;
    const userId = req.user._id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const existingChannel = await Channel.findOne({ userName });
    if (existingChannel) {
      return res.status(400).json({ message: "Channel already exists" });
    }
    let banner;
    let avatar;
    if (req.files?.avatar) {
      const result = await uploadOnCloudinary(req.files.avatar[0].path);
      avatar = result.secure_url;
    }
    if (req.files?.banner) {
      const result = await uploadOnCloudinary(req.files.banner[0].path);
      banner = result.secure_url;
    }
    const channel = await Channel.create({
      name,
      avatar,
      banner,
      userName,
      description,
      category,
      owner: userId,
    });
    await User.findByIdAndUpdate(userId, {
      channel: channel._id,
      userName: name,
      photoUrl: avatar,
    });
    return res.status(200).json(channel);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const customizeChannel = async (req, res) => {
  try {
    const { name, userName, description, category } = req.body;
    const userId = req.user._id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const isChannelExists = await Channel.findOne({ owner: userId });
    if (!isChannelExists) {
      return res.status(400).json({ message: "Channel not found" });
    }
    let banner;
    let avatar;
    if (req.files?.avatar) {
      const result = await uploadOnCloudinary(req.files.avatar[0].path);
      avatar = result.secure_url;
    }
    if (req.files?.banner) {
      const result = await uploadOnCloudinary(req.files.banner[0].path);
      banner = result.secure_url;
    }

    const channel = await Channel.findOneAndUpdate(
      { owner: userId },
      {
        name: name || isChannelExists.name,
        avatar: avatar || isChannelExists.avatar,
        banner: banner || isChannelExists.banner,
        userName: userName || isChannelExists.userName,
        description: description || isChannelExists.description,
        category: category || isChannelExists.category,
        owner: userId,
      },
      { new: true }
    );

    await User.findByIdAndUpdate(userId, {
      userName: name || isChannelExists.userName,
      photoUrl: avatar || isChannelExists.avatar,
    });

    return res.status(200).json(channel);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getUserChannel = async (req, res) => {
  try {
    const userId = req.user._id;
    const channel = await Channel.findOne({ owner: userId })
      .populate("owner")
      .populate("shorts")
      .populate("videos")
      .populate("playlists");
    if (!channel) {
      return res.status(404).json({ message: "Channel not found" });
    }
    return res.status(200).json(channel);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const toggleSubscribers = async (req, res) => {
  try {
    const { channelId } = req.body;
    const userId = req.user._id;
    if (!channelId) {
      return res.status(400).json({ message: "Channel ID is required" });
    }
    const channel = await Channel.findById(channelId);
    if (!channel) {
      return res.status(404).json({ message: "Channel not found" });
    }
    const isSubscribed = channel.subscribers.includes(userId);
    if (isSubscribed) {
      channel?.subscribers.pull(userId);
    } else {
      channel?.subscribers.push(userId);
    }
    await channel.save();
    const updatedChannel = await Channel.findById(channelId)
      .populate("owner")
      .populate("shorts")
      .populate("videos");
    return res.status(200).json(updatedChannel);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getAllChannels = async (req, res) => {
  try {
    const channels = await Channel.find()
      .populate("owner")
      .populate("shorts")
      .populate("videos")
      .populate("subscribers")
      .populate({
        path: "communityPosts",
        options: { sort: { createdAt: -1 } },
        populate: [
          { path: "channel", select: "name avatar" },
          { path: "comments.author", select: "userName photoUrl" },
          { path: "comments.replies.author", select: "userName photoUrl" },
        ],
      })
      .populate({
        path: "playlists",
        populate: {
          path: "videos",
          model: "Video",
          populate: {
            path: "channel",
            model: "Channel",
          },
        },
      });
    if (!channels || channels.length === 0) {
      return res.status(404).json({ message: "Channels not found" });
    }
    return res.status(200).json(channels);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
