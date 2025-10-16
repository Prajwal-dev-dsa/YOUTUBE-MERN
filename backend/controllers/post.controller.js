import channelModel from "../models/channel.model.js";
import postModel from "../models/post.model.js";
import uploadOnCloudinary from "../config/cloudinary.js";

export const createPost = async (req, res) => {
  try {
    const { content, channelId } = req.body;
    if (!content || !channelId) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const channel = await channelModel.findById(channelId);
    if (!channel) {
      return res.status(404).json({ message: "Channel not found" });
    }

    const imagePath = req.file.path;
    const uploadImage = await uploadOnCloudinary(imagePath);
    const imageUrl = uploadImage.secure_url;

    const post = await postModel.create({
      content,
      channel: channelId,
      image: imageUrl,
    });
    await channel.findByIdAndUpdate(channelId, {
      $push: { posts: post._id },
    });
    return res.status(200).json({ message: "Post created successfully", post });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getAllPosts = async (req, res) => {
  try {
    const posts = await postModel
      .find()
      .populate("channel")
      .sort({ createdAt: -1 });
    if (!posts) {
      return res.status(404).json({ message: "Posts not found" });
    }
    return res.status(200).json(posts);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const toggleLikesOfPost = async (req, res) => {
  try {
    const { postId } = req.body;
    const userId = req.user._id;
    const post = await postModel.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    const isLiked = post.likes.includes(userId);
    if (isLiked) {
      post.likes.pull(userId);
    } else {
      post.likes.push(userId);
    }
    await post.save();
    return res.status(200).json(post);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const addCommentsInThePost = async (req, res) => {
  try {
    const { postId } = req.body;
    const userId = req.user._id;
    const { message } = req.body;
    const post = await postModel.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    post.comments.push({ author: userId, message });
    await post.save();
    const populatedPost = await postModel
      .findById(postId)
      .populate({
        path: "comments.author",
        select: "userName photoUrl email",
      })
      .populate({
        path: "comments.replies.author",
        select: "userName photoUrl email",
      })
      .sort({ createdAt: -1 });
    return res.status(200).json(populatedPost);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

export const addReplyInTheComment = async (req, res) => {
  try {
    const { postId, commentId } = req.body;
    const userId = req.user._id;
    const { message } = req.body;
    const post = await postModel.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    const findOriginalComment = post.comments.id(commentId);
    if (!findOriginalComment) {
      return res.status(404).json({ message: "Comment not found" });
    }
    findOriginalComment.replies.push({ author: userId, message });
    await post.save();
    const populatedPost = await postModel
      .findById(postId)
      .populate({
        path: "comments.author",
        select: "userName photoUrl email",
      })
      .populate({
        path: "comments.replies.author",
        select: "userName photoUrl email",
      })
      .sort({ createdAt: -1 });
    return res.status(200).json(populatedPost);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
