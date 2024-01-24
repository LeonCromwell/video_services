const Video = require("../models/video.js");
const uploadVideo = require("../middleware/uploadVideo");
const uploadFolder = require("../middleware/uploadFolder");
const convertBufferToHls = require("../middleware/convertHls");
const { storage, bucketName } = require("../../config/google");
const generateUniqueNumber = require("../../utils/generateUniqueNumber.js");

class VideoController {
  // [post] /upload
  async save(req, res) {
    try {
      const file = req.file;
      let fileName = file.originalname.split(".")[0];
      fileName += "-" + generateUniqueNumber();
      const fileUpload = await convertBufferToHls(file, fileName);
      await uploadFolder("./src/temp/" + fileUpload);
      const publicUrl = await uploadVideo(file, fileName);
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
