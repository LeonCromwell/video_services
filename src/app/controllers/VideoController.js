const Video = require("../models/video.js");

const uploadVideo = require("../middleware/uploadVideo");
const uploadFolder = require("../middleware/uploadFolder");
const convertBufferToHls = require("../middleware/convertHls");

class VideoController {
  // [post] /upload
  async save(req, res) {
    try {
      const file = req.file;
      const fileUpload = await convertBufferToHls(file);
      await uploadFolder("./src/temp/" + fileUpload);
      const publicUrl = await uploadVideo(file);
      const video = new Video({
        name: fileUpload,
        original_video: publicUrl,
      });
      await video.save();
      return res.status(200).json({
        message: "Upload success",
        original_video: publicUrl,
        file: fileUpload,
      });
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  // [get] /
  async index(req, res) {
    const { Storage } = require("@google-cloud/storage");
    const storage = new Storage({
      projectId: "driven-airway-411306",
      keyFilename: "./driven-airway-411306-1cfba86e458c.json",
    });

    const bucketName = "hlsstreaming";
    const nameVideo = req.query.nameVideo;

    try {
      Video.findOne({ name: nameVideo })
        .then((video) => {
          if (!video) {
            throw new Error("Video not found");
          }
          const url = storage
            .bucket(bucketName)
            .file(`videos/hls_video/${video.name}/${video.name}.m3u8`)
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
