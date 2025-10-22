import { GoogleGenAI } from "@google/genai";
import Channel from "../models/channel.model.js";
import VideoModel from "../models/video.model.js";
import ShortModel from "../models/short.model.js";
import PlaylistModel from "../models/playlist.model.js";
import dotenv from "dotenv";

dotenv.config();

export const searchWithAI = async (req, res) => {
  try {
    const { input } = req.body;
    if (!input) {
      return res.status(400).json({ message: "Input is required" });
    }

    // step 1: AI se keyword nikaalo (autocorrect + simplified)
    const ai = new GoogleGenAI({
      apiKey: process.env.GOOGLE_API_KEY,
    });

    const prompt = `You are a search assistant for a video streaming platform. The user query is: ${input}. 
        Your job is:
        - if query has typos, correct them.
        - if query has multiple words, break them into meaningful keywords.
        - return only the corrected word(s), comma-separated.
        - do not explain anything, just return the keywords.
        `;
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    let keyword = (response.text || input).trim().replace(/[\n\r]+/g, " ");

    // step 2: split keywords for OR search
    const searchWords = keyword
      .split(",")
      .map((word) => word.trim())
      .filter(Boolean);

    // helper: create OR regex query
    const buildRegexQuery = (fields) => {
      return {
        $or: searchWords.map((word) => ({
          $or: fields.map((field) => ({
            [field]: {
              $regex: word,
              $options: "i",
            },
          })),
        })),
      };
    };

    // channels
    const matchedChannels = await Channel.find(
      buildRegexQuery(["name"])
    ).select("_id name avatar");

    const channelIds = matchedChannels.map((channel) => channel._id);

    // videos
    const videos = await VideoModel.find({
      $or: [
        buildRegexQuery(["title", "description", "tags"]),
        { channel: { $in: channelIds } },
      ],
    }).populate("channel comments.author comments.replies.author");

    // shorts
    const shorts = await ShortModel.find({
      $or: [
        buildRegexQuery(["title", "description", "tags"]),
        { channel: { $in: channelIds } },
      ],
    })
      .populate("channel", "name avatar")
      .populate("likes", "username photoUrl");

    // playlists
    const playlists = await PlaylistModel.find({
      $or: [
        buildRegexQuery(["title", "description"]),
        { channel: { $in: channelIds } },
      ],
    })
      .populate("channel", "name avatar")
      .populate({
        path: "videos",
        populate: {
          path: "channel",
          select: "name avatar",
        },
      });

    return res.status(200).json({
      keyword,
      channels: matchedChannels,
      videos,
      shorts,
      playlists,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
