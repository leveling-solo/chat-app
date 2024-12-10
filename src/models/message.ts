import mongoose, { Document, Model } from "mongoose";

interface ChatMessage extends Document {
  chat: string;
  sender: {
    _id: string;
    username: string;
    email: string;
    profileImage: string;
  };
  text: string;
  photo: string;
  seenBy: string[];
}

const messageSchema = new mongoose.Schema(
  {
    chat: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chat",
    },
    sender: {
      _id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      username: { type: String, requried: true },
      email: { type: String, required: true },
      profileImage: { type: String, required: false },
    },
    text: {
      type: String,
      default: "",
    },
    photo: {
      type: String,
      default: "",
    },

    seenBy: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
      default: [],
    },
  },
  { timestamps: true }
);

const Message: Model<ChatMessage> =
  mongoose.models.messages || mongoose.model("messages", messageSchema);

export default Message;
