import mongoose from 'mongoose';

import { Schema, model } from 'mongoose';

const userSchema = new Schema(
  {
    channelName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    logoUrl: {
      type: String,
      required: true,
    },
    logoId: {
      type: String,
      required: true,
    },
    subscribers: {
      type: Number,
      default: 0,
    },
    subscribedChannels: [
      {
        type: mongoose.Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  {
    timestamps: true,
  },
);

const User = model('User', userSchema);
export default User;
