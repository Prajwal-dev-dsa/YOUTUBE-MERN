import User from "../models/user.model.js";
import validator from "validator";
import uploadOnCloudinary from "../config/cloudinary.js";
import { generateToken } from "../config/generateToken.js";
import bcrypt from "bcryptjs";
import sendMail from "../config/sendMail.js";

// setting cookies here!
const setCookie = (res, token) => {
  res.cookie("token", token, {
    httpOnly: true,
    secure: false,
    sameSite: "strict",
    maxAge: 15 * 24 * 60 * 60 * 1000,
  });
};

export const register = async (req, res) => {
  try {
    const { userName, email, password } = req.body;

    // check if all fields are present
    if (!userName || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // validate email
    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: "Invalid email" });
    }

    // check password length
    if (password.length < 5) {
      return res
        .status(400)
        .json({ message: "Password must be at least 5 characters long" });
    }

    // upload photo on cloudinary if file is present
    let photoUrl;
    if (req.file) {
      const result = await uploadOnCloudinary(req.file.path);
      photoUrl = result.secure_url;
    }

    // hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // create user
    const user = await User.create({
      userName,
      email,
      password: hashedPassword,
      photoUrl,
    });

    // generate token and set cookies
    const token = await generateToken(user._id);
    setCookie(res, token);

    // send response
    res.status(201).json({ message: "User registered successfully", user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: `Signup error ${error.message}` });
  }
};

export const logIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    // check if all fields are present
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // if user does not exist
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User does not exist" });
    }

    // compare password
    const isPasswordMatched = await bcrypt.compare(password, user.password);
    if (!isPasswordMatched) {
      return res.status(400).json({ message: "Invalid password" });
    }

    // generate token and set cookies
    const token = await generateToken(user._id);
    setCookie(res, token);

    // send response
    res.status(200).json({ message: "User logged in successfully", user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: `Login error ${error.message}` });
  }
};

export const logOut = async (req, res) => {
  try {
    res.clearCookie("token");
    res.status(200).json({ message: "User logged out successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: `Logout error ${error.message}` });
  }
};

export const googleSignIn = async (req, res) => {
  try {
    const { userName, email, photoUrl } = req.body;

    let finalPhotoUrl = photoUrl; // Default to the original Google URL

    // If a photoUrl from Google exists, upload it to your Cloudinary account
    if (photoUrl) {
      try {
        const result = await cloudinary.uploader.upload(photoUrl, {
          folder: "youtube_clone_avatars", // Organizes images in Cloudinary
          resource_type: "image",
        });
        finalPhotoUrl = result.secure_url; // Use the new Cloudinary URL
      } catch (uploadError) {
        console.error(
          "Cloudinary upload failed, using original URL.",
          uploadError
        );
      }
    }

    let user = await User.findOne({ email });

    // If the user doesn't exist, create a new one in your database
    if (!user) {
      user = await User.create({
        userName,
        email,
        photoUrl: finalPhotoUrl,
      });
    } // if user exists and contains photo while logging in and previously doesnt had any photo then upload this new one.
    else if (!user.photoUrl && finalPhotoUrl) {
      user.photoUrl = finalPhotoUrl;
      await user.save();
    }

    // Generate a token for the session and set it as a cookie
    const token = await generateToken(user._id);
    setCookie(res, token);

    res.status(200).json({ message: "Authentication successful", user });
  } catch (error) {
    console.error("Google Sign-In controller error:", error);
    res
      .status(500)
      .json({ message: "An error occurred during authentication." });
  }
};

export const sendOTP = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User does not exist" });
    }
    const otp = Math.floor(1000 + Math.random() * 9000);
    user.generateOtp = otp;
    user.otpExpires = Date.now() + 5 * 60 * 1000; // 5 minutes
    await user.save();
    sendMail(email, otp);
    return res.status(200).json({ message: "OTP sent successfully" });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "An error occurred during authentication." });
  }
};

export const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required" });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User does not exist" });
    }
    if (user.generateOtp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }
    if (Date.now() > user.otpExpires) {
      return res.status(400).json({ message: "OTP has expired" });
    }
    user.generateOtp = null;
    user.otpExpires = null;
    user.isOtpVerified = true;
    await user.save();
    return res.status(200).json({ message: "OTP verified successfully" });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "An error occurred during authentication." });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User does not exist" });
    }
    if (!user.isOtpVerified) {
      return res.status(400).json({ message: "User is not verified" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    user.password = hashedPassword;
    user.isOtpVerified = false;
    await user.save();
    return res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "An error occurred during authentication." });
  }
};
