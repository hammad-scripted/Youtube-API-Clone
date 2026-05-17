import cloudinary from '../lib/cloudinary.js';
import videoModel from '../models/video.model.js';

// Normalize request body - trim field names (handles spaces in field names)
const normalizeFormData = (data) => {
  if (!data || typeof data !== 'object') {
    return {};
  }

  const normalized = {};
  for (const key in data) {
    if (Object.prototype.hasOwnProperty.call(data, key)) {
      normalized[key.trim()] = data[key];
    }
  }
  return normalized;
};

// Validation helper for uploadVideo
const validateVideoUpload = (data) => {
  const errors = [];

  // Trim and normalize all fields
  const title = data.title ? String(data.title).trim() : '';
  const description = data.description ? String(data.description).trim() : '';
  const category = data.category ? String(data.category).trim() : '';
  let tags = data.tags;

  // Validate title
  if (!title) {
    errors.push('Title is required');
  } else if (title.length < 3) {
    errors.push('Title must be at least 3 characters');
  }

  // Validate description
  if (!description) {
    errors.push('Description is required');
  } else if (description.length < 10) {
    errors.push('Description must be at least 10 characters');
  }

  // Validate category
  if (!category) {
    errors.push('Category is required');
  } else if (category.length < 2) {
    errors.push('Category must be at least 2 characters');
  }

  // Validate tags (handle both array and JSON string)
  if (typeof tags === 'string') {
    try {
      tags = JSON.parse(tags);
    } catch (e) {
      tags = tags.length > 0 ? [tags] : [];
    }
  }

  if (!tags || !Array.isArray(tags) || tags.length === 0) {
    errors.push('At least one tag is required');
  }

  return { errors, tags, title, description, category };
};

export const uploadVideo = async (req, res) => {
  try {
    // Check if user is authenticated
    if (!req.user || !req.user.userId) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated. Please log in first.',
      });
    }

    // Normalize form data (trim field names to handle spaces)
    const normalizedBody = normalizeFormData(req.body);

    // DEBUG: Log what we receive
    console.log('Request body (normalized):', normalizedBody);
    console.log(
      'Request files:',
      req.files ? Object.keys(req.files) : 'No files',
    );

    // Validate input and parse tags
    const { errors, tags, title, description, category } =
      validateVideoUpload(normalizedBody);
    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors,
        debug: {
          receivedBody: normalizedBody,
          bodyKeys: Object.keys(normalizedBody || {}),
        },
      });
    }

    // Check if video file exists
    if (!req.files || !req.files.videoUrl) {
      return res.status(400).json({
        success: false,
        message: 'Video file is required',
      });
    }

    // Check if thumbnail file exists
    if (!req.files || !req.files.thumbnailUrl) {
      return res.status(400).json({
        success: false,
        message: 'Thumbnail image is required',
      });
    }

    // Upload video to cloudinary
    let uploadedVideo;
    try {
      uploadedVideo = await cloudinary.uploader.upload(
        req.files.videoUrl.tempFilePath,
        {
          resource_type: 'video',
          folder: 'youtube-clone/videos',
        },
      );
    } catch (uploadError) {
      console.error('Video upload error:', uploadError);
      return res.status(500).json({
        success: false,
        message: 'Failed to upload video',
      });
    }

    // Upload thumbnail to cloudinary
    let uploadedThumbnail;
    try {
      uploadedThumbnail = await cloudinary.uploader.upload(
        req.files.thumbnailUrl.tempFilePath,
        {
          resource_type: 'image',
          folder: 'youtube-clone/thumbnails',
        },
      );
    } catch (uploadError) {
      console.error('Thumbnail upload error:', uploadError);
      return res.status(500).json({
        success: false,
        message: 'Failed to upload thumbnail',
      });
    }

    // Create video document with user_id from authenticated user
    const newVideo = await videoModel.create({
      title,
      description,
      videoUrl: uploadedVideo.secure_url,
      videoId: uploadedVideo.public_id,
      thumbnailUrl: uploadedThumbnail.secure_url,
      thumbnailId: uploadedThumbnail.public_id,
      category,
      tags,
      user_id: req.user.userId, // Associate video with authenticated user
    });

    res.status(201).json({
      success: true,
      message: 'Video uploaded successfully',
      video: newVideo,
    });
  } catch (error) {
    console.error('Video upload error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while uploading the video',
    });
  }
};
