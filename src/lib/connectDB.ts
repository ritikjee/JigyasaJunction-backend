import mongoose from "mongoose";

export async function connectDb() {
  try {
    await mongoose.connect(process.env.MONGODB_URL as string);
    console.log("New mongodb connection established");
  } catch (error) {
    console.log(error);
  }
}

export default connectDb;
