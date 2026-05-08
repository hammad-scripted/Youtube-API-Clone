import mongoose from 'mongoose';

import { Schema, model } from 'mongoose';

const userSchema = new Schema({
  _id: mongoose.Types.ObjectId,
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
});
