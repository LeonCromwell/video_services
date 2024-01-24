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
    const idVideo = req.query.idVideo;

    const url = await storage
      .bucket(bucketName)
      .file(`videos/hls_video/${idVideo}/${idVideo}.m3u8`)
      .getSignedUrl({
        action: "read",
        expires: "12-31-2025",
        virtualHostedStyle: false,
      });
    // Gửi nội dung HTML đến client
    res.status(200).json({ url: url });
  }
}

module.exports = new VideoController();
