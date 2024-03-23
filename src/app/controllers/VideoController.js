const Video = require("../models/video.js");
const uploadVideo = require("../middleware/uploadVideo");
const { storage, bucketName } = require("../../config/google");
const generateUniqueNumber = require("../../utils/generateUniqueNumber.js");
const createJobVideo = require("../../utils/Queue/queueProducer.js");

class VideoController {
  // [get] /
  async index(req, res) {
    try {
      const videos = await Video.find({});
      return res.status(200).json({ videos: videos });
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  // [post] /upload
  async save(req, res) {
    try {
      const title = req.body.title;
      const author = req.body.author;
      const file = req.file;
      let fileName = generateUniqueNumber();
      const publicUrl = await uploadVideo(file, fileName);
      const video = {
        name: fileName,
        original_video: publicUrl,
        title: title,
        author: author,
      };
      Video.create(video);
      // await convertBufferToHls("./", fileName);
      createJobVideo(video);
      return res.status(200).json({
        message: "Upload success",
        file: publicUrl,
      });
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  // [get] /search?id=&resolution=480p
  async GetVideo(req, res) {
    const id = req.query.id;
    let resolution = req.query.resolution;
    if (resolution == "144p") {
      resolution = "250x144";
    }
    if (resolution == "360p") {
      resolution = "480x360";
    }
    if (resolution == "480p") {
      resolution = "854x480";
    }
    if (resolution == "720p") {
      resolution = "1280x720";
    }
    if (resolution == "1080p") {
      resolution = "1920x1080";
    }
    try {
      Video.findOne({ _id: id })
        .then(async (video) => {
          if (!video) {
            throw new Error("Video not found");
          }
          const file = storage
            .bucket(bucketName)
            .file(
              `videos/hls_video/${video.name}/${video.name}_${resolution}.m3u8`
            );
          const exist = await file.exists();
          if (!exist[0]) {
            throw new Error("resolution not found");
          }
          const url = storage
            .bucket(bucketName)
            .file(
              `videos/hls_video/${video.name}/${video.name}_${resolution}.m3u8`
            )

            .getSignedUrl({
              action: "read",
              expires: "12-31-2025",
              virtualHostedStyle: false,
            });
          return url;
        })
        .then((url) => {
          res.status(200).json({ url: url });
        })
        .catch((err) => {
          res.status(400).json({ error: err.message });
        });
    } catch (error) {
      res.status(400).json({ error: error.message });
      return;
    }
  }
  // [get] /search?title=
  async search(req, res) {
    const title = req.query.title;
    try {
      const video = await Video.find({
        title: { $regex: title, $options: "i" },
      });

      if (!video) {
        throw new Error("Video not found");
      }
      res.status(200).json({ video: video });
    } catch (error) {
      res.status(400).json({ error: error.message });
      return;
    }
  }

  // [get] /:id
  async Detail(req, res) {
    const id = req.params.id;
    try {
      const video = await Video.findOne({ _id: id });
      if (!video) {
        throw new Error("Video not found");
      }
      res.status(200).json({ video: video });
    } catch (error) {
      res.status(400).json({ error: error.message });
      return;
    }
  }
}

module.exports = new VideoController();
