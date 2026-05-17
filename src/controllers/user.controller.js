import { generateToken } from '../lib/utils.js';
import User from '../models/user.model.js';
import bcrypt from 'bcrypt';
export const signup = async (req, res) => {
  try {
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists',
      });
    }
    // Generate salt
    const salt = await bcrypt.genSalt(10);

    // Hash password
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    // Upload image
    const uploadImage = await cloudinary.uploader.upload(
      req.files.logoUrl.tempFilePath,
    );

    // Create user
    const newUser = new User({
      channelName: req.body.channelName,
      email: req.body.email,
      password: hashedPassword,
      phone: req.body.phone,
      logoUrl: uploadImage.secure_url,
      logoId: uploadImage.public_id,
    });
    // generate token
    const token = await generateToken(newUser._id);

    newUser.token = token;
    await newUser.save();

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      user: newUser,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const login = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.status(404).json({
        message: 'User not found',
      });
    }

    // compare password

    const isPasswordValid = await bcrypt.compare(
      req.body.password,
      user.password,
    );
    if (!isPasswordValid) {
      return res.status(401).json({
        message: 'Invalid password',
      });
    }

    // generate token
    const token = await generateToken(user._id);

    user.token = token;

    res.status(200).json({
      success: true,
      message: 'User logged in successfully',
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: error.message,
    });
  }
};
