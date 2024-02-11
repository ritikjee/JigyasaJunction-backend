import mongoose from "mongoose";
import { v4 as uuid } from "uuid";

type UUser = {
  email: string;
  password: string;
  name: string;
  bio: string;
  token: string;
  username: string;
  profilePicture: string;
};

const userSchema = new mongoose.Schema<UUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    bio: {
      type: String,
      default: "No bio",
    },
    token: {
      type: String,
      default: uuid(),
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    profilePicture: {
      type: String,
      default:
        "https://gravatar.com/avatar/a9a38ed3715faa7c1e68f904f658c5a5?s=400&d=robohash&r=x",
    },
  },
  {
    timestamps: true,
  }
);

const UUser = mongoose.model("UUser", userSchema);
export default UUser;
