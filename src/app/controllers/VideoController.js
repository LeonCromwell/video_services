const Video = require("../models/video.js");
const uploadVideo = require("../middleware/uploadVideo");
const uploadFolder = require("../middleware/uploadFolder");
const convertBufferToHls = require("../middleware/convertHls");
const { storage, bucketName } = require("../../config/google");
const generateUniqueNumber = require("../../utils/generateUniqueNumber.js");
const createJobVideo = require("../../utils/Queue/queueProducer.js");

class VideoController {
  // [post] /upload
  async save(req, res) {
    try {
      const file = req.file;
      let fileName = generateUniqueNumber();
      const publicUrl = await uploadVideo(file, fileName);
      const video = {
        name: fileName,
        original_video: publicUrl,
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

  // [get] /
  async index(req, res) {
    const nameVideo = req.query.nameVideo;
    let resolution = req.query.resolution;
    if (resolution == "480p") {
      resolution = "320x180";
    }
    if (resolution == "720p") {
      resolution = "854x480";
    }
    if (resolution == "1080p") {
      resolution = "1280x720";
    }
    try {
      Video.findOne({ name: nameVideo })
        .then((video) => {
          if (!video) {
            throw new Error("Video not found");
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
}

module.exports = new VideoController();
