import { generateToken } from '../lib/utils.js';
import User from '../models/user.model.js';
import bcrypt from 'bcrypt';
import cloudinary from 'cloudinary';

// Validation helper
const validateSignupInput = (data) => {
  const errors = [];

  if (!data.email || !data.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
    errors.push('Valid email is required');
  }
  if (!data.password || data.password.length < 6) {
    errors.push('Password must be at least 6 characters');
  }
  if (!data.channelName || data.channelName.trim().length < 3) {
    errors.push('Channel name must be at least 3 characters');
  }
  if (!data.phone || !data.phone.match(/^\d{10,}$/)) {
    errors.push('Valid phone number is required');
  }

  return errors;
};

const validateLoginInput = (data) => {
  const errors = [];

  if (!data.email || !data.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
    errors.push('Valid email is required');
  }
  if (!data.password || data.password.length < 1) {
    errors.push('Password is required');
  }

  return errors;
};

// Helper to format user response (exclude sensitive data)
const formatUserResponse = (user) => {
  return {
    _id: user._id,
    channelName: user.channelName,
    email: user.email,
    phone: user.phone,
    logoUrl: user.logoUrl,
    subscribers: user.subscribers,
    createdAt: user.createdAt,
  };
};

export const signup = async (req, res) => {
  try {
    // Validate input
    const validationErrors = validateSignupInput(req.body);
    if (validationErrors.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validationErrors,
      });
    }

    // Check if file was uploaded
    if (!req.files || !req.files.logoUrl) {
      return res.status(400).json({
        success: false,
        message: 'Logo image is required',
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      email: req.body.email.toLowerCase(),
    });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'Email is already registered',
      });
    }

    // Hash password with bcrypt
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    // Upload image to cloudinary
    let uploadImage;
    try {
      uploadImage = await cloudinary.v2.uploader.upload(
        req.files.logoUrl.tempFilePath,
        { folder: 'youtube-clone/channels' },
      );
    } catch (uploadError) {
      return res.status(500).json({
        success: false,
        message: 'Failed to upload logo image',
      });
    }

    // Create user
    const newUser = new User({
      channelName: req.body.channelName.trim(),
      email: req.body.email.toLowerCase(),
      password: hashedPassword,
      phone: req.body.phone,
      logoUrl: uploadImage.secure_url,
      logoId: uploadImage.public_id,
    });

    // Generate token and save user
    const token = await generateToken(newUser._id);
    newUser.token = token;
    await newUser.save();

    res.status(201).json({
      success: true,
      message: 'Account created successfully',
      token,
      user: formatUserResponse(newUser),
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred during signup',
    });
  }
};

export const login = async (req, res) => {
  try {
    // Validate input
    const validationErrors = validateLoginInput(req.body);
    if (validationErrors.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validationErrors,
      });
    }

    // Find user by email
    const user = await User.findOne({ email: req.body.email.toLowerCase() });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // Compare passwords
    const isPasswordValid = await bcrypt.compare(
      req.body.password,
      user.password,
    );
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // Generate token
    const token = await generateToken(user._id);
    user.token = token;

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: formatUserResponse(user),
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred during login',
    });
  }
};
