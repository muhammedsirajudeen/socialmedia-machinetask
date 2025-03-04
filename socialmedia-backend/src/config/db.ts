
import mongoose from "mongoose";
import { logger } from "@config/logger";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI as string);
    logger.info("MongoDB Connected 🚀");
  } catch (err) {
    logger.error(err);
    process.exit(1);
  }
};

export default connectDB;
