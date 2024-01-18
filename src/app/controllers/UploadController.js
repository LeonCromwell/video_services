const uploadVideo = require("../middleware/upload");
const getBitrateFromBuffer = require("../../utils/getBitrate");

class UploadController {
  // [post] /upload
  async save(req, res) {
    try {
      const file = req.file;
      const bitrate = await getBitrateFromBuffer(file.buffer);
      // const publicUrl = await uploadVideo(file);
      return res
        .status(200)
        .json({ message: "Upload success", url: file.originalname, bitrate });
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }
}

module.exports = new UploadController();
