import mongoose from "mongoose";

const Schema = mongoose.Schema;

const messageSchema = new Schema({
  fromUserId: {
    type: Number,
    required: true,
  },
  toUserId: {
    type: Number,
    required: true,
  },
  voitureId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Voiture",
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const Message = mongoose.model("Message", messageSchema);

export default Message;
