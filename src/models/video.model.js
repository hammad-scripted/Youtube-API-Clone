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
    videoId: {
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

videoSchema.virtual('likes').get(function () {
  return this.likedBy.length;
});
videoSchema.virtual('dislikes').get(function () {
  return this.dislikedBy.length;
});
videoSchema.virtual('views').get(function () {
  return this.viewedBy.length;
});

// Ensure virtual fields are included in the JSON representation of the document

videoSchema.set('toJSON', { virtuals: true });
export default model('Video', videoSchema);
