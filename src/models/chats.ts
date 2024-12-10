import mongoose, { Document, Model } from "mongoose";

export interface Chats extends Document {
  members: string[];
  messages: string[];
  isGroup: boolean;
  name: string;
  groupPhoto: string;
}
const chatSchema = new mongoose.Schema(
  {
    members: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
      default: [],
    },
    messages: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Message" }],
      default: [],
    },
    isGroup: {
      type: Boolean,
      default: false,
    },
    name: {
      type: String,
      default: "",
    },

    groupPhoto: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

const Chat: Model<Chats> =
  mongoose.models.chats || mongoose.model("chats", chatSchema);

export default Chat;
