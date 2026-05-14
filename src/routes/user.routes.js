import express from 'express';
import bcrypt from 'bcrypt';
import cloudinary from '../lib/cloudinary.js';
import mongoose from 'mongoose';
import User from '../models/user.model.js';

const router = express.Router();

router.post('/signup', async (req, res) => {
  try {
    // Generate salt
    const salt = await bcrypt.genSalt(10);

    // Hash password
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    // Upload image
    const uploadImage = await cloudinary.uploader.upload(
      req.files.logoUrl.tempFilePath,
    );

    console.log(uploadImage);

    // Create user
    const newUser = new User({
      channelName: req.body.channelName,
      email: req.body.email,
      password: hashedPassword,
      phone: req.body.phone,
      logoUrl: uploadImage.secure_url,
      logoId: uploadImage.public_id,
    });

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
});

export default router;
