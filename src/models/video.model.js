import mongoose from 'mongoose';
import { Schema, model } from 'mongoose';

const videoSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    videoUrl: {
      type: String,
      required: true,
      trim: true,
    },
    thumbnailUrl: {
      type: String,
      required: true,
      trim: true,
    },
    thumbnailId: {
      type: String,
      required: true,
      trim: true,
    },
    tags: [
      {
        type: String,
        required: true,
        trim: true,
      },
    ],
    likes: {
      type: Number,
      default: 0,
      min: 0,
    },
    dislikes: {
      type: Number,
      default: 0,

      min: 0,
    },
    views: {
      type: Number,
      default: 0,
      min: 0,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    user_id: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    likedBy: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    dislikedBy: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    viewedBy: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  },
  {
    timestamps: true,
  },
);

export default model('Video', videoSchema);
