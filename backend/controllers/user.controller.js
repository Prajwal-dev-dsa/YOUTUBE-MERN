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

export const getUserChannel = async (req, res) => {
  try {
    const userId = req.user._id;
    const channel = await Channel.findOne({ owner: userId }).populate("owner");
    if (!channel) {
      return res.status(404).json({ message: "Channel not found" });
    }
    return res.status(200).json(channel);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
