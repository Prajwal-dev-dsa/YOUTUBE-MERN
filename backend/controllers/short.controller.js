import shortModel from "../models/short.model.js";
import uploadOnCloudinary from "../config/cloudinary.js";
import Channel from "../models/channel.model.js";

export const createShort = async (req, res) => {
  try {
    const { title, description, channelId, tags } = req.body;

    if (!title || !req.file || !channelId) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const channelExists = await Channel.findById(channelId);
    if (!channelExists) {
      return res.status(400).json({ message: "Channel does not exist" });
    }

    const shortPath = req.file.path;

    const uploadShort = await uploadOnCloudinary(shortPath);
    const shortUrl = uploadShort.secure_url;

    let parsedTagsInArray = [];
    if (tags) {
      parsedTagsInArray = JSON.parse(tags);
    }

    const createdShort = await shortModel.create({
      title,
      description,
      shortUrl,
      channel: channelId,
      tags: parsedTagsInArray,
    });

    await Channel.findByIdAndUpdate(
      channelId,
      {
        $push: { shorts: createdShort._id },
      },
      { new: true }
    );

    return res
      .status(201)
      .json({ message: "Short created successfully", short: createdShort });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
