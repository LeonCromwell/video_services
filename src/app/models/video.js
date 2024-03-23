const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

const videoChema = new Schema(
  {
    id: ObjectId,
    name: String,
    original_video: String,
    create_at: { type: Date, default: Date.now },
    thumbnail: String,
    title: String,
    author: String,
    thumbnail: String,
    resolution: [String],
  },
  {
    collection: "videos",
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Video", videoChema);
