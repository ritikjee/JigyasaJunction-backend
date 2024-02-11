import mongoose from "mongoose";

type User = {
  email: string;
  password: string;
  name: string;
  bio: string;
  username: string;
  profilePicture: string;
};

const userSchema = new mongoose.Schema<User>(
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

const User = mongoose.model("User", userSchema);
export default User;
