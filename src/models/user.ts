import mongoose, { Document, Model } from "mongoose";

interface User extends Document {
  username: string;
  email: string;
  password: string;
  profileImage: string;
  chats: string[];
}
export const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    profileImage: {
      type: String,
      default: "",
    },
    chats: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Chat" }],
      default: [],
    },
  },
  { timestamps: true }
);

const User: Model<User> =
  mongoose.models.users || mongoose.model("users", userSchema);

export default User;
