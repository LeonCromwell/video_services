const uploadVideo = require("../middleware/upload");
const convertBufferToHls = require("../middleware/convertHls");

class UploadController {
  // [post] /upload
  async save(req, res) {
    try {
      const file = req.file;
      await convertBufferToHls(file);
      const publicUrl = await uploadVideo(file);
      return res
        .status(200)
        .json({ message: "Upload success", original_video: publicUrl });
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }
}

module.exports = new UploadController();
