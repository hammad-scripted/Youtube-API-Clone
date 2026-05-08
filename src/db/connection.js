import mongoose from 'mongoose';
export const connectToDb = async () => {
  try {
    const connection = await mongoose.connect(process.env.MONGO_URI);

    return connection;
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

export default connectToDb;
